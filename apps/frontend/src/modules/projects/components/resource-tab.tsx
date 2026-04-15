import type { ReactNode } from 'react';

export function ResourceTab({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-dm flex h-7 items-center gap-1.5 rounded-[10px] border px-2.5 text-[11px] transition-all ${
        active
          ? 'border-(--accent)/25 bg-(--accent)/10 text-(--accent)'
          : 'border-white/[0.06] bg-white/[0.02] text-white/45 hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-white/70'
      }`}
    >
      {icon}
      {label}
      <span
        className={`font-mono text-[9px] tracking-[0.05em] ${
          active ? 'text-(--accent)/70' : 'text-white/30'
        }`}
      >
        {count.toString().padStart(2, '0')}
      </span>
    </button>
  );
}
