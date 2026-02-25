# Stage 1: Build
FROM rust:latest AS builder

WORKDIR /app

ENV SKIP_TS_GEN=true

# Install build dependencies (cmake, protobuf compiler, etc.)
RUN apt-get update && \
    apt-get install -y \
    cmake \
    protobuf-compiler \
    libprotobuf-dev \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests
COPY Cargo.toml Cargo.lock ./
COPY build.rs ./

# Copy source code
COPY src ./src
COPY protos ./protos

# Build the release binary
RUN cargo build --release

FROM debian:bookworm-slim

# Install runtime dependencies (OpenSSL is often needed for Tonic/gRPC)
RUN apt-get update && \
    apt-get install -y ca-certificates libc6 libssl3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/grpcserver /app/grpcserver

RUN chmod +x /app/grpcserver

# gRPC default port
EXPOSE 50051

# Use the "exec" form of CMD for better signal handling (Ctrl+C)
CMD ["./grpcserver"]