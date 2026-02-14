#[cfg(test)]
mod tests;

mod factory;

mod manager;

tonic::include_proto!("orchestrator");

use std::sync::LazyLock;
use std::vec;

use orchestrator_server::Orchestrator;

use tonic::{Request, Response, Status};

#[derive(Default)]
pub struct MyOrchestrator {}

use factory::{Factory, IObject};

static FACTORY: LazyLock<Factory> = LazyLock::new(|| Factory::new());

#[tonic::async_trait]
impl Orchestrator for MyOrchestrator {
    async fn send(&self, request: Request<ORequest>) -> Result<Response<OResponse>, Status> {
        let inner = request.into_inner();

        if let Some(object_name) = inner.object_name {
            let object = FACTORY.create(&object_name);

            let response = if let Some(_object) = object {
                OResponse {
                    status: true,
                    message: format!("Object '{}' created successfully", object_name),
                    result: Some(o_response::Result::StringResult("test".to_string())),
                }
            } else {
                // println!("Object not found in factory");
                OResponse {
                    status: false,
                    message: format!("Object '{}' not found in factory", object_name),
                    result: None,
                }
            };

            return Ok(Response::new(response));
        } else {
            Err(Status::invalid_argument("Missing object_name"))
        }
    }
}

pub fn get_service() -> orchestrator_server::OrchestratorServer<MyOrchestrator> {
    orchestrator_server::OrchestratorServer::new(MyOrchestrator::default())
}
