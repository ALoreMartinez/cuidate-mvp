import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center text-center gap-3 py-12 px-6 ${className ?? ''}`}>
      <div className="w-16 h-16 rounded-full bg-cyber-lavender flex items-center justify-center text-ultra-indigo">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-semibold text-negro">{title}</p>
        {description && <p className="text-xs text-gray-500 mt-1 max-w-[240px] mx-auto leading-relaxed">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-1 bg-ultra-indigo text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-float active:scale-95 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
