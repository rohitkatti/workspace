#[cfg(test)]
mod tests;

mod llm_configure;

pub mod logger;

use tonic::transport::Server;
use tonic_reflection::server::Builder;
use tonic_web::GrpcWebLayer;
use tower_http::cors::{Any, CorsLayer};

use crate::{geometry, health, llm, reasoning};

pub async fn start_server() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "0.0.0.0:50051".parse()?;

    let llm_client: Box<dyn crate::llm::client::LlmClient> =
        crate::sys::llm_configure::get_llm_client();

    let reflection_service = Builder::configure()
        .register_encoded_file_descriptor_set(crate::FILE_DESCRIPTOR_SET)
        .build_v1()?;

    // Configure CORS to allow requests from your React app
    let cors = CorsLayer::new()
        .allow_origin(Any) // Or specific: .allow_origin("http://localhost:3000".parse::<HeaderValue>()?)
        .allow_methods(Any)
        .allow_headers(Any)
        .expose_headers(Any);

    logger::log_message(
        logger::LogType::DETAILS,
        &format!("Starting gRPC server on {}", addr),
        None,
    );

    Server::builder()
        .accept_http1(true)
        // .layer(CorsLayer::permissive())
        .layer(cors)
        .layer(GrpcWebLayer::new())
        .add_service(reflection_service)
        .add_service(llm::get_service(llm_client))
        .add_service(health::get_service())
        .add_service(geometry::get_service())
        .add_service(reasoning::get_service())
        .serve(addr)
        .await?;

    Ok(())
}
