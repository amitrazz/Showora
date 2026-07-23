import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface DropdownContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({ asChild, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu")

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    context.setOpen((prev) => !prev)
    if (props.onClick) props.onClick(e)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    })
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  children,
  className,
  align = "right",
}: {
  children: React.ReactNode
  className?: string
  align?: "left" | "right" | "center"
}) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu")

  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        context.setOpen(false)
      }
    }
    if (context.open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [context.open, context])

  if (!context.open) return null

  const alignStyles =
    align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-1/2 -translate-x-1/2"

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.96 }}
        transition={{ duration: 0.12 }}
        className={cn(
          "absolute top-full mt-1.5 z-50 min-w-[160px] overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl outline-none",
          alignStyles,
          className
        )}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function DropdownMenuItem({
  children,
  className,
  onClick,
  destructive = false,
}: {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  destructive?: boolean
}) {
  const context = React.useContext(DropdownContext)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        if (context) context.setOpen(false)
        if (onClick) onClick(e)
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium outline-none transition-colors",
        destructive
          ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
          : "text-foreground hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn("-mx-1 my-1 h-px bg-border/50", className)} />
}
