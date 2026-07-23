import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'circle' | 'rect' | 'text';
  width?: string | number;
  height?: string | number;
  radius?: string | number;
}

export function Skeleton({
  className,
  variant = 'rect',
  width,
  height,
  radius,
  style,
  ...props
}: SkeletonProps) {
  const customStyle: React.CSSProperties = {
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    borderRadius: radius !== undefined ? (typeof radius === 'number' ? `${radius}px` : radius) : undefined,
    ...style,
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/65 dark:bg-muted/40 rounded-lg",
        variant === 'circle' && "rounded-full",
        variant === 'text' && "h-4 w-full rounded",
        // Shimmer gradient mask using gpu-accelerated transform
        "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-foreground/5 before:to-transparent",
        "motion-reduce:before:hidden motion-reduce:animate-pulse",
        className
      )}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  );
}

interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  className?: string;
  gap?: string;
}

export function SkeletonText({
  lines = 3,
  className,
  gap = "space-y-2",
  ...props
}: SkeletonTextProps) {
  return (
    <div className={gap} {...props}>
      {Array.from({ length: lines }).map((_, i) => {
        const isLast = i === lines - 1;
        const width = isLast ? "w-4/5" : "w-full";
        return (
          <Skeleton
            key={i}
            variant="text"
            className={cn(width, className)}
          />
        );
      })}
    </div>
  );
}
