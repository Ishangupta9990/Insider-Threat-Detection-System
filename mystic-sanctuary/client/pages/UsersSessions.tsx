import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, Shield, AlertTriangle } from "lucide-react";

export default function UsersSessions() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { toast } = useToast();

  const handleViewDetails = (name: string) => {
    setSelectedUser(name);
    toast({
      title: "User Details",
      description: `Viewing detailed information for ${name}`,
    });
  };

  const handleSecurityAction = (action: string, userName: string) => {
    toast({
      title: `Security Action: ${action}`,
      description: `${action} applied to user ${userName}`,
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'outline';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">Users & Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Alice Johnson","Bob Smith","Charlie Brown","Diana Prince"].map((name, i) => {
          const riskLevel = ["low","medium","high","low"][i];
          const isSelected = selectedUser === name;
          
          return (
            <div 
              key={name} 
              className={`rounded-xl p-4 text-foreground border bg-muted/40 transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img className="h-10 w-10 rounded-full" src={`https://i.pravatar.cc/80?img=${i+3}`} alt="avatar" />
                  <div>
                    <div className="font-medium">{name}</div>
                    <Badge variant={getRiskBadgeVariant(riskLevel)} className="text-xs">
                      {riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                </div>
                {riskLevel === 'high' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                {riskLevel === 'low' && <Shield className="h-4 w-4 text-green-400" />}
              </div>
              
              <div className="text-xs text-muted-foreground mb-3">
                Last Seen: 2024-07-29 • Status: Active
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleViewDetails(name)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                {riskLevel === 'high' && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleSecurityAction("Lock Account", name)}
                  >
                    Lock
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 rounded-lg bg-muted/40 border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">Session Timeline</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Filter</Button>
            <Button size="sm" variant="outline">Export</Button>
          </div>
        </div>
        
        <ul className="space-y-3 text-sm">
          {[
            { action: "Logged in from corporate network (VPN)", risk: "low", time: "10:20 AM" },
            { action: "Launched Visual Studio Code", risk: "low", time: "10:25 AM" },
            { action: "Accessed project-alpha/src/main.py", risk: "medium", time: "10:30 AM" },
            { action: "Viewed internal HR memo", risk: "high", time: "10:35 AM" }
          ].map((event, i) => (
            <li key={i} className={`flex items-center gap-3 p-2 rounded border-l-2 ${
              event.risk === 'high' ? 'border-red-500 bg-red-500/5' :
              event.risk === 'medium' ? 'border-yellow-500 bg-yellow-500/5' :
              'border-green-500 bg-green-500/5'
            }`}>
              <span className="text-muted-foreground w-20 text-xs">{event.time}</span>
              <span className="flex-1">{event.action}</span>
              <Badge 
                variant={event.risk === 'high' ? 'destructive' : event.risk === 'medium' ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {event.risk}
              </Badge>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => toast({
                  title: "Event Details",
                  description: `Viewing details for: ${event.action}`,
                })}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
        
        <div className="mt-4 flex justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({
              title: "Load More",
              description: "Loading more session events...",
            })}
          >
            Load More Events
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
