tonic::include_proto!("orchestrator");

use std::vec;

use orchestrator_server::{Orchestrator, OrchestratorServer};

use tonic::{Request, Response, Status};

#[derive(Default)]
pub struct MyOrchestrator {}

#[tonic::async_trait]
impl Orchestrator for MyOrchestrator {
    async fn send(&self, request: Request<ORequest>) -> Result<Response<OResponse>, Status> {
        let response = OResponse {
            status: true,
            message: "WIP".to_string(),
            payload: vec![],
        };

        Ok(Response::new(response))
    }
}
