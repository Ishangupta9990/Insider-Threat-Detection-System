# src/quick_demo.py
# src/demo.py
import random
import time
import json
from pathlib import Path

LOG_PATH = "data/synthetic_logs.jsonl"  # New file for synthetic logs

def generate_log():
    windows = ["Chrome.exe", "VSCode.exe", "Explorer.exe", "Spotify.exe"]
    log = {
        "cpu": random.randint(20, 80),
        "ram": random.randint(30, 90),
        "processes": random.randint(60, 120),
        "window": random.choice(windows),
        "anomaly_score": round(random.uniform(0.0, 1.0), 2),
        "status": "anomaly" if random.random() < 0.2 else "normal",
        "time": time.strftime("%H:%M:%S")
    }
    return log

def append_log(rec):
    p = Path(LOG_PATH)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "a", encoding="utf-8") as f:
        f.write(json.dumps(rec) + "\n")

if __name__ == "__main__":
    print("Starting synthetic log generator...")
    while True:
        log = generate_log()
        print(json.dumps(log))
        append_log(log)