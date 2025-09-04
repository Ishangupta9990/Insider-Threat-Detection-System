# train_model.py
import pandas as pd
from features import load_logs, aggregate_window
from model import train_and_save

if __name__ == "__main__":
    print("Loading logs...")
    df = load_logs(limit=1000000)

    if df.empty:
        print("No logs found. Please run logger.py or demo.py first.")
        exit(1)

    print(f"Loaded {len(df)} logs.")

    windows = []
    for i in range(6, len(df)):
        win = aggregate_window(df.iloc[:i], window=6)
        if win is not None:
            windows.append(win.iloc[0].to_dict())

    if not windows:
        print("Not enough data for training. Run logger.py longer.")
        exit(1)

    X = pd.DataFrame(windows)
    print(f"Training model on {len(X)} windows...")

    train_and_save(X)

    print("✅ Training complete.")
    print("Model saved to disk.")