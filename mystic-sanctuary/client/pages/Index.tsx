// mystic-sanctuary/client/pages/Index.tsx
import { useEffect, useState, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnomalyPopup } from "@/components/ui/anomaly-popup";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Settings, AlertTriangle, Globe, Shield, ShieldAlert, Clock, ExternalLink } from "lucide-react";

type StatusResp = { last_score: number | null; last_status: string; model_loaded: boolean };
type LogRow = { timestamp: string; hour?: number; weekday?: number; process_count?: number; cpu_percent?: number; mem_percent?: number };

export default function Index() {
  const [status, setStatus] = useState<StatusResp | null>(null);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [showAnomalyPopup, setShowAnomalyPopup] = useState(false);
  const [demoScore, setDemoScore] = useState<string>("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    const tick = async () => {
      try {
        const s = await fetch("/api/status").then(r => r.json());
        setStatus(s);
        const l = await fetch("/api/logs?n=24").then(r => r.json());
        setLogs(l);
      } catch (e) {
        // ignore
      }
    };
    tick();
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, []);

  // Demo websites data
  const demoWebsites = useMemo(() => [
    { url: "github.com", status: "safe", timestamp: "14:23", category: "Development", risk: "low" },
    { url: "stackoverflow.com", status: "safe", timestamp: "14:18", category: "Development", risk: "low" },
    { url: "company-portal.corp", status: "safe", timestamp: "14:15", category: "Corporate", risk: "low" },
    { url: "suspicious-site.ru", status: "unsafe", timestamp: "14:12", category: "Unknown", risk: "high" },
    { url: "docs.google.com", status: "safe", timestamp: "14:08", category: "Productivity", risk: "low" },
    { url: "malware-download.net", status: "unsafe", timestamp: "14:05", category: "Malicious", risk: "critical" },
    { url: "linkedin.com", status: "safe", timestamp: "13:58", category: "Social", risk: "medium" },
    { url: "phishing-bank.com", status: "unsafe", timestamp: "13:55", category: "Phishing", risk: "critical" }
  ], []);

  // Existing charts can still use mock data if you like,
  // or derive something simple from logs:
  const filesPerHour = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        h: `${i + 8}:00`,
        v: Math.round(Math.random() * 20) + 5,
      })),
    [],
  );
  const loginsByHour = filesPerHour.map((d) => ({ h: d.h, v: Math.max(2, Math.round(d.v * 0.6)) }));

  // Check for anomaly threshold (scores below -0.5 are considered anomalies)
  const effectiveScore = demoScore ? parseFloat(demoScore) : status?.last_score;
  const isAnomalous = effectiveScore != null && effectiveScore < -0.5;
  
  // Auto-trigger popup when anomaly detected
  useEffect(() => {
    if (isAnomalous && !showAnomalyPopup) {
      setShowAnomalyPopup(true);
    }
  }, [isAnomalous, showAnomalyPopup]);

  const scoreText = effectiveScore != null ? effectiveScore.toFixed(3) : "--";
  const statusText = isAnomalous ? "ANOMALY DETECTED" : (status?.last_status ?? "loading...");
  
  const handleDemoScoreSubmit = () => {
    const score = parseFloat(demoScore);
    if (!isNaN(score)) {
      // The useEffect will automatically trigger popup if score < -0.5
      if (score >= -0.5) {
        // If score is normal, ensure popup is closed
        setShowAnomalyPopup(false);
      }
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            variant="outline" 
            size="sm"
          >
            <Settings className="h-4 w-4 mr-1" />
            Demo Controls
          </Button>
          <div className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${isAnomalous ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
            {isAnomalous && <AlertTriangle className="h-4 w-4" />}
            Status: {statusText} {status?.model_loaded ? "" : "(untrained)"}
          </div>
        </div>
      </div>

      {/* Admin Panel for Demo */}
      {showAdminPanel && (
        <div className="mb-6 p-4 bg-muted/40 border rounded-lg">
          <h3 className="text-sm font-medium mb-3">Demo Controls (For Presentation)</h3>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              step="0.001"
              placeholder="Enter anomaly score (try -0.6)"
              value={demoScore}
              onChange={(e) => setDemoScore(e.target.value)}
              className="w-64"
            />
            <Button onClick={handleDemoScoreSubmit} size="sm">
              Set Score
            </Button>
            <Button 
              onClick={() => {
                setDemoScore("");
                setShowAnomalyPopup(false);
              }} 
              variant="outline" 
              size="sm"
            >
              Reset
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: Scores below -0.5 trigger automatic anomaly alerts. Try -0.6 for demo.
          </p>
        </div>
      )}

      {/* your original grid & cards remain */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-muted/40 border p-4">
          <div className="text-sm text-muted-foreground">Latest score</div>
          <div className="text-3xl font-bold">{scoreText}</div>
        </div>
        <div className="rounded-lg bg-muted/40 border p-4">
          <div className="text-sm text-muted-foreground">Recent logs</div>
          <div className="text-lg">{logs.length} samples</div>
        </div>
        <div className="rounded-lg bg-muted/40 border p-4">
          <div className="text-sm text-muted-foreground">Model</div>
          <div className="text-lg">{status?.model_loaded ? "Loaded" : "Not trained"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="rounded-lg bg-muted/40 border p-4">
          <h2 className="font-medium mb-2">Files Accessed (mock)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filesPerHour}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="h" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="v" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg bg-muted/40 border p-4">
          <h2 className="font-medium mb-2">Logins by Hour (mock)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loginsByHour}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="h" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="v" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Website Activity Monitoring Section */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="rounded-lg bg-muted/40 border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5" />
            <h2 className="font-medium">Recent Website Activity</h2>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Live Monitoring</span>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {demoWebsites.map((site, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  site.status === 'safe' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    site.status === 'safe' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {site.status === 'safe' ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <ShieldAlert className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{site.url}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {site.timestamp}
                      </span>
                      <span>Category: {site.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    site.status === 'safe' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {site.status.toUpperCase()}
                  </div>
                  <div className={`text-xs mt-1 ${
                    site.risk === 'low' ? 'text-green-400' :
                    site.risk === 'medium' ? 'text-yellow-400' :
                    site.risk === 'high' ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    Risk: {site.risk}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-muted-foreground/20">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Sites: {demoWebsites.length}</span>
              <div className="flex gap-4">
                <span className="text-green-400">
                  Safe: {demoWebsites.filter(s => s.status === 'safe').length}
                </span>
                <span className="text-red-400">
                  Unsafe: {demoWebsites.filter(s => s.status === 'unsafe').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnomalyPopup 
        isOpen={showAnomalyPopup} 
        onClose={() => {
          setShowAnomalyPopup(false);
          setDemoScore(""); // Reset demo score when popup is closed
        }} 
      />
    </AppLayout>
  );
}
