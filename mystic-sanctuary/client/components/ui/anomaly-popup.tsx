import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { AlertTriangle, X } from "lucide-react";

interface AnomalyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnomalyPopup({ isOpen, onClose }: AnomalyPopupProps) {
  const [resetKey, setResetKey] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleReset = () => {
    if (resetKey === "1234") {
      setError("");
      setResetKey("");
      onClose();
    } else {
      setError("Invalid reset key. Please try again.");
      setResetKey("");
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
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleReset}
              className="flex-1 bg-red-700 hover:bg-red-600 text-white"
            >
              Reset System
            </Button>
          </div>
          
          <p className="text-red-400 text-xs text-center">
            Contact system administrator if you don't have the reset key.
          </p>
        </div>
      </div>
    </div>
  );
}