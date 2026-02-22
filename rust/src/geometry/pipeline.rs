use petgraph::algo::toposort;
use petgraph::graph::DiGraph;
use std::collections::HashMap;

use crate::geometry::loader::LoadedGeometry;
use crate::proto::geometry::v1::{PipelineStepResult, PipelineSummary};
use crate::proto::shared::v1::Graph;

pub struct PipelineExecutor;

pub struct PipelineResult {
    pub step_results: Vec<PipelineStepResult>,
    pub summary: PipelineSummary,
    pub warnings: Vec<String>,
}

impl PipelineExecutor {
    pub fn execute(geometry: &LoadedGeometry, pipeline: &Graph) -> PipelineResult {
        let mut step_results = Vec::new();
        let mut warnings = Vec::new();
        let mut steps_failed = 0u32;

        // Build petgraph for topological sort
        let mut pg: DiGraph<String, ()> = DiGraph::new();
        let mut node_index_map = HashMap::new();

        for node in &pipeline.nodes {
            let idx = pg.add_node(node.id.clone());
            node_index_map.insert(node.id.clone(), idx);
        }

        for edge in &pipeline.edges {
            if let (Some(&src), Some(&dst)) = (
                node_index_map.get(&edge.source_id),
                node_index_map.get(&edge.target_id),
            ) {
                pg.add_edge(src, dst, ());
            }
        }

        // Topological sort — determines execution order
        let order = match toposort(&pg, None) {
            Ok(o) => o,
            Err(_) => {
                warnings.push("Cycle detected in pipeline — cannot execute".into());
                return PipelineResult {
                    step_results: vec![],
                    summary: PipelineSummary {
                        steps_completed: 0,
                        steps_failed: pipeline.nodes.len() as u32,
                        total_duration_ms: 0.0,
                    },
                    warnings,
                };
            }
        };

        let total_start = std::time::Instant::now();

        // Execute each step in order
        for idx in order {
            let node_id = pg[idx].clone();
            let node = match pipeline.nodes.iter().find(|n| n.id == node_id) {
                Some(n) => n,
                None => continue,
            };

            // Get algorithm_id from node properties
            let algorithm_id = node
                .properties
                .iter()
                .find(|p| p.key == "algorithm_id")
                .and_then(|p| {
                    if let Some(crate::proto::shared::v1::property::Value::StringPayload(s)) =
                        &p.value
                    {
                        Some(s.clone())
                    } else {
                        None
                    }
                })
                .unwrap_or_else(|| node.id.clone());

            let step_start = std::time::Instant::now();

            // ── THIS IS WHERE YOUR ALGORITHMS PLUG IN ────────────────────────
            let (success, outputs) =
                Self::dispatch_algorithm(&algorithm_id, geometry, &node.properties);
            // ─────────────────────────────────────────────────────────────────

            let duration_ms = step_start.elapsed().as_secs_f64() * 1000.0;

            if !success {
                steps_failed += 1;
                warnings.push(format!("Step '{}' failed", algorithm_id));
            }

            step_results.push(PipelineStepResult {
                algorithm_id,
                success,
                duration_ms,
                outputs,
            });
        }

        let steps_completed = step_results.len() as u32 - steps_failed;

        PipelineResult {
            step_results,
            summary: PipelineSummary {
                steps_completed,
                steps_failed,
                total_duration_ms: total_start.elapsed().as_secs_f64() * 1000.0,
            },
            warnings,
        }
    }

    // ── Algorithm dispatch — THIS IS YOURS TO IMPLEMENT ──────────────────────
    fn dispatch_algorithm(
        algorithm_id: &str,
        _geometry: &LoadedGeometry,
        _params: &[crate::proto::shared::v1::Property],
    ) -> (bool, Vec<crate::proto::shared::v1::Property>) {
        match algorithm_id {
            "convex_hull" => {
                // TODO: implement using geo or parry3d
                // let hull = parry3d::convex_hull(...);
                (true, vec![])
            }
            "point_cloud_filter" => {
                // TODO: implement using pasture
                // let filtered = pasture_core::filter(...);
                (true, vec![])
            }
            "mesh_simplify" => {
                // TODO: implement using parry3d
                (true, vec![])
            }
            "bounding_box" => {
                // TODO: compute from geometry stats
                (true, vec![])
            }
            _unknown => (false, vec![]),
        }
    }
}
