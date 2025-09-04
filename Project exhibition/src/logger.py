# logger.py  - samples simple system signals and appends JSON lines to LOG_PATH

import time, json, os
import psutil
from datetime import datetime
from pathlib import Path
from config import LOG_PATH, LOG_INTERVAL_SEC

def sample_behavior():
    now = datetime.now()
    return {
        "timestamp": now.isoformat(),
        "hour": now.hour,
        "weekday": now.weekday(),
        "process_count": len(psutil.pids()),
        "cpu_percent": psutil.cpu_percent(interval=0.0),
        "mem_percent": psutil.virtual_memory().percent
    }

def append_log(rec):
    p = Path(LOG_PATH)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "a", encoding="utf-8") as f:
        f.write(json.dumps(rec) + "\\n")

def run_logger_loop():
    print("[logger] starting sampling every", LOG_INTERVAL_SEC, "s")
    while True:
        rec = sample_behavior()
        append_log(rec)
        time.sleep(LOG_INTERVAL_SEC)

if __name__ == "__main__":
    run_logger_loop()