import { Search } from "lucide-react";

export const PermissionSearch = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search modules, resources or actions..."
        className="w-full bg-background border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
