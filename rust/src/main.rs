// use workspace_rust::sys::start_server;
use workspace_rust::sys::start_server;

#[tokio::main]
async fn main() {
    println!("Hello, world!");

    let _ = start_server().await;
}
