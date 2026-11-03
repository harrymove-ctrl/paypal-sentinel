use std::net::SocketAddr;

use anyhow::Context;
use paypal_sentinel_api::{build_router, AppState};
use tokio::net::TcpListener;
use tracing::info;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "paypal_sentinel_api=info,tower_http=info".into()),
        )
        .init();

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|raw| raw.parse().ok())
        .unwrap_or(4180);

    let state = AppState::new_default();
    let mode = state.paypal.mode_label();
    let app = build_router(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = TcpListener::bind(addr)
        .await
        .with_context(|| format!("failed to bind Rust PayPal Sentinel API on {addr}"))?;

    info!(
        "PayPal Sentinel Rust API listening on http://127.0.0.1:{port} (mode: {mode})"
    );

    axum::serve(listener, app)
        .await
        .context("PayPal Sentinel Rust API server terminated unexpectedly")?;

    Ok(())
}
