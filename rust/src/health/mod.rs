use tonic::{Request, Response, Status};

use crate::proto::shared::v1::{
    health_server::{Health, HealthServer},
    HealthCheckRequest, HealthCheckResponse,
};

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

pub fn get_service() -> HealthServer<MyHealth> {
    // health_server::HealthServer::new(MyHealth::default())
    HealthServer::new(MyHealth::default())
}
