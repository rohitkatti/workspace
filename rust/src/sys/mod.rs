#[cfg(test)]
mod tests;

use tonic::transport::Server;
use tonic_reflection::server::Builder;
use tonic_web::GrpcWebLayer;
use tower_http::cors::{Any, CorsLayer};

use crate::health;

pub async fn start_server() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50051".parse()?;

    let reflection_service = Builder::configure()
        .register_encoded_file_descriptor_set(crate::FILE_DESCRIPTOR_SET)
        .build_v1()?;

    println!("Starting gRPC server on {}", addr);

    // Configure CORS to allow requests from your React app
    let cors = CorsLayer::new()
        .allow_origin(Any) // Or specific: .allow_origin("http://localhost:3000".parse::<HeaderValue>()?)
        .allow_methods(Any)
        .allow_headers(Any)
        .expose_headers(Any);

    Server::builder()
        .accept_http1(true)
        // .layer(CorsLayer::permissive())
        .layer(cors)
        .layer(GrpcWebLayer::new())
        .add_service(reflection_service)
        // .add_service(orchestrator::get_service())
        .add_service(health::get_service())
        .serve(addr)
        .await?;

    Ok(())
}
