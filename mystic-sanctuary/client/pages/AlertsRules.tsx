import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AlertsRules() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">Alerts & Rules</h1>
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["Open alerts", "Acknowledged", "Muted", "Avg response time"].map((l, i) => (
              <div key={l} className="rounded-lg bg-muted/40 border p-4">
                <div className="text-sm text-muted-foreground">{l}</div>
                <div className="mt-3 text-2xl font-semibold">{i === 3 ? "2h 30m" : [120,45,15][i]}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-muted/40 border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Alerts</div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">Open</Button>
                <Button variant="secondary" size="sm">Investigating</Button>
                <Button size="sm">Resolved</Button>
              </div>
            </div>
            <div className="space-y-3">
              {["High-Volume Data Exfiltration","Sensitive File Access Anomaly","Unusual App Install"].map((t, i) => (
                <div key={t} className="rounded-md bg-background border p-3">
                  <div className="text-xs text-muted-foreground">{["Critical","High","Medium"][i]}</div>
                  <div className="font-medium">{t}</div>
                  <div className="text-xs text-muted-foreground">Detailed description of the alert condition and context.</div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="secondary" size="sm">Acknowledge</Button>
                    <Button variant="secondary" size="sm">Assign</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-muted/40 border p-4 space-y-4">
          <div className="text-sm font-medium">Rule Editor</div>
          <Input placeholder="Rule Name" defaultValue="Unusual Activity" />
          <div className="space-y-3">
            <div>
              <div className="text-sm mb-1">Hour of Day (24h format)</div>
              <Input defaultValue="20" />
            </div>
            <div>
              <div className="text-sm mb-1">Apps Open Z-score</div>
              <Input defaultValue="1.5" />
            </div>
            <div>
              <div className="text-sm mb-1">File Access Spike</div>
              <Input defaultValue="3.0" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Preview</Button>
            <Button>Save Rule</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
