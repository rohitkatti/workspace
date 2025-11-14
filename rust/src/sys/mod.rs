// use crate::FILE_DESCRIPTOR_SET;
// use tonic_reflection::server::Builder;

// pub async fn start_server() -> Result<(), Box<dyn std::error::Error>> {
//     // let addr: &str = "[::1]:50051".parse().ok().unwrap();

//     let _reflection_service = Builder::configure()
//         .register_encoded_file_descriptor_set(FILE_DESCRIPTOR_SET)
//         .build_v1()?;

//     Ok(())
// }

#[cfg(test)]
mod tests;
