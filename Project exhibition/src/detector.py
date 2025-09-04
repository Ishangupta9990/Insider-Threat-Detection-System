# detector.py - continuous detection loop that sets state and logs events
# This module is used by server.py (the FastAPI app) to run detection

import time
from features import load_logs, aggregate_window
from model import load_model, score_window
from utils import append_event, lock_workstation
from config import HARD_ANOMALY_THRESHOLD, SOFT_ANOMALY_THRESHOLD, ROLLING_WINDOW
from datetime import datetime

# detector state (simple in-memory status that server can read)
state = {
    "last_score": None,
    "last_status": "init",
    "last_event": None,
    "consecutive_failed_verifications": 0
}

def evaluate_once():
    try:
        df = load_logs(limit=ROLLING_WINDOW*3)
        window = aggregate_window(df, window=ROLLING_WINDOW)
        if window is None:
            return None
        model = load_model()
        score = score_window(model, window)
        ts = datetime.now().isoformat()
        state["last_score"] = score
        if score < HARD_ANOMALY_THRESHOLD:
            state["last_status"] = "hard_anomaly"
            event = {"timestamp": ts, "type":"hard", "score": score}
            append_event(event)
            state["last_event"] = event
            return event
        elif score < SOFT_ANOMALY_THRESHOLD:
            state["last_status"] = "soft_anomaly"
            event = {"timestamp": ts, "type":"soft", "score": score}
            append_event(event)
            state["last_event"] = event
            return event
        else:
            state["last_status"] = "normal"
            state["last_event"] = {"timestamp": ts, "type":"normal", "score": score}
            return state["last_event"]
    except Exception as e:
        state["last_status"] = f"error: {e}"
        return None

# Called when verification result is posted by the UI
def handle_verification_result(ok: bool):
    if ok:
        state["consecutive_failed_verifications"] = 0
        append_event({"timestamp": datetime.now().isoformat(), "type":"verification", "result": True})
        return True
    else:
        state["consecutive_failed_verifications"] += 1
        append_event({"timestamp": datetime.now().isoformat(), "type":"verification", "result": False,
                      "fails": state["consecutive_failed_verifications"]})
        # if too many consecutive fails -> lock
        from config import LOCK_AFTER_FAILS
        if state["consecutive_failed_verifications"] >= LOCK_AFTER_FAILS:
            locked = lock_workstation()
            append_event({"timestamp": datetime.now().isoformat(), "type":"lock_action", "locked": locked})
        return False
