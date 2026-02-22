use futures::Stream;
use std::pin::Pin;
use tonic::{Request, Response, Status};

use crate::proto::reasoning::v1::{
    reasoning_service_server::{ReasoningService, ReasoningServiceServer},
    AnalyzeGraphRequest, AnalyzeGraphResponse, BuildConceptGraphRequest, BuildConceptGraphResponse,
    RunScenarioRequest, RunScenarioResponse, ScenarioPropagationChunk,
};

#[derive(Debug, Default)]
pub struct MyReasoning;

#[tonic::async_trait]
impl ReasoningService for MyReasoning {
    type RunScenarioStreamStream =
        Pin<Box<dyn Stream<Item = Result<ScenarioPropagationChunk, Status>> + Send + 'static>>;

    async fn build_concept_graph(
        &self,
        request: Request<BuildConceptGraphRequest>,
    ) -> Result<Response<BuildConceptGraphResponse>, Status> {
        let _inner = request.into_inner();

        // Placeholder — will call LLM gateway with STRUCTURE_TARGET_CONCEPT
        Ok(Response::new(BuildConceptGraphResponse::default()))
    }

    async fn run_scenario(
        &self,
        request: Request<RunScenarioRequest>,
    ) -> Result<Response<RunScenarioResponse>, Status> {
        let _inner = request.into_inner();

        // Placeholder — will run petgraph influence propagation
        Ok(Response::new(RunScenarioResponse::default()))
    }

    async fn run_scenario_stream(
        &self,
        request: Request<RunScenarioRequest>,
    ) -> Result<Response<Self::RunScenarioStreamStream>, Status> {
        let _inner = request.into_inner();

        // Placeholder — will stream propagation iterations
        let stream = futures::stream::iter(Vec::<Result<ScenarioPropagationChunk, Status>>::new());
        Ok(Response::new(Box::pin(stream)))
    }

    async fn analyze_graph(
        &self,
        request: Request<AnalyzeGraphRequest>,
    ) -> Result<Response<AnalyzeGraphResponse>, Status> {
        let _inner = request.into_inner();

        // Placeholder — will run petgraph centrality, cycle detection etc
        Ok(Response::new(AnalyzeGraphResponse::default()))
    }
}

pub fn get_service() -> ReasoningServiceServer<MyReasoning> {
    ReasoningServiceServer::new(MyReasoning::default())
}
