# workspace

install

# macOS targets (native - fast builds)
rustup target add x86_64-apple-darwin      # Intel Mac
rustup target add aarch64-apple-darwin     # Apple Silicon (M1/M2/M3)

# Linux targets (requires cross-compilation)
rustup target add x86_64-unknown-linux-gnu   # Linux x64
rustup target add aarch64-unknown-linux-gnu  # Linux ARM64

# Windows targets
rustup target add x86_64-pc-windows-gnu      # Windows x64 (MinGW)
rustup target add x86_64-pc-windows-msvc     # Windows x64 (MSVC)


cargo build --release
cargo build --target x86_64-pc-windows-msvc --release

cargo build --target i686-pc-windows-msvc --release

cargo build --target x86_64-unknown-linux-gnu --release

cargo build --target aarch64-unknown-linux-gnu --release

cargo build --target x86_64-apple-darwin --release

cargo build --target aarch64-apple-darwin --release 


cross build --release --target x86_64-unknown-linux-gnu
cross build --release --target x86_64-pc-windows-gnu
cross build --release --target aarch64-linux-android


cat target/debug/build/workspace-rust-*/out/shared.v1.rs | grep -A 10 "enum StructureTarget"

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

grpcurl -plaintext localhost:50051 health.v1.Health/Check


ollama pull qwen2.5:7b

qwen2.5:7b is the best choice for this use case — strong JSON instruction following, runs well on Mac, about 4GB download.

ollama serve

curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:7b",
  "prompt": "Return a JSON object with a single key: test. Value: true. Return only JSON.",
  "stream": false
}'

OLLAMA_MODEL=qwen2.5:7b cargo run
OLLAMA_MODEL=mistral:7b cargo run // for mac