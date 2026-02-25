pub struct LogBook {
    _file_path: String,
}

const LOGBOOK_FILE: &str = "logs/logbook.txt";
#[allow(dead_code)]
pub enum LogType {
    SUCCESS,
    FAILURE,
    WARNING,
    LOADING,
    DETAILS,
    PROCESS,
}

impl LogBook {
    pub fn new() -> Self {
        LogBook {
            _file_path: LOGBOOK_FILE.to_string(),
        }
    }

    fn log_header(log_type: LogType) -> String {
        match log_type {
            LogType::SUCCESS => "[SUCCESS]".to_string(),
            LogType::FAILURE => "[FAILURE]".to_string(),
            LogType::WARNING => "[WARNING]".to_string(),
            LogType::LOADING => "[LOADING]".to_string(),
            LogType::DETAILS => "[DETAILS]".to_string(),
            LogType::PROCESS => "[PROCESS]".to_string(),
        }
    }

    fn log_at() -> String {
        let now = chrono::Local::now();
        now.format("%Y-%m-%d %H:%M:%S").to_string()
    }

    fn log_message(&self, log_type: LogType, message: &str) {
        let log_entry = format!(
            "{} {} :: {}\n",
            Self::log_at(),
            Self::log_header(log_type),
            message
        );

        std::fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(LOGBOOK_FILE)
            .and_then(|mut file| std::io::Write::write_all(&mut file, log_entry.as_bytes()))
            .expect("Failed to write to logbook");
    }
}

use std::sync::OnceLock;

static LOGBOOK: OnceLock<LogBook> = OnceLock::new();

pub fn get_global_logbook() -> &'static LogBook {
    LOGBOOK.get_or_init(|| LogBook::new())
}

pub fn log_message(log_type: LogType, message: &str, log_book: Option<&LogBook>) {
    if let Some(lb) = log_book {
        lb.log_message(log_type, message);
    } else {
        get_global_logbook().log_message(log_type, message);
    }
}

pub fn clear_logbook(log_book: Option<&LogBook>) {
    if let Some(lb) = log_book {
        std::fs::write(&lb._file_path, "").expect("Failed to clear logbook");
    } else {
        std::fs::write(LOGBOOK_FILE, "").expect("Failed to clear logbook");
    }
}
