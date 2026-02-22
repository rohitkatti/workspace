use futures::Stream;
use std::pin::Pin;
use tonic::{Request, Response, Status, Streaming};

use crate::proto::geometry::v1::{
    geometry_service_server::{GeometryService, GeometryServiceServer},
    ExecutePipelineRequest, GeometryChunk, GeometryResultChunk, GeometryResultRequest,
    PipelineResultChunk, ProcessGeometryResponse, SuggestGeometryAlgorithmsRequest,
    SuggestGeometryAlgorithmsResponse,
};

#[derive(Debug, Default)]
pub struct MyGeometry;

#[tonic::async_trait]
impl GeometryService for MyGeometry {
    type StreamGeometryResultStream =
        Pin<Box<dyn Stream<Item = Result<GeometryResultChunk, Status>> + Send + 'static>>;

    type ExecutePipelineStream =
        Pin<Box<dyn Stream<Item = Result<PipelineResultChunk, Status>> + Send + 'static>>;

    async fn process_geometry(
        &self,
        request: Request<Streaming<GeometryChunk>>,
    ) -> Result<Response<ProcessGeometryResponse>, Status> {
        let mut stream = request.into_inner();

        // Read first chunk — must be metadata header
        let first = stream
            .message()
            .await?
            .ok_or_else(|| Status::invalid_argument("Empty stream — missing metadata header"))?;

        let _meta = match first.payload {
            Some(crate::proto::geometry::v1::geometry_chunk::Payload::Meta(m)) => m,
            _ => return Err(Status::invalid_argument("First chunk must be GeometryMeta")),
        };

        // Read remaining chunks — raw file bytes
        let mut _bytes: Vec<u8> = Vec::new();
        while let Some(chunk) = stream.message().await? {
            if let Some(crate::proto::geometry::v1::geometry_chunk::Payload::Data(d)) =
                chunk.payload
            {
                _bytes.extend_from_slice(&d);
            }
        }

        // Placeholder — geometry processing to be implemented
        Ok(Response::new(ProcessGeometryResponse::default()))
    }

    async fn stream_geometry_result(
        &self,
        _request: Request<GeometryResultRequest>,
    ) -> Result<Response<Self::StreamGeometryResultStream>, Status> {
        let stream = futures::stream::iter(Vec::<Result<GeometryResultChunk, Status>>::new());
        Ok(Response::new(Box::pin(stream)))
    }

    async fn suggest_geometry_algorithms(
        &self,
        _request: Request<SuggestGeometryAlgorithmsRequest>,
    ) -> Result<Response<SuggestGeometryAlgorithmsResponse>, Status> {
        Ok(Response::new(SuggestGeometryAlgorithmsResponse::default()))
    }

    async fn execute_pipeline(
        &self,
        _request: Request<ExecutePipelineRequest>,
    ) -> Result<Response<Self::ExecutePipelineStream>, Status> {
        let stream = futures::stream::iter(Vec::<Result<PipelineResultChunk, Status>>::new());
        Ok(Response::new(Box::pin(stream)))
    }
}

pub fn get_service() -> GeometryServiceServer<MyGeometry> {
    GeometryServiceServer::new(MyGeometry::default())
}
