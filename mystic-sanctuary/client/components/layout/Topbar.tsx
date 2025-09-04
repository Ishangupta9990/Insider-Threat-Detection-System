import { Bell, Search, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Topbar({ onToggleMobileNav }: { onToggleMobileNav?: () => void }) {
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
      <div className="h-14 flex items-center gap-3 px-4">
        <button className="md:hidden p-2 rounded hover:bg-accent" onClick={onToggleMobileNav}>
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-muted/30 border-border"
            placeholder="Search events, users, rules..."
          />
        </div>
        <button className="p-2 rounded hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 rounded hover:bg-accent">
          <Settings className="h-5 w-5" />
        </button>
        <img
          src="https://i.pravatar.cc/40?img=12"
          alt="avatar"
          className="h-8 w-8 rounded-full border"
        />
      </div>
    </header>
  );
}
