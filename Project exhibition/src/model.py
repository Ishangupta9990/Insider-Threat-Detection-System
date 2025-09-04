# model.py - One-Class SVM pipeline: fit, save, load, score

from pathlib import Path
import joblib
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import OneClassSVM
from config import MODEL_PATH, OCSVM_NU, OCSVM_KERNEL, OCSVM_GAMMA
import numpy as np

def build_pipeline():
    return Pipeline([
        ("scaler", StandardScaler()),
        ("ocsvm", OneClassSVM(nu=OCSVM_NU, kernel=OCSVM_KERNEL, gamma=OCSVM_GAMMA))
    ])

def train_and_save(X_df):
    X = X_df.values.astype(float)
    p = build_pipeline()
    p.fit(X)
    Path(MODEL_PATH).parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(p, MODEL_PATH)
    return p

def load_model():
    if not Path(MODEL_PATH).exists():
        raise FileNotFoundError("Model not found. Please train first.")
    return joblib.load(MODEL_PATH)

def score_window(model, X_df):
    X = X_df.values.astype(float)
    return float(model.decision_function(X.reshape(1, -1))[0])
