use serde_json::Value;
use std::time::Duration;
use tokio::time::sleep;

use crate::llm::client::LlmClient;
use crate::llm::schema_validator::{SchemaValidator, ValidationTarget};
use crate::proto::shared::v1::Graph; // adjust path to match your generated proto types
use crate::proto::shared::v1::{EdgeKind, NodeKind};

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_RETRIES: u8 = 3;
const RETRY_DELAY_MS: u64 = 500;

// ── Error types ──────────────────────────────────────────────────────────────

#[derive(Debug)]
pub enum GatewayError {
    ApiError(String),
    ExhaustedRetries { attempts: u8, last_error: String },
}

impl std::fmt::Display for GatewayError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            GatewayError::ApiError(e) => write!(f, "LLM API error: {e}"),
            GatewayError::ExhaustedRetries {
                attempts,
                last_error,
            } => write!(f, "Exhausted {attempts} retries. Last error: {last_error}"),
        }
    }
}

// ── Output types ─────────────────────────────────────────────────────────────

#[derive(Debug)]
pub struct StructuredOutput {
    pub graph: Graph,
    pub confidence: f64,
    pub warnings: Vec<String>,
    pub attempts: u8,
}

// Domain validation result
struct DomainResult {
    warnings: Vec<String>,
    confidence: f64,
}

// ── Gateway ──────────────────────────────────────────────────────────────────
pub struct LlmGateway {
    client: Box<dyn LlmClient>,
    schema_validator: SchemaValidator,
}

// pub struct LlmGateway {
//     client: LlmClient, // your HTTP client wrapper
//     schema_validator: SchemaValidator,
// }

impl LlmGateway {
    // pub fn new(client: LlmClient) -> Self {
    //     Self {
    //         client,
    //         schema_validator: SchemaValidator::new(),
    //     }
    // }

    pub fn new(client: Box<dyn LlmClient>) -> Self {
        Self {
            client,
            schema_validator: SchemaValidator::new(),
        }
    }

    pub async fn structure_input(
        &self,
        raw_input: &str,
        target: ValidationTarget,
    ) -> Result<StructuredOutput, GatewayError> {
        let mut last_error = String::new();
        let mut previous_output: Option<String> = None;

        for attempt in 1..=MAX_RETRIES {
            if attempt > 1 {
                sleep(Duration::from_millis(RETRY_DELAY_MS)).await;
            }

            // Build prompt — correction prompt on retry
            let prompt = match previous_output.as_deref() {
                None => self.build_initial_prompt(raw_input, &target),
                Some(bad) => self.build_correction_prompt(raw_input, &target, bad, &last_error),
            };

            // Stage 1: Call LLM
            let raw = match self.client.complete(&prompt).await {
                Ok(r) => r,
                Err(e) => {
                    last_error = format!("API error: {e}");
                    continue;
                }
            };

            // Stage 2: Parse JSON
            let json: Value = match serde_json::from_str(&raw) {
                Ok(v) => v,
                Err(e) => {
                    last_error = format!("Invalid JSON: {e}");
                    previous_output = Some(raw.to_owned());
                    continue;
                }
            };

            // Stage 3: Schema validation
            if let Err(e) = self.schema_validator.validate(&json, &target) {
                last_error = format!("Schema violation: {e}");
                previous_output = Some(raw.to_owned());
                continue;
            }

            // Stage 4: Deserialize into Graph
            let graph: Graph = match serde_json::from_value(json) {
                Ok(g) => g,
                Err(e) => {
                    last_error = format!("Deserialization failed: {e}");
                    previous_output = Some(raw.to_owned());
                    continue;
                }
            };

            // Stage 5: Domain validation
            let DomainResult {
                warnings,
                confidence,
            } = self.domain_validate(&graph, &target);

            return Ok(StructuredOutput {
                graph,
                confidence,
                warnings,
                attempts: attempt,
            });
        }

        Err(GatewayError::ExhaustedRetries {
            attempts: MAX_RETRIES,
            last_error,
        })
    }

    // ── Prompt builders ──────────────────────────────────────────────────────

    fn build_initial_prompt(&self, raw_input: &str, target: &ValidationTarget) -> String {
        let schema = self.schema_for_prompt(target);
        format!(
            "You are a structured data extraction engine. \
             Return ONLY valid JSON matching this schema. \
             No markdown, no preamble, no explanation.\n\n\
             Schema:\n{schema}\n\n\
             Input:\n{raw_input}"
        )
    }

    fn build_correction_prompt(
        &self,
        raw_input: &str,
        target: &ValidationTarget,
        bad_output: &str,
        error: &str,
    ) -> String {
        let schema = self.schema_for_prompt(target);
        format!(
            "Your previous response was invalid. Fix it.\n\n\
             Error: {error}\n\n\
             Your invalid response:\n{bad_output}\n\n\
             Required schema:\n{schema}\n\n\
             Original input:\n{raw_input}\n\n\
             Return only the corrected JSON object:"
        )
    }

