use async_trait::async_trait;
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::time::Duration;

use crate::llm::client::{ClientError, LlmClient};

// ── Request / Response types ──────────────────────────────────────────────────

#[derive(Serialize)]
struct AnthropicRequest<'a> {
    model: &'a str,
    max_tokens: u32,
    messages: Vec<Message<'a>>,
    system: &'a str,
}

#[derive(Serialize)]
struct Message<'a> {
    role: &'a str,
    content: &'a str,
}

#[derive(Deserialize)]
struct AnthropicResponse {
    content: Vec<ContentBlock>,
}

#[derive(Deserialize)]
struct ContentBlock {
    #[serde(rename = "type")]
    kind: String,
    text: Option<String>,
}

#[derive(Deserialize)]
struct AnthropicError {
    error: AnthropicErrorBody,
}

#[derive(Deserialize)]
struct AnthropicErrorBody {
    #[serde(rename = "type")]
    kind: String,
    message: String,
}

// ── Client ────────────────────────────────────────────────────────────────────

pub struct AnthropicClient {
    http: Client,
    api_key: String,
    model: String,
    max_tokens: u32,
}

impl AnthropicClient {
    pub fn new(api_key: String) -> Self {
        let http = Client::builder()
            .timeout(Duration::from_secs(60))
            .build()
            .expect("Failed to build HTTP client");

        Self {
            http,
            api_key,
            model: "claude-sonnet-4-6".to_string(),
            max_tokens: 4096,
        }
    }

    /// Override model if needed
    pub fn with_model(mut self, model: impl Into<String>) -> Self {
        self.model = model.into();
        self
    }

    /// Override max_tokens if needed
    pub fn with_max_tokens(mut self, max_tokens: u32) -> Self {
        self.max_tokens = max_tokens;
        self
    }
}

#[async_trait]
impl LlmClient for AnthropicClient {
    async fn complete(&self, prompt: &str) -> Result<String, ClientError> {
        let body = AnthropicRequest {
            model: &self.model,
            max_tokens: self.max_tokens,
            system: "You are a structured data extraction engine. \
                         Return only valid JSON. No markdown. No explanation.",
            messages: vec![Message {
                role: "user",
                content: prompt,
            }],
        };

        let response = self
            .http
            .post("https://api.anthropic.com/v1/messages")
            .header("x-api-key", &self.api_key)
            .header("anthropic-version", "2023-06-01")
            .header("content-type", "application/json")
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
                let parsed: AnthropicResponse = response
                    .json()
                    .await
                    .map_err(|e| ClientError::Http(e.to_string()))?;

                parsed
                    .content
                    .into_iter()
                    .find(|b| b.kind == "text")
                    .and_then(|b| b.text)
                    .ok_or_else(|| ClientError::Upstream("No text block in response".into()))
            }

            StatusCode::TOO_MANY_REQUESTS => {
                let retry_after_ms = response
                    .headers()
                    .get("retry-after")
                    .and_then(|v| v.to_str().ok())
                    .and_then(|v| v.parse::<u64>().ok())
                    .map(|s| s * 1000) // header is in seconds
                    .unwrap_or(5000);

                Err(ClientError::RateLimit { retry_after_ms })
            }

            StatusCode::UNAUTHORIZED => Err(ClientError::AuthError("Invalid API key".into())),

            status => {
                let err: AnthropicError = response
                    .json()
                    .await
                    .map_err(|e| ClientError::Upstream(e.to_string()))?;

                Err(ClientError::Upstream(format!(
                    "{status} — {}: {}",
                    err.error.kind, err.error.message
                )))
            }
        }
    }
}
