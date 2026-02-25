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
        geometry: &LoadedGeometry,
        params: &[crate::proto::shared::v1::Property],
    ) -> (bool, Vec<crate::proto::shared::v1::Property>) {
        use crate::proto::shared::v1::{property::Value, Property};

        let make_prop = |key: &str, val: &str| Property {
            key: key.to_string(),
            value: Some(Value::StringPayload(val.to_string())),
        };

        match algorithm_id {
            "bounding_box" => {
                // Already computed in stats — return from stored stats
                if let Some(bb) = &geometry.stats.bounding_box {
                    (
                        true,
                        vec![
                            make_prop("min_x", &bb.min_x.to_string()),
                            make_prop("min_y", &bb.min_y.to_string()),
                            make_prop("min_z", &bb.min_z.to_string()),
                            make_prop("max_x", &bb.max_x.to_string()),
                            make_prop("max_y", &bb.max_y.to_string()),
                            make_prop("max_z", &bb.max_z.to_string()),
                        ],
                    )
                } else {
                    (false, vec![make_prop("error", "No bounding box available")])
                }
            }

            "point_count" => (
                true,
                vec![make_prop(
                    "point_count",
                    &geometry.stats.point_count.to_string(),
                )],
            ),

            "vertex_count" => (
                true,
                vec![
                    make_prop("vertex_count", &geometry.stats.vertex_count.to_string()),
                    make_prop("face_count", &geometry.stats.face_count.to_string()),
                ],
            ),

            "convex_hull" => {
                // TODO: implement using parry3d
                // Scaffold:
                // use parry3d::transformation::convex_hull;
                // let pts: Vec<Point3<f32>> = ...parse from geometry.raw_bytes...
                // let hull = convex_hull(&pts);
                // return (true, vec![make_prop("hull_vertex_count", &hull.vertices().len().to_string())])
                (
                    false,
                    vec![make_prop("error", "convex_hull not yet implemented")],
                )
            }

            "point_cloud_filter" => {
                // TODO: implement using pasture-core
                // Scaffold:
                // use pasture_core::containers::BorrowedBuffer;
                // Filter by classification, intensity threshold, return number etc.
                // Params to read: "min_intensity", "classification", "max_distance"
                let _min_intensity = params
                    .iter()
                    .find(|p| p.key == "min_intensity")
                    .and_then(|p| {
                        if let Some(Value::FloatPayload(f)) = &p.value {
                            Some(*f)
                        } else {
                            None
                        }
                    })
                    .unwrap_or(0.0);

                (
                    false,
                    vec![make_prop("error", "point_cloud_filter not yet implemented")],
                )
            }

            "mesh_simplify" => {
                // TODO: implement mesh decimation
                // parry3d doesn't have built-in simplification
                // Consider: meshopt crate or implement quadric error metrics yourself
                (
                    false,
                    vec![make_prop("error", "mesh_simplify not yet implemented")],
                )
            }

            "gis_intersection" => {
                // TODO: implement using sfcgal-rs or geo crate
                // use geo::{Intersects, Polygon};
                (
                    false,
                    vec![make_prop("error", "gis_intersection not yet implemented")],
                )
            }

            "normal_estimation" => {
                // TODO: estimate vertex normals from mesh faces
                // use nalgebra to compute cross products per face
                (
                    false,
                    vec![make_prop("error", "normal_estimation not yet implemented")],
                )
            }

            unknown => (
                false,
                vec![make_prop("error", &format!("Unknown algorithm: {unknown}"))],
            ),
        }
    }
}
