import { useState, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { AlertTriangle, Clock, Shield } from "lucide-react";

interface AnomalyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnomalyPopup({ isOpen, onClose }: AnomalyPopupProps) {
  const [resetKey, setResetKey] = useState("");
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");

  // Timer effect for lockout countdown
  useEffect(() => {
    if (lockoutEndTime) {
      const timer = setInterval(() => {
        const now = Date.now();
        const timeLeft = lockoutEndTime - now;
        
        if (timeLeft <= 0) {
          // Lockout expired
          setLockoutEndTime(null);
          setFailedAttempts(0);
          setError("");
          setRemainingTime("");
        } else {
          // Calculate remaining time
          const minutes = Math.floor(timeLeft / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutEndTime]);

  if (!isOpen) return null;

  const isLockedOut = lockoutEndTime && Date.now() < lockoutEndTime;

  const handleReset = () => {
    // Check if currently locked out
    if (isLockedOut) {
      setError(`System locked. Try again in ${remainingTime}.`);
      setResetKey("");
      return;
    }

    if (resetKey === "1234") {
      // Successful reset
      setError("");
      setResetKey("");
      setFailedAttempts(0);
      setLockoutEndTime(null);
      setRemainingTime("");
      onClose();
    } else {
      // Failed attempt
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      setResetKey("");

      if (newFailedAttempts >= 3) {
        // Lock out for 1 hour (3600000 ms)
        const lockoutEnd = Date.now() + (60 * 60 * 1000);
        setLockoutEndTime(lockoutEnd);
        setError("Too many failed attempts. System locked for 1 hour.");
      } else {
        const attemptsLeft = 3 - newFailedAttempts;
        setError(`Invalid reset key. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleReset();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-red-900/90 border border-red-500 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <h2 className="text-xl font-bold text-red-100">SECURITY ALERT</h2>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-red-200 mb-2">
            <strong>ANOMALY DETECTED!</strong>
          </p>
          <p className="text-red-300 text-sm mb-2">
            Unusual user behavior patterns have been identified in the system.
          </p>
          <p className="text-red-300 text-sm">
            • Suspicious file access patterns detected
            • Abnormal CPU and memory usage
            • Irregular process execution times
          </p>
        </div>

        <div className="space-y-4">
          {isLockedOut ? (
            // Lockout state
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-red-300">
                <Shield className="h-5 w-5" />
                <span className="font-medium">SYSTEM LOCKED</span>
              </div>
              <div className="bg-red-800/30 border border-red-600 rounded p-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-red-200">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Time remaining:</span>
                </div>
                <div className="text-2xl font-mono text-red-100">{remainingTime}</div>
                <p className="text-red-400 text-xs">
                  System locked due to multiple failed authentication attempts.
                </p>
              </div>
            </div>
          ) : (
            // Normal input state
            <div>
              <label className="block text-red-200 text-sm font-medium mb-2">
                Enter Reset Key to Continue:
              </label>
              <Input
                type="password"
                value={resetKey}
                onChange={(e) => setResetKey(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter reset key..."
                className="bg-red-800/50 border-red-500 text-red-100 placeholder-red-400"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-xs mt-1">{error}</p>
              )}
              {failedAttempts > 0 && failedAttempts < 3 && (
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="h-3 w-3 text-yellow-400" />
                  <p className="text-yellow-400 text-xs">
                    Warning: {failedAttempts}/3 failed attempts
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleReset}
              disabled={isLockedOut}
              className="flex-1 bg-red-700 hover:bg-red-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLockedOut ? "System Locked" : "Reset System"}
            </Button>
          </div>
          
          <p className="text-red-400 text-xs text-center">
            {isLockedOut 
              ? "System will unlock automatically when timer expires."
              : "Contact system administrator if you don't have the reset key."
            }
          </p>
        </div>
      </div>
    </div>
  );
}