import { useThemeStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { useLocation, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    { id: 1, title: "New Sale Completed", time: "10m ago", type: "success", text: "Sale #SL-89230 for Komaki SE 2.0 completed." },
    { id: 2, title: "Low Stock Alert", time: "1h ago", type: "warning", text: "XGT KM (Red) inventory is below threshold." },
    { id: 3, title: "Payment Clearance Required", time: "3h ago", type: "info", text: "Invoice #INV-2026-004 has outstanding balance due today." },
  ];

  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-background/80 backdrop-blur-xl px-6 supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex items-center gap-4">
        {/* Dynamic Breadcrumbs */}
        <div className="text-sm font-medium text-muted-foreground hidden sm:flex items-center gap-2 capitalize">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Showora</Link>
          {pathSegments.length > 0 ? (
            pathSegments.map((segment, idx) => {
              const routePath = `/${pathSegments.slice(0, idx + 1).join("/")}`;
              const isLast = idx === pathSegments.length - 1;
              const formattedName = segment.replace(/-/g, " ");
              return (
                <div key={routePath} className="flex items-center gap-2">
                  <span>/</span>
                  {isLast ? (
                    <span className="text-foreground font-semibold">{formattedName}</span>
                  ) : (
                    <Link to={routePath as any} className="hover:text-foreground transition-colors">
                      {formattedName}
                    </Link>
                  )}
                </div>
              );
            })
          ) : (
            <>
              <span>/</span>
              <span className="text-foreground font-semibold">Dashboard</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <GlobalSearch />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full hover:bg-muted/50"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted/50" title="Notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="right" className="w-80 p-0 shadow-xl border-border bg-card">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>}
              </div>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setUnreadCount(0)}>
                  Mark all read
                </Button>
              )}
            </div>
            <div className="divide-y divide-border/50 max-h-80 overflow-y-auto">
              {notifications.map((item) => (
                <div key={item.id} className="p-3.5 hover:bg-muted/40 transition-colors flex items-start gap-3 text-xs">
                  {item.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />}
                  {item.type === "warning" && <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />}
                  {item.type === "info" && <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center gap-2">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

