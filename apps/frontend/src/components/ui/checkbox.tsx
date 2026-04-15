import { Check } from 'lucide-react';

export function Checkbox({
  checked,
  disabled,
  className,
}: {
  checked: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      className={`flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-150 ${
        disabled
          ? 'cursor-default border-white/[0.06] bg-white/[0.02]'
          : checked
            ? 'border-(--accent)/40 bg-(--accent)/20'
            : 'border-white/[0.1] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.05]'
      } ${className ?? ''}`}
    >
      {(checked || disabled) && (
        <Check
          className={`size-2.5 ${disabled ? 'text-white/20' : 'text-(--accent)'}`}
          strokeWidth={3}
        />
      )}
    </span>
  );
}
