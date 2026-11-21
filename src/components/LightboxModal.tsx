import { type TouchEvent, useEffect, useRef } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';

export interface LightboxItem {
  id?: number;
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
}

interface LightboxModalProps {
  items: LightboxItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
  onCommissionSimilar?: (item: LightboxItem) => void;
  isSaved?: (item: LightboxItem) => boolean;
  onToggleSave?: (item: LightboxItem) => void;
}

export function LightboxModal({
  items,
  activeIndex,
  onClose,
  onNavigate,
  onCommissionSimilar,
  isSaved,
  onToggleSave,
}: LightboxModalProps) {
  const isOpen = activeIndex !== null && items[activeIndex] !== undefined;
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || activeIndex === null || items.length <= 1) {
      touchStartX.current = null;
      return;
    }
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 45) {
      if (delta < 0) {
        onNavigate((activeIndex + 1) % items.length);
      } else {
        onNavigate((activeIndex - 1 + items.length) % items.length);
      }
    }
  };

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight' && items.length > 1) {
        onNavigate((activeIndex + 1) % items.length);
      } else if (event.key === 'ArrowLeft' && items.length > 1) {
        onNavigate((activeIndex - 1 + items.length) % items.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeIndex, items.length, onClose, onNavigate]);

  if (!isOpen || activeIndex === null) return null;

  const current = items[activeIndex];
  const hasMultiple = items.length > 1;
  const saved = isSaved ? isSaved(current) : false;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-brand-line px-5 py-3.5">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-bold text-brand-ink sm:text-lg">
              {current.title}
            </h3>
            <p className="mt-0.5 flex items-center gap-2 text-xs text-brand-muted">
              {current.subtitle && <span>{current.subtitle}</span>}
              {current.subtitle && hasMultiple && <span aria-hidden="true">·</span>}
              {hasMultiple && (
                <span className="tabular-nums">
                  {activeIndex + 1} of {items.length}
                </span>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(current)}
                aria-pressed={saved}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                  saved
                    ? 'border-brand-red bg-brand-tint text-brand-red'
                    : 'border-brand-line bg-white text-brand-ink hover:border-brand-red hover:text-brand-red'
                }`}
              >
                <Bookmark
                  className={`h-3.5 w-3.5 ${saved ? 'fill-brand-red' : ''}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">
                  {saved ? 'Saved' : 'Save sample'}
                </span>
              </button>
            )}
            {onCommissionSimilar && (
              <button
                type="button"
                onClick={() => onCommissionSimilar(current)}
                className="hidden items-center gap-1.5 rounded-lg bg-brand-red px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-brand-deep sm:inline-flex"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Request similar</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative flex min-h-0 flex-1 items-center justify-center bg-[#faf6f6] p-3 sm:p-6"
        >
          {hasMultiple && (
            <button
              type="button"
              onClick={() => onNavigate((activeIndex - 1 + items.length) % items.length)}
              aria-label="Previous image"
              className="absolute left-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-line bg-white/95 text-brand-ink shadow-md transition-transform duration-150 hover:scale-105 hover:border-brand-red hover:text-brand-red sm:left-4 sm:h-11 sm:w-11"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          <img
            src={current.src}
            alt={current.alt}
            referrerPolicy="no-referrer"
            className="max-h-[68vh] w-auto max-w-full rounded-xl object-contain shadow-sm sm:max-h-[70vh]"
          />

          {hasMultiple && (
            <button
              type="button"
              onClick={() => onNavigate((activeIndex + 1) % items.length)}
              aria-label="Next image"
              className="absolute right-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-line bg-white/95 text-brand-ink shadow-md transition-transform duration-150 hover:scale-105 hover:border-brand-red hover:text-brand-red sm:right-4 sm:h-11 sm:w-11"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>

        {onCommissionSimilar && (
          <div className="flex items-center justify-between gap-3 border-t border-brand-line bg-white px-5 py-3 sm:hidden">
            <span className="text-xs text-brand-muted">Need a similar output?</span>
            <button
              type="button"
              onClick={() => onCommissionSimilar(current)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-white"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Request similar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
