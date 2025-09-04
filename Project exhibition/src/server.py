# Project exhibition/src/server.py
import json
import time
from pathlib import Path
from threading import Thread
from typing import List, Optional

from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from config import (
    LOG_PATH, EVENTS_PATH, MODEL_PATH,
    ROLLING_WINDOW, SOFT_ANOMALY_THRESHOLD, HARD_ANOMALY_THRESHOLD
)
from features import load_logs, aggregate_window
from model import load_model, build_pipeline  # your file provides these
from utils import append_event

# --------- FastAPI app ----------
app = FastAPI(title="AI User Threat Detection API")

# CORS: allow Vite dev (5173) and your Express server (5173/5174)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# --------- In-memory detector state ----------
state = {
    "last_score": None,
    "last_status": "init",
    "last_event": None,
    "model_loaded": False,
}

def score_once():
    """Compute one anomaly score from latest window and update state."""
    try:
        df = load_logs()
        X = aggregate_window(df, window=ROLLING_WINDOW)
        if X is None:
            state["last_status"] = "waiting_for_data"
            return None

        # load model if available; if not, build a fresh pipeline to avoid crashes
        try:
            model = load_model()
            state["model_loaded"] = True
        except Exception:
            model = build_pipeline()  # untrained; decision_function will be meaningless
            state["model_loaded"] = False

        # decision_function: higher => more normal (your config is tuned to that)
        # To avoid importing an extra score_window, call the pipeline directly
        score = float(model.decision_function(X.values.astype(float))[0])
        state["last_score"] = score

        if score <= HARD_ANOMALY_THRESHOLD:
            status = "hard_anomaly"
        elif score <= SOFT_ANOMALY_THRESHOLD:
            status = "soft_anomaly"
        else:
            status = "normal"

        state["last_status"] = status
        ev = {"timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
              "type": "status",
              "score": score,
              "status": status}
        state["last_event"] = ev
        append_event(ev)
        return ev
    except Exception as e:
        state["last_status"] = f"error: {e}"
        append_event({"timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                      "type": "error", "msg": str(e)})
        return None

def background_loop():
    while True:
        score_once()
        time.sleep(5)  # poll every 5s

@app.on_event("startup")
def on_startup():
    Thread(target=background_loop, daemon=True).start()

# --------- Models for POST bodies ----------
class VerifyBody(BaseModel):
    ok: Optional[bool] = None
    # (extend here if you later pass typing timings)

class EnrollBody(BaseModel):
    samples: List[List[float]] = []
    sentence: Optional[str] = ""

# --------- API ---------
@app.get("/api/status")
def api_status():
    return JSONResponse({
        "last_score": state["last_score"],
        "last_status": state["last_status"],
        "model_loaded": state["model_loaded"]
    })

@app.get("/api/logs")
def api_logs(n: int = 100):
    p = Path(LOG_PATH)
    rows = []
    if p.exists():
        with p.open("r", encoding="utf-8") as f:
            for line in f:
                try:
                    rows.append(json.loads(line))
                except:
                    pass
    return JSONResponse(rows[-n:])

@app.get("/api/events")
def api_events(n: int = 200):
    p = Path(EVENTS_PATH)
    rows = []
    if p.exists():
        with p.open("r", encoding="utf-8") as f:
            for line in f:
                try:
                    rows.append(json.loads(line))
                except:
                    pass
    return JSONResponse(rows[-n:])

@app.post("/api/verify")
def api_verify(body: VerifyBody):
    # Minimal: log verifier decision. (Later you can implement typing biometrics.)
    ok = bool(body.ok)
    ev = {"timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
          "type": "verification", "result": ok}
    append_event(ev)
    if ok:
        state["last_status"] = "normal"
    return JSONResponse({"ok": True})

@app.post("/api/enroll")
def api_enroll(body: EnrollBody):
    # just persist payload; your later typing code can use it
    Path("data").mkdir(parents=True, exist_ok=True)
    Path("data/typing_profile.json").write_text(json.dumps(body.dict()), encoding="utf-8")
    append_event({"timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"), "type": "enroll"})
    return JSONResponse({"ok": True})

# Run: uvicorn server:app --reload
