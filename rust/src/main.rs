// use workspace_rust::sys::start_server;
use workspace_rust::sys::logger;
use workspace_rust::sys::start_server;

#[tokio::main]
async fn main() {
    logger::clear_logbook(None); // clear the global logbook at the start of the program

    let _ = start_server().await;
}
