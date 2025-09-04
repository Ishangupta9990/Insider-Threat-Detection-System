import multiprocessing
import time
import os

def run_logger():
    from logger import start_logger
    start_logger(interval=5)

def run_detector():
    from detector import detector_loop
    detector_loop(interval=10)

if __name__ == "__main__":
    os.makedirs("events", exist_ok=True)
    print("[*] Starting system...")
    p1 = multiprocessing.Process(target=run_logger)
    p2 = multiprocessing.Process(target=run_detector)
    p1.start(); p2.start()
    p1.join(); p2.join()
