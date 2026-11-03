# Stage 1: Build High-Assurance Rust Axum Settlement & Spend-Policy Engine
FROM rust:bookworm AS rust-builder
WORKDIR /build/backend-rust
COPY backend-rust/Cargo.toml backend-rust/Cargo.lock* ./
COPY backend-rust/src ./src
RUN cargo build --release

# Stage 2: Build Next.js 16 Operations Cockpit
FROM node:22-bookworm-slim AS web-builder
WORKDIR /build/web
COPY web/package.json web/package-lock.json* ./
RUN npm ci
COPY web/ ./
ENV RUST_BACKEND_INTERNAL_URL="http://127.0.0.1:4180"
RUN npm run build

# Stage 3: Unified Production Runtime (Rust Axum :4180 + Next.js Cockpit :$PORT + Settlement Worker)
FROM node:22-bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=rust-builder /build/backend-rust/target/release/paypal-sentinel-api /usr/local/bin/paypal-sentinel-api
COPY --from=web-builder /build/web /app/web
COPY scripts /app/scripts
COPY LICENSE /app/LICENSE
RUN chmod +x /usr/local/bin/paypal-sentinel-api /app/scripts/start-prod.sh

ENV NODE_ENV=production
ENV PORT=4100
ENV RUST_BACKEND_INTERNAL_URL="http://127.0.0.1:4180"
EXPOSE 4100

CMD ["/app/scripts/start-prod.sh"]
