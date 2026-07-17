import { Outlet, useNavigate } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuthStore, useSidebarStore, useThemeStore } from "@/store";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function DashboardLayout() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { isOpen } = useSidebarStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <div 
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out min-h-screen", 
          isOpen ? "pl-[292px]" : "pl-[104px]"
        )}
      >
        <Header />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
