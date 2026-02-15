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
