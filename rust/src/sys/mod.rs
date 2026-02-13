#[cfg(test)]
mod tests;

use tonic::transport::Server;
use tonic_reflection::server::Builder;
use tonic_web::GrpcWebLayer;
use tower_http::cors::CorsLayer;

use crate::orchestrator;

pub async fn start_server() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50051".parse()?;

    let reflection_service = Builder::configure()
        .register_encoded_file_descriptor_set(crate::FILE_DESCRIPTOR_SET)
        .build_v1()?;

    println!("Starting gRPC server on {}", addr);

    Server::builder()
        .accept_http1(true)
        .layer(GrpcWebLayer::new())
        .layer(CorsLayer::permissive())
        .add_service(reflection_service)
        .add_service(orchestrator::get_service())
        .serve(addr)
        .await?;

    Ok(())
}
