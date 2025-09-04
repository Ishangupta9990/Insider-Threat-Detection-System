import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Settings() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <div className="space-y-6">
        <section className="rounded-lg bg-muted/40 border p-4 space-y-3">
          <div className="text-sm font-medium">Data Source Configuration</div>
          <Input defaultValue="/var/log/behavior_log.json" />
          <div className="flex justify-end"><Button>Test Connection</Button></div>
        </section>
        <section className="rounded-lg bg-muted/40 border p-4 space-y-3">
          <div className="text-sm font-medium">Data Refresh Interval</div>
          <Input defaultValue="300" />
        </section>
        <section className="rounded-lg bg-muted/40 border p-4 space-y-3">
          <div className="text-sm font-medium">Alert Destinations</div>
          <div className="text-sm text-muted-foreground">Enable in-app toast notifications</div>
        </section>
      </div>
    </AppLayout>
  );
}
