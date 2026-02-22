use async_trait::async_trait;
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::time::Duration;

use crate::llm::client::{ClientError, LlmClient};

#[derive(Serialize)]
struct OllamaRequest<'a> {
    model: &'a str,
    prompt: &'a str,
    stream: bool,
    options: OllamaOptions,
}

#[derive(Serialize)]
struct OllamaOptions {
    temperature: f32,
    num_predict: u32,
}

#[derive(Deserialize)]
struct OllamaResponse {
    response: String,
}

pub struct OllamaClient {
    http: Client,
    model: String,
    base_url: String,
}

impl OllamaClient {
    pub fn new(model: impl Into<String>) -> Self {
        let http = Client::builder()
            .timeout(Duration::from_secs(120)) // local models can be slow
            .build()
            .expect("Failed to build HTTP client");

        Self {
            http,
            model: model.into(),
            base_url: "http://localhost:11434".to_string(),
        }
    }

    pub fn with_base_url(mut self, base_url: impl Into<String>) -> Self {
        self.base_url = base_url.into();
        self
    }
}

#[async_trait]
impl LlmClient for OllamaClient {
    async fn complete(&self, prompt: &str) -> Result<String, ClientError> {
        let body = OllamaRequest {
            model: &self.model,
            prompt,
            stream: false,
            options: OllamaOptions {
                temperature: 0.1, // low temp for structured output
                num_predict: 4096,
            },
        };

        let response = self
            .http
            .post(format!("{}/api/generate", self.base_url))
            .json(&body)
            .send()
            .await
            .map_err(|e| {
                if e.is_timeout() {
                    ClientError::Timeout
                } else {
                    ClientError::Http(e.to_string())
                }
            })?;

        match response.status() {
            StatusCode::OK => {
                let parsed: OllamaResponse = response
                    .json()
                    .await
                    .map_err(|e| ClientError::Http(e.to_string()))?;

                // Strip any markdown fences the model might add
                let clean = parsed
                    .response
                    .trim()
                    .trim_start_matches("```json")
                    .trim_start_matches("```")
                    .trim_end_matches("```")
                    .trim()
                    .to_string();

                Ok(clean)
            }
            status => Err(ClientError::Upstream(format!("Ollama returned {status}"))),
        }
    }
}
