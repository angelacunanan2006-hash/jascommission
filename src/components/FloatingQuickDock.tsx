import { ArrowUp, Mail, Send } from 'lucide-react';

interface FloatingQuickDockProps {
  visible: boolean;
  savedCount: number;
  onOpenCommission: () => void;
}

const MESSENGER_QUICK_URL = `https://m.me/jascommission2024?text=${encodeURIComponent(
  'Hi Ja’s Commission! I would like to inquire about a commission.'
)}`;

export function FloatingQuickDock({
  visible,
  savedCount,
  onOpenCommission,
}: FloatingQuickDockProps) {
  return (
    <div
      aria-label="Quick actions"
      className={`fixed right-3 bottom-[max(0.85rem,env(safe-area-inset-bottom))] left-3 z-30 flex items-center justify-center gap-2 transition-all duration-200 sm:right-6 sm:bottom-6 sm:left-auto sm:justify-end ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <a
        href={MESSENGER_QUICK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-brand-line bg-white px-4 py-2.5 text-xs font-semibold text-brand-ink shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-red hover:text-brand-red sm:min-h-0 sm:text-sm"
      >
        <Send className="h-4 w-4 text-brand-red" aria-hidden="true" />
        <span>Chat</span>
      </a>

      <button
        type="button"
        onClick={onOpenCommission}
        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-deep sm:min-h-0 sm:flex-none sm:px-5 sm:text-sm"
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        <span>Commission now</span>
        {savedCount > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-extrabold text-brand-red tabular-nums">
            {savedCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-red hover:text-brand-red sm:h-10 sm:w-10"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
