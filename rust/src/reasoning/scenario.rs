use petgraph::graph::{DiGraph, NodeIndex};
use petgraph::visit::EdgeRef;
use std::collections::HashMap;

use crate::proto::reasoning::v1::{
    NodePerturbation, NodeState, PerturbationDirection, ScenarioConfig,
};
use crate::proto::shared::v1::{EdgeKind, Graph};

pub struct ScenarioEngine;

impl ScenarioEngine {
    pub fn run(
        graph: &Graph,
        perturbations: &[NodePerturbation],
        config: &ScenarioConfig,
    ) -> ScenarioResult {
        let max_iterations = if config.max_iterations == 0 {
            10
        } else {
            config.max_iterations
        };
        let convergence_delta = if config.convergence_delta == 0.0 {
            0.001
        } else {
            config.convergence_delta
        };

        // ── Build petgraph DiGraph ────────────────────────────────────────────
        let mut pg: DiGraph<String, f64> = DiGraph::new();
        let mut node_index_map: HashMap<String, NodeIndex> = HashMap::new();

        for node in &graph.nodes {
            let idx = pg.add_node(node.id.clone());
            node_index_map.insert(node.id.clone(), idx);
        }

        for edge in &graph.edges {
            if let (Some(&src), Some(&dst)) = (
                node_index_map.get(&edge.source_id),
                node_index_map.get(&edge.target_id),
            ) {
                // Only include causal edges
                let kind = EdgeKind::try_from(edge.kind).unwrap_or(EdgeKind::Unspecified);
                if matches!(
                    kind,
                    EdgeKind::Influences
                        | EdgeKind::DependsOn
                        | EdgeKind::Supports
                        | EdgeKind::Conflicts
                ) {
                    pg.add_edge(src, dst, edge.weight);
                }
            }
        }

        // ── Initialise node values ────────────────────────────────────────────
        let mut values: HashMap<String, f64> =
            graph.nodes.iter().map(|n| (n.id.clone(), 0.0)).collect();

        let mut perturbed_nodes: HashMap<String, bool> = HashMap::new();

        // Apply perturbations
        for p in perturbations {
            let direction = PerturbationDirection::try_from(p.direction)
                .unwrap_or(PerturbationDirection::Unspecified);

            let delta = match direction {
                PerturbationDirection::Increase => p.magnitude,
                PerturbationDirection::Decrease => -p.magnitude,
                PerturbationDirection::Set => p.initial_value,
                _ => 0.0,
            };

            values.insert(p.node_id.clone(), delta);
            perturbed_nodes.insert(p.node_id.clone(), true);
        }

        // ── Propagation loop ──────────────────────────────────────────────────
        let mut iterations = 0u32;
        let mut converged = false;
        let mut history: Vec<HashMap<String, f64>> = vec![values.clone()];

        for _ in 0..max_iterations {
            iterations += 1;
            let prev = values.clone();
            let mut next = prev.clone();

            // For each node sum weighted influences from predecessors
            for node in &graph.nodes {
                if perturbed_nodes.contains_key(&node.id) {
                    continue; // perturbed nodes hold their value
                }

                if let Some(&idx) = node_index_map.get(&node.id) {
                    let influence: f64 = pg
                        .edges_directed(idx, petgraph::Direction::Incoming)
                        .map(|e| {
                            let src_id = pg[e.source()].clone();
                            let src_val = prev.get(&src_id).copied().unwrap_or(0.0);
                            src_val * e.weight()
                        })
                        .sum();

                    // Clamp to [-1, 1]
                    next.insert(node.id.clone(), influence.clamp(-1.0, 1.0));
                }
            }

            // Check convergence
            let max_delta = graph
                .nodes
                .iter()
                .map(|n| {
                    let old = prev.get(&n.id).copied().unwrap_or(0.0);
                    let new = next.get(&n.id).copied().unwrap_or(0.0);
                    (new - old).abs()
                })
                .fold(0.0_f64, f64::max);

            values = next;
            history.push(values.clone());

            if max_delta < convergence_delta {
                converged = true;
                break;
            }
        }

        // ── Build result ──────────────────────────────────────────────────────
        let baseline = &history[0];
        let node_states: Vec<NodeState> = graph
            .nodes
            .iter()
            .map(|n| {
                let value = values.get(&n.id).copied().unwrap_or(0.0);
                let baseline = baseline.get(&n.id).copied().unwrap_or(0.0);
                NodeState {
                    node_id: n.id.clone(),
                    value,
                    delta: value - baseline,
                    is_perturbed: perturbed_nodes.contains_key(&n.id),
                }
            })
            .collect();

        ScenarioResult {
            node_states,
            iterations,
            converged,
            warnings: vec![],
            history,
        }
    }
}

pub struct ScenarioResult {
    pub node_states: Vec<NodeState>,
    pub iterations: u32,
    pub converged: bool,
    pub warnings: Vec<String>,
    pub history: Vec<HashMap<String, f64>>, // one entry per iteration
}
