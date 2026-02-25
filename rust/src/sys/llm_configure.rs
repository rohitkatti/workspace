use core::panic;

use crate::sys::logger;
pub fn get_llm_client() -> Box<dyn crate::llm::client::LlmClient> {
    let ollama_model = std::env::var("OLLAMA_MODEL").unwrap_or_else(|_| "qwen2.5:7b".to_string());

    if let Some(llm_provider) = std::env::var("LLM_PROVIDER")
        .ok()
        .map(|p| p.to_uppercase())
        .as_deref()
    {
        logger::log_message(
            logger::LogType::DETAILS,
            &format!("LLM_PROVIDER is set to '{}'", llm_provider),
            None,
        );

        match llm_provider {
            "ANTHROPIC" => {
                if let Ok(key) = std::env::var("ANTHROPIC_API_KEY") {
                    logger::log_message(logger::LogType::DETAILS, "Using Anthropic client", None);

                    Box::new(crate::llm::providers::anthropic::AnthropicClient::new(key))
                } else {
                    logger::log_message(
                        logger::LogType::FAILURE,
                        "LLM_PROVIDER is set to 'ANTHROPIC' but ANTHROPIC_API_KEY is not set",
                        None,
                    );
                    panic!("LLM_PROVIDER is set to 'ANTHROPIC' but ANTHROPIC_API_KEY is not set.");
                }
            }
            "OLLAMA" => {
                logger::log_message(
                    logger::LogType::DETAILS,
                    &format!("Using Ollama client with model: {}", ollama_model),
                    None,
                );

                Box::new(crate::llm::providers::ollama::OllamaClient::new(
                    ollama_model,
                ))
            }
            "MOCK" => {
                logger::log_message(logger::LogType::DETAILS, "Using mock client", None);
                Box::new(crate::llm::providers::mock::MockLlmClient::new(vec![
                    Ok(r#"{
                        "id": "mock-concept",
                        "nodes": [
                            {"id": "interest-rates", "label": "Interest Rates", "kind": 1, "properties": [
                                {"key": "description", "string_payload": "Central bank rate"}
                            ]},
                            {"id": "consumer-spending", "label": "Consumer Spending", "kind": 1, "properties": [
                                {"key": "description", "string_payload": "Household expenditure"}
                            ]},
                            {"id": "economic-growth", "label": "Economic Growth", "kind": 1, "properties": [
                                {"key": "description", "string_payload": "GDP growth rate"}
                            ]}
                        ],
                        "edges": [
                            {"id": "e1", "source_id": "interest-rates", "target_id": "consumer-spending", "kind": 1, "weight": -0.8, "properties": [
                                {"key": "rationale", "string_payload": "Higher rates reduce borrowing"}
                            ]},
                            {"id": "e2", "source_id": "consumer-spending", "target_id": "economic-growth", "kind": 1, "weight": 0.7, "properties": [
                                {"key": "rationale", "string_payload": "Spending drives growth"}
                            ]}
                        ],
                        "meta": [
                            {"key": "topic", "string_payload": "macroeconomics"}
                        ]
                    }"#.to_string()),
                    Ok(r#"[
                        {
                            "algorithm_id": "betweenness_centrality",
                            "name": "Betweenness Centrality",
                            "rationale": "Identifies bridge nodes",
                            "confidence": 0.92,
                            "parameters": [{"key": "normalized", "value": "true"}]
                        }
                    ]"#.to_string()),
                ]))
            }
            _ => {
                logger::log_message(
                    logger::LogType::FAILURE,
                    &format!("LLM_PROVIDER '{}' is not recognized", llm_provider),
                    None,
                );
                panic!(
                    "LLM_PROVIDER '{}' is not recognized. Use 'ANTHROPIC', 'OLLAMA', or 'MOCK'.",
                    llm_provider
                );
            }
        }
    } else {
        logger::log_message(logger::LogType::FAILURE, "LLM_PROVIDER is not set", None);
        panic!(
            "LLM_PROVIDER environment variable is not set. Use 'ANTHROPIC', 'OLLAMA', or 'MOCK'."
        );
    }
}

// pub fn get_llm_client() -> Box<dyn crate::llm::client::LlmClient> {

//     // logger::log_message(
//     //     logger::LogType::WARNING,
//     //     "No LLM configuration found (ANTHROPIC_API_KEY or OLLAMA_MODEL) — using mock client",
//     //     None,
//     // );

//     // Box::new(crate::llm::providers::mock::MockLlmClient::new(vec![
//     //     Ok(r#"{
//     //         "id": "mock-concept",
//     //         "nodes": [
//     //             {"id": "interest-rates", "label": "Interest Rates", "kind": 1, "properties": [
//     //                 {"key": "description", "string_payload": "Central bank rate"}
//     //             ]},
//     //             {"id": "consumer-spending", "label": "Consumer Spending", "kind": 1, "properties": [
//     //                 {"key": "description", "string_payload": "Household expenditure"}
//     //             ]},
//     //             {"id": "economic-growth", "label": "Economic Growth", "kind": 1, "properties": [
//     //                 {"key": "description", "string_payload": "GDP growth rate"}
//     //             ]}
//     //         ],
//     //         "edges": [
//     //             {"id": "e1", "source_id": "interest-rates", "target_id": "consumer-spending", "kind": 1, "weight": -0.8, "properties": [
//     //                 {"key": "rationale", "string_payload": "Higher rates reduce borrowing"}
//     //             ]},
//     //             {"id": "e2", "source_id": "consumer-spending", "target_id": "economic-growth", "kind": 1, "weight": 0.7, "properties": [
//     //                 {"key": "rationale", "string_payload": "Spending drives growth"}
//     //             ]}
//     //         ],
//     //         "meta": [
//     //             {"key": "topic", "string_payload": "macroeconomics"}
//     //         ]
//     //     }"#.to_string()),
//     //     Ok(r#"[
//     //         {
//     //             "algorithm_id": "betweenness_centrality",
//     //             "name": "Betweenness Centrality",
//     //             "rationale": "Identifies nodes that act as bridges in the causal graph",
//     //             "confidence": 0.92,
//     //             "parameters": [{"key": "normalized", "value": "true"}]
//     //         }
//     //     ]"#.to_string()),
//     // ]))
// }