    fn schema_for_prompt(&self, target: &ValidationTarget) -> &'static str {
        match target {
            ValidationTarget::Concept => include_str!("../schemas/concept_graph.schema.json"),
            ValidationTarget::Entity => include_str!("../schemas/entity_scene.schema.json"),
            ValidationTarget::Scenario => include_str!("../schemas/scenario.schema.json"),
            ValidationTarget::Algorithm => {
                include_str!("../schemas/algorithm_pipeline.schema.json")
            }
        }
    }

    // ── Domain validation ────────────────────────────────────────────────────

    fn domain_validate(&self, graph: &Graph, target: &ValidationTarget) -> DomainResult {
        let mut warnings = Vec::new();
        let mut confidence = 1.0_f64;

        // Universal checks
        if graph.nodes.is_empty() {
            warnings.push("Empty graph — no nodes extracted".into());
            return DomainResult {
                warnings,
                confidence: 0.0,
            };
        }

        // Orphan node detection
        let connected: std::collections::HashSet<&str> = graph
            .edges
            .iter()
            .flat_map(|e| [e.source_id.as_str(), e.target_id.as_str()])
            .collect();

        for node in &graph.nodes {
            if !connected.contains(node.id.as_str()) {
                warnings.push(format!("Orphan node: '{}'", node.label));
                confidence -= 0.05;
            }
        }

        // Target-specific checks
        match target {
            ValidationTarget::Concept | ValidationTarget::Scenario => {
                let has_causal = graph.edges.iter().any(|e| {
                    matches!(
                        EdgeKind::try_from(e.kind),
                        Ok(EdgeKind::Influences) | Ok(EdgeKind::DependsOn)
                    )
                });

                if !has_causal {
                    warnings.push("No causal edges (INFLUENCES/DEPENDS_ON) found".into());
                    confidence -= 0.1;
                }

                if matches!(target, ValidationTarget::Scenario) {
                    let has_scenario_node = graph
                        .nodes
                        .iter()
                        .any(|n| NodeKind::try_from(n.kind) == Ok(NodeKind::Scenario));

                    if !has_scenario_node {
                        warnings.push(
                            "No SCENARIO node found — missing perturbation entry point".into(),
                        );
                        confidence -= 0.15;
                    }
                }
            }

            ValidationTarget::Entity => {
                let has_spatial = graph.edges.iter().any(|e| {
                    matches!(
                        EdgeKind::try_from(e.kind),
                        Ok(EdgeKind::Adjacent) | Ok(EdgeKind::Contains)
                    )
                });

                if !has_spatial {
                    warnings.push("No spatial edges (ADJACENT/CONTAINS) found".into());
                    confidence -= 0.1;
                }
            }

            ValidationTarget::Algorithm => {
                if self.has_cycle(graph) {
                    warnings.push(
                        "Cycle detected in algorithm pipeline — topological sort will fail".into(),
                    );
                    confidence = 0.0;
                }

                for node in &graph.nodes {
                    let has_id = node.properties.iter().any(|p| p.key == "algorithm_id");
                    if !has_id {
                        warnings.push(format!(
                            "Node '{}' missing required 'algorithm_id' property",
                            node.label
                        ));
                        confidence -= 0.1;
                    }
                }
            }
        }

        confidence = confidence.clamp(0.0, 1.0);
        DomainResult {
            warnings,
            confidence,
        }
    }

    // Simple cycle detection using DFS
    fn has_cycle(&self, graph: &Graph) -> bool {
        use std::collections::{HashMap, HashSet};

        let mut adj: HashMap<&str, Vec<&str>> = HashMap::new();
        for node in &graph.nodes {
            adj.entry(node.id.as_str()).or_default();
        }
        for edge in &graph.edges {
            adj.entry(edge.source_id.as_str())
                .or_default()
                .push(edge.target_id.as_str());
        }

        let mut visited = HashSet::new();
        let mut rec_stack = HashSet::new();

        fn dfs<'a>(
            node: &'a str,
            adj: &HashMap<&'a str, Vec<&'a str>>,
            visited: &mut HashSet<&'a str>,
            rec_stack: &mut HashSet<&'a str>,
        ) -> bool {
            visited.insert(node);
            rec_stack.insert(node);

            if let Some(neighbors) = adj.get(node) {
                for &neighbor in neighbors {
                    if !visited.contains(neighbor) {
                        if dfs(neighbor, adj, visited, rec_stack) {
                            return true;
                        }
                    } else if rec_stack.contains(neighbor) {
                        return true;
                    }
                }
            }
            rec_stack.remove(node);
            false
        }

        for node in &graph.nodes {
            if !visited.contains(node.id.as_str()) {
                if dfs(node.id.as_str(), &adj, &mut visited, &mut rec_stack) {
                    return true;
                }
            }
        }
        false
    }
}
