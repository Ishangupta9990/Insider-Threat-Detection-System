// mystic-sanctuary/client/pages/Index.tsx
import { useEffect, useState, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { AnomalyPopup } from "@/components/ui/anomaly-popup";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type StatusResp = { last_score: number | null; last_status: string; model_loaded: boolean };
type LogRow = { timestamp: string; hour?: number; weekday?: number; process_count?: number; cpu_percent?: number; mem_percent?: number };

export default function Index() {
  const [status, setStatus] = useState<StatusResp | null>(null);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [showAnomalyPopup, setShowAnomalyPopup] = useState(false);

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

  const scoreText = status?.last_score != null ? status.last_score.toFixed(3) : "--";
  const statusText = status?.last_status ?? "loading...";

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowAnomalyPopup(true)}
            variant="destructive" 
            size="sm"
          >
            Demo Anomaly
          </Button>
          <div className={`px-3 py-1 rounded text-sm ${statusText.includes("anomaly") ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
            Status: {statusText} {status?.model_loaded ? "" : "(untrained)"}
          </div>
        </div>
      </div>

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

      <AnomalyPopup 
        isOpen={showAnomalyPopup} 
        onClose={() => setShowAnomalyPopup(false)} 
      />
    </AppLayout>
  );
}
