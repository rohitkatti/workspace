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

fn clone_external_repositories() -> Result<(), Box<dyn std::error::Error>> {
    for (repo_url, repo_dest) in EXTERNAL_REPOS {
        if std::path::Path::new(*repo_dest).exists() {
            log_message(
                LogType::Warning,
                &format!("Folder {} already exists, skipping clone.", repo_dest),
            );
            continue;
        }

        log_message(
            LogType::Process,
            &format!("Cloning {} to {}", repo_url, repo_dest),
        );

        let status = Command::new("git")
            .args(&["clone", *repo_url, *repo_dest])
            .status()?;

        if !status.success() {
            log_message(
                LogType::Failure,
                &format!("Failed to clone repository: {}", *repo_url),
            );
            return Err(format!("Git clone failed for {}", repo_url).into());
        } else {
            log_message(
                LogType::Success,
                &format!("Successfully cloned {}", repo_url),
            );
        }
    }
    Ok(())
}

fn get_list_of_files(
    dir: &str,
    ext: Option<&str>,
) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let path_ext = match ext {
        Some(e) => e.to_string(),
        None => "*".to_string(),
    };

    log_message(LogType::Process, &format!("Processing dir: {:?}", dir));

    if !std::path::Path::new(dir).exists() {
        return Err(format!("Directory does not exist: {}", dir).into());
    }

    let files: Vec<String> = std::fs::read_dir(dir)?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let path = entry.path();
            if path_ext == "*" || path.extension()?.to_str()? == path_ext {
                Some(path.to_str().unwrap().to_owned())
            } else {
                None
            }
        })
        .collect();

    log_message(
        LogType::Success,
        &format!("Found {} files with extension {:?}", files.len(), path_ext),
    );

    Ok(files)
}

fn process_proto() -> Result<(), Box<dyn std::error::Error>> {
    let out_dir = PathBuf::from(std::env::var("OUT_DIR")?);
    let descriptor_path = out_dir.join("descriptor.bin");

    log_message(
        LogType::Success,
        &format!(
            "Descriptor file will be generated at: {:?}",
            descriptor_path
        ),
    );

    let protos_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("protos");

    if !protos_dir.exists() {
        let err_msg = format!("Protos directory does not exist: {:?}", protos_dir);
        log_message(LogType::Failure, &err_msg);
        return Err(err_msg.into());
    }

    let proto_files = get_list_of_files(protos_dir.to_str().unwrap(), Some("proto"))?;

    if proto_files.is_empty() {
        let err_msg = format!("No .proto files found in {:?}", protos_dir);
        log_message(LogType::Failure, &err_msg);
        return Err(err_msg.into());
    }

    log_message(
        LogType::Process,
        &format!(
            "Following proto files are being processed: {:?}",
            proto_files
        ),
    );

    // CRITICAL FIX: Use ? instead of .ok() to propagate errors
    tonic_build::configure()
        .file_descriptor_set_path(&descriptor_path)
        .out_dir(&out_dir)
        .compile(&proto_files, &[protos_dir.to_str().unwrap()])?;

    log_message(
        LogType::Success,
        &format!("Successfully compiled {} proto files", proto_files.len()),
    );

    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    std::env::set_var("PROTOC", protobuf_src::protoc());

    fs::write(LOG_FILE, "").expect("Failed to clear log file");
    log_message(LogType::Process, "Starting build process...");

    // Tell Cargo to rerun if proto files change
    println!("cargo:rerun-if-changed=protos/");

    log_message(LogType::Process, "Cloning external dependencies...");
    clone_external_repositories()?;

    log_message(LogType::Process, "Processing proto files...");
    process_proto()?;

    log_message(LogType::Success, "Build process completed successfully!");
    Ok(())
}
