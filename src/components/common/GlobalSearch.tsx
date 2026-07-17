import * as React from "react"
import { Command } from "cmdk"
import { Search } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { AnimatePresence } from "framer-motion"

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "relative inline-flex h-9 w-full items-center justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 transition-colors hover:bg-muted/80 border border-transparent hover:border-border"
        )}
      >
        <span className="hidden lg:inline-flex ml-2">Search...</span>
        <span className="inline-flex lg:hidden ml-2">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <AnimatePresence>
        {open && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="overflow-hidden p-0 shadow-xl border-border bg-transparent sm:max-w-[600px]">
              <Command className="[&_[cmdk-root]]:min-h-[300px] [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 bg-background rounded-xl border shadow-xl overflow-hidden">
                <div className="flex items-center border-b border-border/50 px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                  <Command.Input
                    placeholder="Type a command or search..."
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0"
                  />
                </div>
                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                  <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
                  <Command.Group heading="Navigation" className="p-2 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                    <Command.Item className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" onSelect={() => runCommand(() => navigate({ to: "/dashboard" }))}>
                      Dashboard
                    </Command.Item>
                    <Command.Item className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" onSelect={() => runCommand(() => navigate({ to: "/customers" }))}>
                      Customers Workspace
                    </Command.Item>
                    <Command.Item className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" onSelect={() => runCommand(() => navigate({ to: "/customers/new" }))}>
                      Create Customer
                    </Command.Item>
                    <Command.Item className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" onSelect={() => runCommand(() => navigate({ to: "/inventory" }))}>
                      Inventory
                    </Command.Item>
                  </Command.Group>
                  <Command.Group heading="Recent Customers" className="p-2 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground border-t border-border/50">
                    {/* Placeholder for real global search results, would map through data here */}
                    <Command.Item className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm outline-none aria-selected:bg-muted aria-selected:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" onSelect={() => runCommand(() => navigate({ to: "/customers" }))}>
                      <span className="text-muted-foreground">Search functionality connects to backend...</span>
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
