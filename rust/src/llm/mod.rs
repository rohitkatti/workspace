pub mod client;
pub mod gateway;
pub mod providers;
pub mod schema_validator;

use tonic::{Request, Response, Status};

use crate::proto::shared::v1::{
    llm_gateway_server::{LlmGateway, LlmGatewayServer},
    property::Value,
    AlgorithmSuggestion, AlgorithmSuggestionRequest, AlgorithmSuggestionResponse, ModuleKind,
    Property, StructureChunk, StructureRequest, StructureResponse, StructureTarget,
};

use futures::Stream;
use std::pin::Pin;

use crate::llm::schema_validator::ValidationTarget;
use crate::llm::{
    client::LlmClient,
    gateway::{GatewayError, LlmGateway as GatewayImpl},
};

use std::sync::Arc;

// #[derive(Default)]
pub struct MyLlm {
    gateway: Arc<GatewayImpl>,
}

impl MyLlm {
    pub fn new(llm_client: Box<dyn LlmClient>) -> Self {
        Self {
            gateway: Arc::new(GatewayImpl::new(llm_client)),
        }
    }
}

fn structure_target_to_validation_target(target: i32) -> Result<ValidationTarget, Status> {
    match StructureTarget::try_from(target) {
        Ok(StructureTarget::Concept) => Ok(ValidationTarget::Concept),
        Ok(StructureTarget::Entity) => Ok(ValidationTarget::Entity),
        Ok(StructureTarget::Scenario) => Ok(ValidationTarget::Scenario),
        Ok(StructureTarget::Algorithm) => Ok(ValidationTarget::Algorithm),
        _ => Err(Status::invalid_argument(
            "Invalid or unspecified structure target",
        )),
    }
}

fn gateway_error_to_status(err: GatewayError) -> Status {
    match err {
        GatewayError::ApiError(e) => Status::internal(format!("LLM API error: {e}")),
        GatewayError::ExhaustedRetries {
            attempts,
            last_error,
        } => Status::internal(format!(
            "Exhausted {attempts} retries. Last error: {last_error}"
        )),
    }
}

#[tonic::async_trait]
impl LlmGateway for MyLlm {
    type StructureInputStreamStream =
        Pin<Box<dyn Stream<Item = Result<StructureChunk, Status>> + Send + 'static>>;

    async fn structure_input(
        &self,
        request: Request<StructureRequest>,
    ) -> Result<Response<StructureResponse>, Status> {
        let inner = request.into_inner();

        let validation_target = structure_target_to_validation_target(inner.target)?;

        let output = self
            .gateway
            .structure_input(&inner.raw_input, validation_target)
            .await
            .map_err(gateway_error_to_status)?;

        let response = StructureResponse {
            graph: Some(output.graph),
            confidence: output.confidence,
            warnings: output.warnings,
            meta: None,
        };

        Ok(Response::new(response))
    }

    async fn structure_input_stream(
        &self,
        request: Request<StructureRequest>,
    ) -> Result<Response<Self::StructureInputStreamStream>, Status> {
        let _inner = request.into_inner();

        // Explicitly typed empty stream placeholder
        let stream = futures::stream::iter(Vec::<Result<StructureChunk, Status>>::new());

        Ok(Response::new(Box::pin(stream)))
    }

    async fn suggest_algorithms(
        &self,
        request: Request<AlgorithmSuggestionRequest>,
    ) -> Result<Response<AlgorithmSuggestionResponse>, Status> {
        let inner = request.into_inner();

        let graph = inner
            .context
            .ok_or_else(|| Status::invalid_argument("Missing graph context"))?;

        let module = ModuleKind::try_from(inner.module).unwrap_or(ModuleKind::Unspecified);

        let suggestions = self
            .gateway
            .suggest_algorithms(&graph, &inner.goal, module)
            .await
            .map_err(gateway_error_to_status)?;

        // Convert to proto AlgorithmSuggestion messages
        let proto_suggestions = suggestions
            .into_iter()
            .map(|s| AlgorithmSuggestion {
                algorithm_id: s.algorithm_id,
                name: s.name,
                rationale: s.rationale,
                confidence: s.confidence,
                parameters: s
                    .parameters
                    .into_iter()
                    .map(|p| Property {
                        key: p.key,
                        value: Some(Value::StringPayload(p.value)),
                    })
                    .collect(),
            })
            .collect();

        Ok(Response::new(AlgorithmSuggestionResponse {
            suggestions: proto_suggestions,
            meta: None,
        }))
    }
}

pub fn get_service(llm_client: Box<dyn LlmClient>) -> LlmGatewayServer<MyLlm> {
    LlmGatewayServer::new(MyLlm::new(llm_client))
}
