import { CheckSquare, Square, MinusSquare } from "lucide-react";

interface PermissionCheckboxProps {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const PermissionCheckbox = ({
  label,
  checked,
  indeterminate,
  onChange,
  className = "",
  disabled = false,
}: PermissionCheckboxProps) => {
  return (
    <div
      className={`flex items-center gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
    >
      {indeterminate ? (
        <MinusSquare className="h-5 w-5 text-primary" />
      ) : checked ? (
        <CheckSquare className="h-5 w-5 text-primary" />
      ) : (
        <Square className="h-5 w-5 text-muted-foreground" />
      )}
      <span className="text-sm font-medium select-none capitalize">
        {label.replace(/_/g, " ")}
      </span>
    </div>
  );
};
