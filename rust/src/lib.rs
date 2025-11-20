pub(crate) const FILE_DESCRIPTOR_SET: &[u8] = tonic::include_file_descriptor_set!("descriptor");

mod sys;

mod compute;

mod orchestrator;

use tonic::transport::Server;
use tonic_reflection::server::Builder;
use tonic_web::GrpcWebLayer;
use tower_http::cors::{Any, CorsLayer};

pub async fn start_server() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;

    let reflection_service = Builder::configure()
        .register_encoded_file_descriptor_set(FILE_DESCRIPTOR_SET)
        .build_v1()?;

    Server::builder()
        .accept_http1(true)
        .layer(GrpcWebLayer::new()) // enables grpc-web
        .layer(CorsLayer::permissive()) // CORS that works WITH tonic
        .add_service(reflection_service)
        .add_service(orchestrator::get_service())
        .serve(addr)
        .await?;

    Ok(())
}
