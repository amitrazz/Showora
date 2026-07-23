import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useSidebarStore, useAuthStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Bike, 
  IndianRupee, 
  ShoppingCart, 
  Receipt, 
  Wallet, 
  BarChart3, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/features/auth/hooks";
import { useGeneralSettings } from "@/features/settings/hooks";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Inventory", href: "/inventory", icon: Bike },
  { name: "Sales", href: "/sales", icon: IndianRupee },
  { name: "Purchases", href: "/purchases", icon: ShoppingCart },
  { name: "Invoices", href: "/invoices", icon: Receipt },
  { name: "Expenses", href: "/expenses", icon: Wallet },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
] as const;

export function Sidebar() {
  const { isOpen, toggle } = useSidebarStore();
  const { user } = useAuthStore();
  const { data: generalSettings } = useGeneralSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  return (
    <motion.aside
      animate={{ 
        width: isOpen ? 260 : 72,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-y-4 left-4 z-50 flex flex-col rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-lg"
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-3">
        <div className="flex items-center gap-3 overflow-hidden px-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bike className="h-5 w-5" />
          </div>
          <AnimatePresence mode="popLayout">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col whitespace-nowrap cursor-pointer"
                onClick={() => navigate({ to: "/settings" })}
              >
                <span className="text-sm font-bold leading-none">{generalSettings?.showroomName || "Showora"}</span>
                <span className="text-xs text-muted-foreground">Free Plan</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {isOpen && (
             <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
               <Button 
                 variant="ghost" 
                 size="icon" 
                 className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 ml-2"
                 onClick={() => navigate({ to: "/settings" })}
                 title="Showroom Settings"
               >
                 <ChevronsUpDown className="h-4 w-4" />
               </Button>
             </motion.div>
          )}
        </AnimatePresence>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggle}
          className={cn(
            "absolute -right-3.5 top-5 h-7 w-7 rounded-full border bg-background shadow-md",
            "hover:bg-accent hover:text-accent-foreground z-10"
          )}
        >
          <motion.div animate={{ rotate: isOpen ? 0 : 180 }}>
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                !isOpen && "justify-center px-0"
              )}
              title={!isOpen ? item.name : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl border border-primary/20 bg-primary/5"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn("h-5 w-5 shrink-0 z-10", isActive && "text-primary")} />
              <AnimatePresence mode="popLayout">
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="whitespace-nowrap z-10"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      <div className="p-3">
        <div className={cn("flex items-center gap-3 rounded-xl hover:bg-muted/50 p-2 transition-colors", !isOpen && "justify-center p-0 hover:bg-transparent")}>
          <Avatar className="h-9 w-9 border border-border/50 shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <AnimatePresence mode="popLayout">
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col whitespace-nowrap overflow-hidden flex-1"
                >
                  <span className="text-sm font-medium leading-none truncate">{user?.name}</span>
                  <span className="text-xs text-muted-foreground mt-1 truncate">{user?.email}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
