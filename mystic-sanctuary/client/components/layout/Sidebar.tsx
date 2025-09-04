import { NavLink } from "react-router-dom";
import { Bell, Settings, Activity, Users, AlertTriangle, LayoutDashboard } from "lucide-react";

const navItemCls = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
    isActive ? "bg-sidebar-accent text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
  }`;

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-sidebar p-4 border-r border-sidebar-border hidden md:flex md:flex-col min-h-screen sticky top-0">
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="h-6 w-6 rounded-sm bg-sidebar-primary"></div>
        <span className="font-semibold text-sm tracking-wide">InsiderThreatDet</span>
      </div>
      <nav className="mt-6 grid gap-1">
        <NavLink to="/" className={navItemCls} end>
          {({ isActive }) => (
            <span className={navItemCls({ isActive })}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </span>
          )}
        </NavLink>
        <NavLink to="/activity" className={({ isActive }) => navItemCls({ isActive })}>
          <Activity className="h-4 w-4" />
          Activity Log
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => navItemCls({ isActive })}>
          <AlertTriangle className="h-4 w-4" />
          Alerts & Rules
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => navItemCls({ isActive })}>
          <Users className="h-4 w-4" />
          Users & Sessions
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => navItemCls({ isActive })}>
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
      </nav>
      <div className="mt-auto text-xs text-muted-foreground px-2 py-4 flex items-center gap-4">
        <a href="#" className="hover:text-foreground">Resources</a>
        <a href="#" className="hover:text-foreground">Legal</a>
      </div>
    </aside>
  );
}
