import { Outlet, useNavigate } from "@tanstack/react-router";
import { useAuthStore, useThemeStore } from "@/store";
import { useEffect } from "react";

export function AuthLayout() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
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

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}
