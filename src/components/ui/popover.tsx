import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface PopoverContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined)

export function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </PopoverContext.Provider>
  )
}

export function PopoverTrigger({ asChild, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error("PopoverTrigger must be used within Popover")

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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

export function PopoverContent({
  children,
  className,
  align = "right",
}: {
  children: React.ReactNode
  className?: string
  align?: "left" | "right" | "center"
}) {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error("PopoverContent must be used within Popover")

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
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "absolute top-full mt-2 z-50 rounded-xl border border-border bg-card p-4 shadow-xl outline-none",
          alignStyles,
          className
        )}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
