use chrono::Local;
use std::{fs, io::Write, path::PathBuf, process::Command};

const LOG_FILE: &str = "build.log";

enum LogType {
    Process,
    Success,
    Warning,
    Failure,
}

fn log_message(t: LogType, message: &str) {
    let mut file = fs::OpenOptions::new()
        .append(true)
        .create(true)
        .open(LOG_FILE)
        .expect("Failed to open log file");

    let prefix = match t {
        LogType::Success => "[SUCCESS]",
        LogType::Warning => "[WARNING]",
        LogType::Failure => "[FAILURE]",
        LogType::Process => "[PROCESS]",
    };

    writeln!(
        file,
        "{} {} :: {}",
        Local::now().to_rfc3339(),
        prefix,
        message
    )
    .expect("Failed to write to log file");
}

const EXTERNAL_REPOS: &[(&str, &str)] = &[(
    "https://github.com/googleapis/googleapis.git",
    "protos/googleapis",
)];

fn clone_external_repositories() {
    for (repo_url, repo_dest) in EXTERNAL_REPOS {
        if std::path::Path::new(*repo_dest).exists() {
            log_message(
                LogType::Warning,
                &format!("Folder {} already exists, skipping clone.", repo_dest),
            );
            continue;
        }

        let status = Command::new("git")
            .args(&["clone", *repo_url, *repo_dest])
            .status()
            .ok()
            .unwrap();

        if !status.success() {
            log_message(
                LogType::Failure,
                &format!("Failed to clone repository: {}", *repo_url),
            );
        }
    }
}

const PROTOS_DIR: &str = "protos";

fn get_list_of_files(dir: &str, ext: Option<&str>) -> Vec<String> {
    let path_ext = match ext {
        Some(e) => e.to_string(),
        None => "*".to_string(),
    };

    log_message(
        LogType::Warning,
        format!("Processing dir: {:?}", dir).as_str(),
    );

    std::fs::read_dir(dir)
        .unwrap()
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let path = entry.path();

            if path_ext == "*" || path.extension()?.to_str()? == path_ext {
                Some(path.to_str().unwrap().to_owned())
            } else {
                None
            }
        })
        .collect()
}

fn process_proto() {
    let out_dir = PathBuf::from(std::env::var("OUT_DIR").unwrap());
    let descriptor_path = out_dir.join("descriptor.bin");

    log_message(
        LogType::Success,
        &format!(
            "Descriptor file will be generated at: {:?}",
            descriptor_path
        ),
    );

    let proto_files = get_list_of_files(PROTOS_DIR, Some("proto"));
    log_message(
        LogType::Process,
        format!(
            "Following proto files are being processed: {:?}",
            proto_files
        )
        .as_str(),
    );

    tonic_build::configure()
        .file_descriptor_set_path(descriptor_path)
        .compile(&proto_files, &[{ PROTOS_DIR }])
        .ok();
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    fs::write(LOG_FILE, "").expect("Failed to clear log file");

    log_message(LogType::Process, "Starting build process...");
    log_message(LogType::Process, "Cloning external dependencies...");

    clone_external_repositories();

    log_message(LogType::Process, "Processing proto files ...");

    process_proto();

    Ok(())
}
