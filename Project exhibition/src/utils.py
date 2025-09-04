# utils.py - small helpers for event logging and workstation lock

import json
from pathlib import Path
from config import EVENTS_PATH, ENABLE_LOCK_ON_FAIL
import subprocess, sys, os, platform

def append_event(obj):
    p = Path(EVENTS_PATH)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "a", encoding="utf-8") as f:
        f.write(json.dumps(obj) + "\\n")

# Attempt to lock workstation (best-effort)
def lock_workstation():
    if not ENABLE_LOCK_ON_FAIL:
        print("[utils] Lock on fail disabled in config.")
        return False
    system = platform.system()
    try:
        if system == "Windows":
            # Windows lock
            import ctypes
            ctypes.windll.user32.LockWorkStation()
            return True
        elif system == "Linux":
            # Try loginctl or gnome-screensaver
            try:
                subprocess.run(["loginctl", "lock-session"], check=False)
            except Exception:
                subprocess.run(["gnome-screensaver-command", "-l"], check=False)
            return True
        elif system == "Darwin":
            # MacOS: use AppleScript to lock (best-effort)
            subprocess.run(["/usr/bin/osascript", "-e", 'tell application \"System Events\" to keystroke \"q\" using {control down, command down}'], check=False)
            return True
        else:
            return False
    except Exception as e:
        print("[utils] Lock attempt failed:", e)
        return False
