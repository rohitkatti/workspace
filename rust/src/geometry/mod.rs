pub mod loader;
pub mod pipeline;
pub mod store;

use futures::Stream;
use loader::GeometryLoader;
use pipeline::PipelineExecutor;

use std::pin::Pin;
use store::GeometryStore;
use tonic::{Request, Response, Status, Streaming};

use crate::proto::geometry::v1::{
    geometry_chunk::Payload,
    geometry_service_server::{GeometryService, GeometryServiceServer},
    pipeline_result_chunk, ExecutePipelineRequest, GeometryChunk, GeometryResultChunk,
    GeometryResultRequest, PipelineResultChunk, ProcessGeometryResponse,
    SuggestGeometryAlgorithmsRequest, SuggestGeometryAlgorithmsResponse,
};

pub struct MyGeometry {
    store: GeometryStore,
}

impl MyGeometry {
    pub fn new() -> Self {
        Self {
            store: GeometryStore::new(),
        }
    }
}

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

        // First chunk must be metadata
        let first = stream
            .message()
            .await?
            .ok_or_else(|| Status::invalid_argument("Empty stream — missing metadata header"))?;

        let meta = match first.payload {
            Some(Payload::Meta(m)) => m,
            _ => return Err(Status::invalid_argument("First chunk must be GeometryMeta")),
        };

        // Validate file_path exists on disk
        let file_path = meta.file_path.clone();
        if !std::path::Path::new(&file_path).exists() {
            return Err(Status::not_found(format!("File not found: {file_path}")));
        }

        // Read file from disk rather than stream bytes
        // (file is on server disk per our design decision)
        let raw_bytes = std::fs::read(&file_path)
            .map_err(|e| Status::internal(format!("Failed to read file: {e}")))?;

        // Load and extract stats
        let loaded = GeometryLoader::load(meta, raw_bytes).map_err(|e| Status::internal(e))?;

        let stats = loaded.stats.clone();
        let geometry_id = self.store.insert(loaded);

        Ok(Response::new(ProcessGeometryResponse {
            geometry_id,
            stats: Some(stats),
            scene_graph: None, // TODO: wire LLM gateway for scene structuring
            suggestions: vec![],
            warnings: vec![],
            meta: None,
        }))
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
        request: Request<ExecutePipelineRequest>,
    ) -> Result<Response<Self::ExecutePipelineStream>, Status> {
        let inner = request.into_inner();

        let geometry = self.store.get(&inner.geometry_id).ok_or_else(|| {
            Status::not_found(format!(
                "Geometry '{}' not found — call ProcessGeometry first",
                inner.geometry_id
            ))
        })?;

        let pipeline = inner
            .pipeline
            .ok_or_else(|| Status::invalid_argument("Missing pipeline graph"))?;

        let result = PipelineExecutor::execute(&geometry, &pipeline);

        // Build stream of chunks
        let mut chunks: Vec<Result<PipelineResultChunk, Status>> = result
            .step_results
            .into_iter()
            .map(|step| {
                Ok(PipelineResultChunk {
                    payload: Some(pipeline_result_chunk::Payload::StepResult(step)),
                    is_final: false,
                    sequence: 0,
                })
            })
            .collect();

        // Final summary chunk
        chunks.push(Ok(PipelineResultChunk {
            payload: Some(pipeline_result_chunk::Payload::Summary(result.summary)),
            is_final: true,
            sequence: chunks.len() as u32,
        }));

        Ok(Response::new(Box::pin(futures::stream::iter(chunks))))
    }
}

pub fn get_service() -> GeometryServiceServer<MyGeometry> {
    GeometryServiceServer::new(MyGeometry::new())
}
