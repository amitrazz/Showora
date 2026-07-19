import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open = false, children }: DialogProps) {
  if (!open) {
    return null;
  }

  return <>{children}</>;
}

interface DialogContentProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode;
}

export function DialogContent({ children, className, ...props }: DialogContentProps) {
  // We assume it's controlled by parent's state in this simple implementation
  // A real shadcn dialog uses Context, but we are making a simplified one.
  // Actually, since GlobalSearch manages `open`, we just render it. Wait, GlobalSearch wraps DialogContent inside Dialog which expects it to conditionally render.
  // Let's modify GlobalSearch to conditionally render instead of building a complex context Dialog.
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
          "z-50 grid w-full max-w-lg gap-4 bg-background p-6 shadow-lg sm:rounded-xl border border-border mt-16 sm:mt-0",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  )
}
