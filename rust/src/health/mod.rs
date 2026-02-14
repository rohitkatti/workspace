// #[cfg(test)]
// mod tests;

// mod factory;

// mod manager;

tonic::include_proto!("health");

use std::sync::LazyLock;
use std::vec;

// use orchestrator_server::Orchestrator;
use health_server::Health;

use tonic::{Request, Response, Status};

#[derive(Default)]
pub struct MyHealth {}

#[tonic::async_trait]
impl Health for MyHealth {
    async fn check(
        &self,
        request: Request<HealthCheckRequest>,
    ) -> Result<Response<HealthCheckResponse>, Status> {
        let _inner = request.into_inner();

        let response = HealthCheckResponse { healthy: true };

        Ok(Response::new(response))
    }
}

pub fn get_service() -> health_server::HealthServer<MyHealth> {
    health_server::HealthServer::new(MyHealth::default())
}
