export const PermissionSummary = ({
  total,
  selected,
}: {
  total: number;
  selected: number;
}) => {
  return (
    <div className="flex items-center gap-4 text-sm bg-muted/30 px-4 py-2 rounded-lg border">
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">Total Permissions</span>
        <span className="font-semibold">{total}</span>
      </div>
      <div className="w-px h-8 bg-border"></div>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">Selected</span>
        <span className="font-semibold text-primary">{selected}</span>
      </div>
      <div className="w-px h-8 bg-border"></div>
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs">Not Assigned</span>
        <span className="font-semibold text-muted-foreground">{total - selected}</span>
      </div>
    </div>
  );
};
