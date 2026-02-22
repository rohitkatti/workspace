use async_trait::async_trait;

// ── Error ─────────────────────────────────────────────────────────────────────

#[derive(Debug)]
pub enum ClientError {
    Http(String),
    RateLimit { retry_after_ms: u64 },
    AuthError(String),
    Timeout,
    Upstream(String), // non-200 from LLM provider
}

impl std::fmt::Display for ClientError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ClientError::Http(e) => write!(f, "HTTP error: {e}"),
            ClientError::RateLimit { retry_after_ms } => {
                write!(f, "Rate limited, retry after {retry_after_ms}ms")
            }
            ClientError::AuthError(e) => write!(f, "Auth error: {e}"),
            ClientError::Timeout => write!(f, "Request timed out"),
            ClientError::Upstream(e) => write!(f, "Upstream error: {e}"),
        }
    }
}

// ── Trait ─────────────────────────────────────────────────────────────────────

// #[async_trait]
// pub trait LlmClient: Send + Sync {
//     /// Send a prompt, get back raw text response.
//     async fn complete(&self, prompt: &str) -> Result<String, ClientError>;
// }
// use async_trait::async_trait;

#[async_trait]
pub trait LlmClient: Send + Sync {
    async fn complete(&self, prompt: &str) -> Result<String, ClientError>;
}
