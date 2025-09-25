import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AlertsRules() {
  const [activeFilter, setActiveFilter] = useState("Open");
  const [ruleName, setRuleName] = useState("Unusual Activity");
  const [hourValue, setHourValue] = useState("20");
  const [zScoreValue, setZScoreValue] = useState("1.5");
  const [spikeValue, setSpikeValue] = useState("3.0");
  const { toast } = useToast();

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    toast({
      title: `Filter Applied`,
      description: `Showing ${filter.toLowerCase()} alerts`,
    });
  };

  const handleAlertAction = (action: string, alertTitle: string) => {
    toast({
      title: `Alert ${action}`,
      description: `"${alertTitle}" has been ${action.toLowerCase()}d`,
    });
  };

  const handlePreviewRule = () => {
    toast({
      title: "Rule Preview",
      description: `Previewing rule "${ruleName}" with current parameters`,
    });
  };

  const handleSaveRule = () => {
    toast({
      title: "Rule Saved",
      description: `Rule "${ruleName}" has been saved successfully`,
    });
  };

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
                <Button 
                  variant={activeFilter === "Open" ? "default" : "secondary"} 
                  size="sm"
                  onClick={() => handleFilterChange("Open")}
                >
                  Open
                </Button>
                <Button 
                  variant={activeFilter === "Investigating" ? "default" : "secondary"} 
                  size="sm"
                  onClick={() => handleFilterChange("Investigating")}
                >
                  Investigating
                </Button>
                <Button 
                  variant={activeFilter === "Resolved" ? "default" : "secondary"} 
                  size="sm"
                  onClick={() => handleFilterChange("Resolved")}
                >
                  Resolved
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {["High-Volume Data Exfiltration","Sensitive File Access Anomaly","Unusual App Install"].map((t, i) => (
                <div key={t} className="rounded-md bg-background border p-3">
                  <div className="text-xs text-muted-foreground">{["Critical","High","Medium"][i]}</div>
                  <div className="font-medium">{t}</div>
                  <div className="text-xs text-muted-foreground">Detailed description of the alert condition and context.</div>
                  <div className="mt-3 flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleAlertAction("Acknowledge", t)}
                    >
                      Acknowledge
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleAlertAction("Assign", t)}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-muted/40 border p-4 space-y-4">
          <div className="text-sm font-medium">Rule Editor</div>
          <Input 
            placeholder="Rule Name" 
            value={ruleName} 
            onChange={(e) => setRuleName(e.target.value)}
          />
          <div className="space-y-3">
            <div>
              <div className="text-sm mb-1">Hour of Day (24h format)</div>
              <Input 
                value={hourValue} 
                onChange={(e) => setHourValue(e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm mb-1">Apps Open Z-score</div>
              <Input 
                value={zScoreValue} 
                onChange={(e) => setZScoreValue(e.target.value)}
              />
            </div>
            <div>
              <div className="text-sm mb-1">File Access Spike</div>
              <Input 
                value={spikeValue} 
                onChange={(e) => setSpikeValue(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              onClick={handlePreviewRule}
            >
              Preview
            </Button>
            <Button onClick={handleSaveRule}>Save Rule</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
