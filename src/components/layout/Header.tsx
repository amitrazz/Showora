import { useThemeStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell } from "lucide-react";
import { GlobalSearch } from "@/components/common/GlobalSearch";

export function Header() {
  const { theme, setTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-background/80 backdrop-blur-xl px-6 supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex items-center gap-4">
        {/* Breadcrumb would go here */}
        <div className="text-sm font-medium text-muted-foreground hidden sm:flex items-center gap-2">
          <span>Showora</span>
          <span>/</span>
          <span className="text-foreground">Dashboard</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <GlobalSearch />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full hover:bg-muted/50"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-muted/50">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
        </Button>
      </div>
    </header>
  );
}
