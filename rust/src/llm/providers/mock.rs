use async_trait::async_trait;
use std::sync::{Arc, Mutex};

use crate::llm::client::{ClientError, LlmClient};

/// Cycles through a fixed list of responses.
/// Useful for testing retry logic — first response can be bad JSON,
/// second can be a schema violation, third can be valid.
pub struct MockLlmClient {
    responses: Arc<Mutex<Vec<Result<String, ClientError>>>>,
    call_count: Arc<Mutex<u8>>,
}

impl MockLlmClient {
    pub fn new(responses: Vec<Result<String, ClientError>>) -> Self {
        Self {
            responses: Arc::new(Mutex::new(responses)),
            call_count: Arc::new(Mutex::new(0)),
        }
    }

    pub fn call_count(&self) -> u8 {
        *self.call_count.lock().unwrap()
    }
}

#[async_trait]
impl LlmClient for MockLlmClient {
    async fn complete(&self, _prompt: &str) -> Result<String, ClientError> {
        let mut count = self.call_count.lock().unwrap();
        let responses = self.responses.lock().unwrap();
        let index = (*count as usize).min(responses.len() - 1);
        *count += 1;
        match &responses[index] {
            Ok(s) => Ok(s.clone()),
            Err(_) => Err(ClientError::Timeout),
        }
    }
}
