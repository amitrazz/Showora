import { ErrorComponentProps } from "@tanstack/react-router"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ErrorBoundaryComponent({ error, reset }: ErrorComponentProps) {
  return (
    <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="mb-4 rounded-full bg-red-100 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-500 ring-8 ring-red-50 dark:ring-red-900/10">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
        Something went wrong!
      </h2>
      <p className="mb-6 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {error instanceof Error ? error.message : "An unexpected error occurred while rendering this component. Please try again."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} variant="default" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="gap-2">
          <Home className="h-4 w-4" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
