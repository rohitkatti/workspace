use petgraph::algo::{is_cyclic_directed, tarjan_scc};
use petgraph::graph::{DiGraph, NodeIndex};
// use petgraph::visit::EdgeRef;
use std::collections::HashMap;

use crate::proto::reasoning::v1::{AnalysisKind, AnalyzeGraphRequest, CycleResult, NodeMetric};
use crate::proto::shared::v1::Graph;

pub struct GraphAnalytics;

impl GraphAnalytics {
    pub fn analyze(request: &AnalyzeGraphRequest) -> AnalyticsResult {
        let graph = match &request.base_graph {
            Some(g) => g,
            None => return AnalyticsResult::empty(),
        };

        let kinds: Vec<AnalysisKind> = request
            .kinds
            .iter()
            .filter_map(|&k| AnalysisKind::try_from(k).ok())
            .collect();

        // Build petgraph
        let (pg, node_index_map, index_node_map) = build_digraph(graph);

        let mut metrics: Vec<NodeMetric> = Vec::new();
        let mut cycles: Vec<CycleResult> = Vec::new();
        let mut warnings: Vec<String> = Vec::new();

        for kind in &kinds {
            match kind {
                AnalysisKind::Centrality => {
                    let degree_metrics = degree_centrality(graph, &pg, &node_index_map);
                    metrics.extend(degree_metrics);
                }

                AnalysisKind::Cycles => {
                    if is_cyclic_directed(&pg) {
                        let sccs = tarjan_scc(&pg);
                        for scc in sccs {
                            if scc.len() > 1 {
                                let node_ids: Vec<String> = scc
                                    .iter()
                                    .filter_map(|idx| index_node_map.get(idx))
                                    .cloned()
                                    .collect();
                                cycles.push(CycleResult { node_ids });
                            }
                        }
                    }
                }

                AnalysisKind::Influence => {
                    let influence_metrics = influence_score(graph, &pg, &node_index_map);
                    metrics.extend(influence_metrics);
                }

                AnalysisKind::ShortestPath => {
                    warnings.push("Shortest path analysis not yet implemented".into());
                }

                _ => {}
            }
        }

        AnalyticsResult {
            metrics,
            cycles,
            warnings,
        }
    }
}

// ── petgraph builder ──────────────────────────────────────────────────────────

fn build_digraph(
    graph: &Graph,
) -> (
    DiGraph<String, f64>,
    HashMap<String, NodeIndex>,
    HashMap<NodeIndex, String>,
) {
    let mut pg: DiGraph<String, f64> = DiGraph::new();
    let mut node_index_map: HashMap<String, NodeIndex> = HashMap::new();
    let mut index_node_map: HashMap<NodeIndex, String> = HashMap::new();

    for node in &graph.nodes {
        let idx = pg.add_node(node.id.clone());
        node_index_map.insert(node.id.clone(), idx);
        index_node_map.insert(idx, node.id.clone());
    }

    for edge in &graph.edges {
        if let (Some(&src), Some(&dst)) = (
            node_index_map.get(&edge.source_id),
            node_index_map.get(&edge.target_id),
        ) {
            pg.add_edge(src, dst, edge.weight);
        }
    }

    (pg, node_index_map, index_node_map)
}

// ── Degree centrality ─────────────────────────────────────────────────────────

fn degree_centrality(
    graph: &Graph,
    pg: &DiGraph<String, f64>,
    node_index_map: &HashMap<String, NodeIndex>,
) -> Vec<NodeMetric> {
    let n = graph.nodes.len() as f64;
    if n <= 1.0 {
        return vec![];
    }

    graph
        .nodes
        .iter()
        .filter_map(|node| {
            let idx = node_index_map.get(&node.id)?;
            let in_degree = pg
                .edges_directed(*idx, petgraph::Direction::Incoming)
                .count() as f64;
            let out_degree = pg
                .edges_directed(*idx, petgraph::Direction::Outgoing)
                .count() as f64;
            let total = (in_degree + out_degree) / (2.0 * (n - 1.0));

            Some(NodeMetric {
                node_id: node.id.clone(),
                metric: "degree_centrality".into(),
                value: (total * 1000.0).round() / 1000.0, // 3 decimal places
            })
        })
        .collect()
}

// ── Influence score ───────────────────────────────────────────────────────────

fn influence_score(
    graph: &Graph,
    pg: &DiGraph<String, f64>,
    node_index_map: &HashMap<String, NodeIndex>,
) -> Vec<NodeMetric> {
    graph
        .nodes
        .iter()
        .filter_map(|node| {
            let idx = node_index_map.get(&node.id)?;

            // Sum of absolute outgoing edge weights
            let score: f64 = pg
                .edges_directed(*idx, petgraph::Direction::Outgoing)
                .map(|e| e.weight().abs())
                .sum();

            Some(NodeMetric {
                node_id: node.id.clone(),
                metric: "influence_score".into(),
                value: (score * 1000.0).round() / 1000.0,
            })
        })
        .collect()
}

// ── Result ────────────────────────────────────────────────────────────────────

pub struct AnalyticsResult {
    pub metrics: Vec<NodeMetric>,
    pub cycles: Vec<CycleResult>,
    pub warnings: Vec<String>,
}

impl AnalyticsResult {
    fn empty() -> Self {
        Self {
            metrics: vec![],
            cycles: vec![],
            warnings: vec!["No graph provided".into()],
        }
    }
}
