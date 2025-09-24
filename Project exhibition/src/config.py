# Configuration - tune thresholds, paths, and policy here.

LOG_PATH = "../data/logs.jsonl"
MODEL_PATH = "../data/model.joblib"
TYPING_PROFILE_PATH = "../data/typing_profile.json"
EVENTS_PATH = "../data/events.jsonl"

# Sampling and windowing
LOG_INTERVAL_SEC = 8          # how often logger samples
ROLLING_WINDOW = 6            # how many samples to aggregate for a detection window

# Detector thresholds (One-Class SVM decision_function; higher is more normal)
SOFT_ANOMALY_THRESHOLD = -0.12
HARD_ANOMALY_THRESHOLD = -0.5

# OCSVM params
OCSVM_NU = 0.05
OCSVM_KERNEL = "rbf"
OCSVM_GAMMA = "scale"

# Lock behavior on failed verification
ENABLE_LOCK_ON_FAIL = False   # set True ONLY if you want the workstation to lock on failure
LOCK_AFTER_FAILS = 2          # number of consecutive failed verifications before locking
