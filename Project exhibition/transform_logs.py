#!/usr/bin/env python3
"""Transform the synthetic logs to match the expected format"""

import json
from datetime import datetime
import random

# Read the synthetic logs and transform them
input_file = "Project exhibition/src/data/synthetic_logs.jsonl"
output_file = "Project exhibition/data/logs.jsonl"

def transform_log_entry(entry):
    """Transform a synthetic log entry to the expected format"""
    # Generate a timestamp (use current time with some offset)
    now = datetime.now()
    timestamp = now.strftime("%Y-%m-%dT%H:%M:%S.%f")
    
    return {
        "timestamp": timestamp,
        "hour": now.hour,
        "weekday": now.weekday(),
        "process_count": entry.get("processes", random.randint(600, 700)),
        "cpu_percent": float(entry.get("cpu", random.uniform(0, 100))),
        "mem_percent": float(entry.get("ram", random.uniform(70, 80)))
    }

transformed_entries = []

try:
    with open(input_file, "r") as f:
        for i, line in enumerate(f):
            if i >= 1000:  # Limit to first 1000 entries
                break
            line = line.strip()
            if line:
                try:
                    entry = json.loads(line)
                    transformed = transform_log_entry(entry)
                    transformed_entries.append(transformed)
                except json.JSONDecodeError:
                    continue

    # Write transformed data
    with open(output_file, "w") as f:
        for entry in transformed_entries:
            f.write(json.dumps(entry) + "
")

    print(f"Transformed {len(transformed_entries)} entries")
    print(f"Sample entry: {transformed_entries[0] if transformed_entries else \"None\"}")

except FileNotFoundError:
    print(f"Input file not found: {input_file}")

