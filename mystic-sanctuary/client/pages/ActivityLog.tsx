// mystic-sanctuary/client/pages/ActivityLog.tsx
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LogRow = { timestamp: string; hour?: number; weekday?: number; process_count?: number; cpu_percent?: number; mem_percent?: number };

export default function ActivityLog() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<LogRow[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data: LogRow[] = await fetch("/api/logs?n=200").then(r => r.json());
        const reversedData = data.reverse(); // newest first → bottom
        setRows(reversedData);
        setFilteredRows(reversedData);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  // Filter rows based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter(row => 
        row.timestamp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.cpu_percent?.toString().includes(searchTerm) ||
        row.mem_percent?.toString().includes(searchTerm) ||
        row.process_count?.toString().includes(searchTerm)
      );
      setFilteredRows(filtered);
    }
  }, [rows, searchTerm]);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Activity Log</h1>
        <Button variant="secondary" onClick={() => window.open("/api/logs?n=1000", "_blank")}>Export JSON</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
        <aside className="rounded-lg bg-muted/40 border p-4 space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Search</div>
            <Input 
              placeholder="Filter by time, CPU, memory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredRows.length} of {rows.length} samples {loading ? "(refreshing…)" : ""}
          </div>
        </aside>

        <div className="rounded-lg bg-muted/40 border p-4 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2">Time</th>
                <th>CPU%</th>
                <th>Mem%</th>
                <th>Proc</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, i) => (
                <tr key={i} className="border-t border-border/40">
                  <td className="py-2">{r.timestamp?.replace("T", " ").slice(0,19) || "-"}</td>
                  <td>{r.cpu_percent ?? "-"}</td>
                  <td>{r.mem_percent ?? "-"}</td>
                  <td>{r.process_count ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

