import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [dataSource, setDataSource] = useState("/var/log/behavior_log.json");
  const [refreshInterval, setRefreshInterval] = useState("300");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsTestingConnection(false);
      toast({
        title: "Connection Test",
        description: "Successfully connected to data source",
      });
    }, 2000);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "All settings have been saved successfully",
    });
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <div className="space-y-6">
        <section className="rounded-lg bg-muted/40 border p-4 space-y-3">
          <div className="text-sm font-medium">Data Source Configuration</div>
          <Input 
            value={dataSource} 
            onChange={(e) => setDataSource(e.target.value)}
            placeholder="Enter data source path"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleTestConnection}
              disabled={isTestingConnection}
            >
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </section>
        
        <section className="rounded-lg bg-muted/40 border p-4 space-y-3">
          <div className="text-sm font-medium">Data Refresh Interval (seconds)</div>
          <Input 
            type="number"
            value={refreshInterval} 
            onChange={(e) => setRefreshInterval(e.target.value)}
            placeholder="Refresh interval in seconds"
          />
        </section>
        
        <section className="rounded-lg bg-muted/40 border p-4 space-y-3">
          <div className="text-sm font-medium">Alert Destinations</div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Enable in-app toast notifications</div>
            <Switch 
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </section>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save All Settings</Button>
        </div>
      </div>
    </AppLayout>
  );
}
