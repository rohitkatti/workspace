use crate::sys::logger;

pub fn get_llm_client() -> Box<dyn crate::llm::client::LlmClient> {
    let llm_client = match std::env::var("ANTHROPIC_API_KEY") {
        Ok(key) => {
            logger::log_message(logger::LogType::DETAILS, "Using Anthropic client", None);
            Box::new(crate::llm::providers::anthropic::AnthropicClient::new(key))
        }
        Err(_) => {
            logger::log_message(
                logger::LogType::WARNING,
                "ANTHROPIC_API_KEY not set — using mock client",
                None,
            );

            Box::new(crate::llm::providers::mock::MockLlmClient::new(vec![
                Ok(r#"{
                    "id": "mock-concept",
                    "nodes": [
                        {"id": "interest-rates", "label": "Interest Rates", "kind": 1, "properties": [
                            {"key": "description", "string_payload": "Central bank rate"}
                        ]},
                        {"id": "consumer-spending", "label": "Consumer Spending", "kind": 1, "properties": [
                            {"key": "description", "string_payload": "Household expenditure"}
                        ]}
                    ],
                    "edges": [
                        {"id": "e1", "source_id": "interest-rates", "target_id": "consumer-spending", "kind": 1, "weight": -0.8, "properties": [
                            {"key": "rationale", "string_payload": "Higher rates reduce borrowing"}
                        ]}
                    ],
                    "meta": [
                        {"key": "topic", "string_payload": "macroeconomics"}
                    ]
                }"#.to_string()),
                // Response 2: SuggestAlgorithms mock
                Ok(r#"[
                    {
                        "algorithm_id": "betweenness_centrality",
                        "name": "Betweenness Centrality",
                        "rationale": "Identifies nodes that act as bridges in the causal graph",
                        "confidence": 0.92,
                        "parameters": [
                            {"key": "normalized", "value": "true"}
                        ]
                    },
                    {
                        "algorithm_id": "influence_propagation",
                        "name": "Influence Propagation",
                        "rationale": "Propagates weighted influence through edges to find downstream effects",
                        "confidence": 0.87,
                        "parameters": [
                            {"key": "max_iterations", "value": "10"},
                            {"key": "convergence_delta", "value": "0.001"}
                        ]
                    }
                ]"#.to_string()),
            ])) as Box<dyn crate::llm::client::LlmClient>
        }
    };

    llm_client
}
