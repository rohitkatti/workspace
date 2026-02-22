pub mod analytics;
pub mod scenario;

use analytics::GraphAnalytics;
use scenario::ScenarioEngine;

use crate::proto::{
    reasoning::v1::{
        reasoning_service_server::{ReasoningService, ReasoningServiceServer},
        AnalyzeGraphRequest, AnalyzeGraphResponse, BuildConceptGraphRequest,
        BuildConceptGraphResponse, RunScenarioRequest, RunScenarioResponse,
        ScenarioPropagationChunk,
    },
    shared::v1::ResponseMeta,
};
use futures::Stream;
use std::pin::Pin;
use tonic::{Request, Response, Status};

use crate::llm::{
    client::LlmClient, gateway::LlmGateway as GatewayImpl, schema_validator::ValidationTarget,
};
use std::sync::Arc;

// #[derive(Debug, Default)]
pub struct MyReasoning {
    gateway: Arc<GatewayImpl>,
}

impl MyReasoning {
    pub fn new(llm_client: Box<dyn LlmClient>) -> Self {
        Self {
            gateway: Arc::new(GatewayImpl::new(llm_client)),
        }
    }
}

#[tonic::async_trait]
impl ReasoningService for MyReasoning {
    type RunScenarioStreamStream =
        Pin<Box<dyn Stream<Item = Result<ScenarioPropagationChunk, Status>> + Send + 'static>>;

    async fn build_concept_graph(
        &self,
        request: Request<BuildConceptGraphRequest>,
    ) -> Result<Response<BuildConceptGraphResponse>, Status> {
        let inner = request.into_inner();

        if inner.raw_input.trim().is_empty() {
            return Err(Status::invalid_argument("raw_input must not be empty"));
        }

        let output = self
            .gateway
            .structure_input(&inner.raw_input, ValidationTarget::Concept)
            .await
            .map_err(|e| Status::internal(e.to_string()))?;

        let response = BuildConceptGraphResponse {
            graph: Some(output.graph),
            confidence: output.confidence,
            warnings: output.warnings,
            meta: Some(ResponseMeta {
                request_uid: uuid::Uuid::new_v4().to_string(),
                timestamp_ms: chrono::Utc::now().timestamp_millis(),
                session_id: inner.session_id,
            }),
        };

        Ok(Response::new(response))
    }

    async fn run_scenario(
        &self,
        request: Request<RunScenarioRequest>,
    ) -> Result<Response<RunScenarioResponse>, Status> {
        let inner = request.into_inner();

        let graph = inner
            .base_graph
            .ok_or_else(|| Status::invalid_argument("Missing base_graph"))?;

        if inner.perturbations.is_empty() {
            return Err(Status::invalid_argument(
                "At least one perturbation required",
            ));
        }

        let config = inner.config.unwrap_or_default();

        let result = ScenarioEngine::run(&graph, &inner.perturbations, &config);

        Ok(Response::new(RunScenarioResponse {
            node_states: result.node_states,
            warnings: result.warnings,
            iterations: result.iterations,
            converged: result.converged,
            meta: Some(ResponseMeta {
                request_uid: uuid::Uuid::new_v4().to_string(),
                timestamp_ms: chrono::Utc::now().timestamp_millis(),
                session_id: inner.session_id,
            }),
        }))
    }

    async fn run_scenario_stream(
        &self,
        request: Request<RunScenarioRequest>,
    ) -> Result<Response<Self::RunScenarioStreamStream>, Status> {
        let inner = request.into_inner();

        let graph = inner
            .base_graph
            .ok_or_else(|| Status::invalid_argument("Missing base_graph"))?;

        let config = inner.config.unwrap_or_default();
        let result = ScenarioEngine::run(&graph, &inner.perturbations, &config);

        // Stream one chunk per iteration
        let chunks: Vec<Result<ScenarioPropagationChunk, Status>> = result
            .history
            .iter()
            .enumerate()
            .map(|(i, state_map)| {
                let is_final = i == result.history.len() - 1;
                let node_states = graph
                    .nodes
                    .iter()
                    .map(|n| {
                        use crate::proto::reasoning::v1::NodeState;
                        NodeState {
                            node_id: n.id.clone(),
                            value: state_map.get(&n.id).copied().unwrap_or(0.0),
                            delta: 0.0, // simplified for streaming
                            is_perturbed: inner.perturbations.iter().any(|p| p.node_id == n.id),
                        }
                    })
                    .collect();

                Ok(ScenarioPropagationChunk {
                    node_states,
                    iteration: i as u32,
                    is_final,
                    converged: is_final && result.converged,
                })
            })
            .collect();

        Ok(Response::new(Box::pin(futures::stream::iter(chunks))))
    }

    async fn analyze_graph(
        &self,
        request: Request<AnalyzeGraphRequest>,
    ) -> Result<Response<AnalyzeGraphResponse>, Status> {
        let inner = request.into_inner();

        if inner.base_graph.is_none() {
            return Err(Status::invalid_argument("Missing base_graph"));
        }

        if inner.kinds.is_empty() {
            return Err(Status::invalid_argument(
                "At least one AnalysisKind required",
            ));
        }

        let result = GraphAnalytics::analyze(&inner);

        Ok(Response::new(AnalyzeGraphResponse {
            metrics: result.metrics,
            cycles: result.cycles,
            warnings: result.warnings,
            meta: Some(ResponseMeta {
                request_uid: uuid::Uuid::new_v4().to_string(),
                timestamp_ms: chrono::Utc::now().timestamp_millis(),
                session_id: String::new(),
            }),
        }))
    }
}

pub fn get_service(llm_client: Box<dyn LlmClient>) -> ReasoningServiceServer<MyReasoning> {
    ReasoningServiceServer::new(MyReasoning::new(llm_client))
}
