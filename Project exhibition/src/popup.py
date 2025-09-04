import tkinter as tk
import time
import statistics
import json
import os

PROFILE_FILE = "data/typing_profile.json"

def enroll_typing(prompt="Type this sentence: AI security is important"):
    timings = []
    def on_key(event):
        nonlocal last_time
        now = time.time()
        if last_time:
            timings.append(now - last_time)
        last_time = now

    def on_return(event):
        root.quit()

    root = tk.Tk()
    tk.Label(root, text=prompt).pack()
    entry = tk.Entry(root)
    entry.pack()
    entry.bind("<Key>", on_key)
    entry.bind("<Return>", on_return)
    entry.focus()
    last_time = None
    root.mainloop()
    return timings

def save_profile(samples):
    os.makedirs("data", exist_ok=True)
    avg = [statistics.mean(x) for x in zip(*samples)]
    with open(PROFILE_FILE, "w") as f:
        json.dump(avg, f)

def load_profile():
    with open(PROFILE_FILE) as f:
        return json.load(f)

def verify_typing(prompt="Type this sentence: AI security is important"):
    reference = load_profile()
    timings = enroll_typing(prompt)
    if not timings or len(timings) != len(reference):
        return False
    diff = sum(abs(a-b) for a, b in zip(timings, reference)) / len(reference)
    return diff < 0.08  # tolerance

if __name__ == "__main__":
    # Enroll first
    samples = []
    for _ in range(3):
        print("Please type the sample...")
        samples.append(enroll_typing())
    save_profile(samples)
    print("Profile saved!")
