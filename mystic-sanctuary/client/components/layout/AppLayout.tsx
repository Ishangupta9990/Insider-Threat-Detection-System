import { PropsWithChildren, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }: PropsWithChildren) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground grid grid-cols-1 md:grid-cols-[16rem_1fr]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`fixed z-50 md:static ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} transition-transform`}>
        <Sidebar />
      </div>
      <div className="flex flex-col min-h-screen">
        <Topbar onToggleMobileNav={() => setMobileOpen((v) => !v)} />
        <main className="flex-1 p-4 md:p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}
