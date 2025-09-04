import AppLayout from "@/components/layout/AppLayout";

export default function UsersSessions() {
  return (
    <AppLayout>
      <h1 className="text-2xl font-semibold mb-4">Users & Sessions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Alice Johnson","Bob Smith","Charlie Brown","Diana Prince"].map((name, i) => (
          <div key={name} className={`rounded-xl p-4 text-foreground border bg-muted/40`}
          >
            <div className="flex items-center gap-3">
              <img className="h-10 w-10 rounded-full" src={`https://i.pravatar.cc/80?img=${i+3}`} alt="avatar" />
              <div>
                <div className="font-medium">{name}</div>
                <div className="text-xs text-muted-foreground">{["low","medium","high","low"][i]} Risk</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Last Seen: 2024-07-29</div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg bg-muted/40 border p-4">
        <div className="text-sm font-medium mb-2">Session Timeline</div>
        <ul className="space-y-2 text-sm">
          {["Logged in from corporate network (VPN)","Launched Visual Studio Code","Accessed project-alpha/src/main.py","Viewed internal HR memo"].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-muted-foreground w-20">10:{20 + i*5} AM</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
