# features.py
import pandas as pd
import json
from pathlib import Path
from config import LOG_PATH

def load_logs(limit: int = None) -> pd.DataFrame:
    """Load logs from JSONL file into a DataFrame."""
    path = Path(LOG_PATH)
    if not path.exists():
        return pd.DataFrame()

    with path.open() as f:
        content = f.read()
        lines = content.split('\n')
        if limit:
            lines = lines[-limit:]

    records = [json.loads(line.strip()) for line in lines if line.strip()]
    if not records:
        return pd.DataFrame()

    return pd.DataFrame(records)

def aggregate_window(df: pd.DataFrame, window: int = 6) -> pd.DataFrame | None:
    """
    Create rolling window features.
    Example: averages of cpu, ram, process_count over last `window` entries.
    """
    if len(df) < window:
        return None

    slice_df = df.tail(window)
    return pd.DataFrame([{
        "cpu_mean": slice_df["cpu_percent"].mean(),
        "ram_mean": slice_df["mem_percent"].mean(),
        "proc_mean": slice_df["process_count"].mean(),
    }])