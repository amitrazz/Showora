import { Skeleton, SkeletonText } from "./Skeleton";

// Reusable Statistics/KPI Card Skeleton
export function SkeletonStatsCard() {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm flex items-center justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" className="w-24 h-3.5" />
        <Skeleton variant="text" className="w-32 h-7" />
      </div>
      <Skeleton variant="circle" className="w-9 h-9" />
    </div>
  );
}

// Reusable General Card Skeleton
export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="w-10 h-10" />
        <div className="space-y-1.5 flex-1">
          <Skeleton variant="text" className="w-1/3 h-4" />
          <Skeleton variant="text" className="w-1/4 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-32 rounded-lg" />
      <SkeletonText lines={2} />
    </div>
  );
}

// Reusable Table View Skeleton
export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-4 w-full">
      {/* Search and action bar placeholder */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="w-64 h-9 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="w-20 h-9 rounded-lg" />
          <Skeleton className="w-20 h-9 rounded-lg" />
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
        {/* Header */}
        <div className="border-b border-border/40 bg-muted/20 px-6 py-4 flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} variant="text" className="h-4 flex-1" />
          ))}
        </div>
        {/* Body Rows */}
        <div className="divide-y divide-border/30">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="px-6 py-4 flex gap-4 items-center">
              {Array.from({ length: cols }).map((_, c) => (
                <Skeleton key={c} variant="text" className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable Chart Placeholder Skeleton
export function SkeletonChart() {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton variant="text" className="w-32 h-4" />
          <Skeleton variant="text" className="w-48 h-3" />
        </div>
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>
      {/* Simulated bar/line chart using flex grid */}
      <div className="h-64 flex items-end gap-3 pt-6 border-b border-l border-border/30 pl-4 pb-2">
        <Skeleton className="w-full h-1/3 rounded-t" />
        <Skeleton className="w-full h-2/3 rounded-t" />
        <Skeleton className="w-full h-1/2 rounded-t" />
        <Skeleton className="w-full h-4/5 rounded-t" />
        <Skeleton className="w-full h-3/5 rounded-t" />
        <Skeleton className="w-full h-5/6 rounded-t" />
      </div>
    </div>
  );
}

// Reusable Dashboard Template Skeleton
export function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-48 h-8" />
          <Skeleton variant="text" className="w-80 h-4" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-24 h-9 rounded-lg" />
          <Skeleton className="w-32 h-9 rounded-lg" />
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <SkeletonStatsCard />
        <SkeletonStatsCard />
        <SkeletonStatsCard />
        <SkeletonStatsCard />
      </div>

      {/* Double Column Area (Chart + List) */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SkeletonChart />
        </div>
        <div>
          <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
            <Skeleton variant="text" className="w-32 h-5" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton variant="circle" className="w-9 h-9" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton variant="text" className="w-2/3 h-3.5" />
                    <Skeleton variant="text" className="w-1/3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable List Skeleton
export function SkeletonList({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/40 bg-card p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton variant="circle" className="w-10 h-10" />
            <div className="space-y-1.5 flex-1">
              <Skeleton variant="text" className="w-1/4 h-4" />
              <Skeleton variant="text" className="w-1/3 h-3" />
            </div>
          </div>
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// Reusable Form/Wizard Skeleton
export function SkeletonForm() {
  return (
    <div className="max-w-2xl mx-auto rounded-xl border border-border/40 bg-card p-6 shadow-sm space-y-6">
      <div className="space-y-2">
        <Skeleton variant="text" className="w-1/3 h-6" />
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" className="w-24 h-4" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
        <Skeleton className="w-24 h-10 rounded-lg" />
        <Skeleton className="w-32 h-10 rounded-lg" />
      </div>
    </div>
  );
}

// Reusable Profile Workspace Skeleton
export function SkeletonProfilePage() {
  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Profile Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-6 bg-card/30 p-6 rounded-2xl border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Skeleton variant="circle" className="w-16 h-16 shrink-0" />
          <div className="space-y-2">
            <Skeleton variant="text" className="w-48 h-6" />
            <div className="flex gap-2">
              <Skeleton variant="text" className="w-24 h-3.5" />
              <Skeleton variant="text" className="w-32 h-3.5" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-24 h-9 rounded-lg" />
          <Skeleton className="w-28 h-9 rounded-lg" />
        </div>
      </div>

      {/* Profile Metrics Summary */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <SkeletonStatsCard />
        <SkeletonStatsCard />
        <SkeletonStatsCard />
      </div>

      {/* Tabs list skeleton */}
      <div className="flex gap-2 border-b border-border/40 pb-px">
        <Skeleton className="w-24 h-8 rounded-t-lg" />
        <Skeleton className="w-24 h-8 rounded-t-lg" />
        <Skeleton className="w-24 h-8 rounded-t-lg" />
      </div>

      {/* Details Area */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border/40 bg-card p-6 space-y-4">
            <Skeleton variant="text" className="w-36 h-5" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Skeleton variant="text" className="w-16 h-3" /><Skeleton className="w-full h-8 rounded-lg" /></div>
              <div className="space-y-2"><Skeleton variant="text" className="w-20 h-3" /><Skeleton className="w-full h-8 rounded-lg" /></div>
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-xl border border-border/40 bg-card p-6 space-y-4">
            <Skeleton variant="text" className="w-32 h-5" />
            <SkeletonText lines={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
