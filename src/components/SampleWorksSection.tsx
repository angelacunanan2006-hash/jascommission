import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Expand, FileText, ImageOff, Search, X } from 'lucide-react';
import {
  SAMPLE_CATEGORIES,
  SAMPLE_WORKS,
  type SampleCategory,
  type SampleWork,
} from '../data/samples';
import { LightboxModal, type LightboxItem } from './LightboxModal';

const INITIAL_VISIBLE_COUNT = 12;

type FilterTab = SampleCategory | 'Saved';

interface SampleWorksSectionProps {
  savedIds: number[];
  onToggleSave: (id: number) => void;
  onRequestSimilar: (sample: SampleWork) => void;
  onFeedbackSample: (sample: SampleWork) => void;
  onOpenBuilderWithSaved: () => void;
  externalCategory?: SampleCategory | null;
  externalCategoryTick?: number;
}

function SampleCard({
  work,
  isSaved,
  onSelect,
  onToggleSave,
}: {
  work: SampleWork;
  isSaved: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className="group m-0 flex flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-brand-line bg-brand-tint transition-transform duration-200 ease-out hover:-translate-y-1 hover:border-brand-red/50">
        <button
          type="button"
          onClick={onSelect}
          className="block h-full w-full text-left"
          aria-label={`View full sample: ${work.title}`}
        >
          {hasError ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-brand-muted">
              <ImageOff className="h-7 w-7 text-brand-red/70" aria-hidden="true" />
              <span className="text-sm font-medium text-brand-ink">
                {work.title}
              </span>
            </div>
          ) : (
            <img
              src={work.image}
              alt={work.alt}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setHasError(true)}
              className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
            />
          )}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-ink/80 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          >
            <Expand className="h-4 w-4" />
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={isSaved}
          aria-label={
            isSaved
              ? `Remove ${work.title} from saved references`
              : `Save ${work.title} as reference`
          }
          className={`absolute top-2.5 right-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-150 ${
            isSaved
              ? 'border-brand-red bg-brand-red text-white shadow-sm'
              : 'border-brand-line bg-white/95 text-brand-ink opacity-90 hover:border-brand-red hover:text-brand-red group-hover:opacity-100'
          }`}
        >
          <Bookmark
            className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <figcaption className="px-0.5 pt-2.5">
        <div className="truncate font-display text-[0.95rem] font-semibold text-brand-ink">
          {work.title}
        </div>
        <div className="mt-0.5 text-xs text-brand-muted">
          {work.category}
          <span aria-hidden="true"> · </span>
          <span className="tabular-nums">Sample #{work.id}</span>
        </div>
      </figcaption>
    </figure>
  );
}

export function SampleWorksSection({
  savedIds,
  onToggleSave,
  onRequestSimilar,
  onFeedbackSample,
  onOpenBuilderWithSaved,
  externalCategory = null,
  externalCategoryTick = 0,
}: SampleWorksSectionProps) {
  const [selectedTab, setSelectedTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (externalCategory && externalCategoryTick > 0) {
      setSelectedTab(externalCategory);
      setSearchQuery('');
    }
  }, [externalCategory, externalCategoryTick]);

  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);

  const categoryCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      All: SAMPLE_WORKS.length,
      'Graphic & Video': 0,
      'Research & Docs': 0,
      'IT & Coding': 0,
      'Data & Excel': 0,
      'Architecture & CAD': 0,
      Saved: savedIds.length,
    };
    for (const work of SAMPLE_WORKS) {
      counts[work.category] += 1;
    }
    return counts;
  }, [savedIds.length]);

  const filteredWorks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SAMPLE_WORKS.filter((work) => {
      const matchesTab =
        selectedTab === 'All'
          ? true
          : selectedTab === 'Saved'
          ? savedSet.has(work.id)
          : work.category === selectedTab;
      const matchesQuery =
        q.length === 0 ||
        work.title.toLowerCase().includes(q) ||
        work.category.toLowerCase().includes(q) ||
        `#${work.id}`.includes(q);
      return matchesTab && matchesQuery;
    });
  }, [selectedTab, searchQuery, savedSet]);

  const isFiltered = selectedTab !== 'All' || searchQuery.trim().length > 0;
  const visibleWorks =
    showAll || isFiltered
      ? filteredWorks
      : filteredWorks.slice(0, INITIAL_VISIBLE_COUNT);

  const lightboxItems: LightboxItem[] = useMemo(
    () =>
      filteredWorks.map((work) => ({
        id: work.id,
        src: work.image,
        alt: work.alt,
        title: work.title,
        subtitle: `${work.category} · Sample #${work.id}`,
      })),
    [filteredWorks]
  );

  const allTabs: FilterTab[] =
    savedIds.length > 0
      ? [...SAMPLE_CATEGORIES, 'Saved']
      : SAMPLE_CATEGORIES;

  return (
    <section id="work" className="pt-12 sm:pt-20">
      <div className="mx-auto w-[min(1120px,100%-1.5rem)] sm:w-[min(1120px,100%-2.5rem)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-red">
              Sample works
            </h2>
            <p className="mt-2.5 text-base text-brand-muted sm:text-[1.125rem]">
              A look at{' '}
              <span className="font-medium text-brand-ink tabular-nums">
                {SAMPLE_WORKS.length}
              </span>{' '}
              finished commissions. Click any sample to inspect or bookmark
              references to attach to your request.
            </p>
          </div>

          {savedIds.length > 0 && (
            <button
              type="button"
              onClick={onOpenBuilderWithSaved}
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-brand-deep md:self-end"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span className="tabular-nums">
                Request with {savedIds.length} saved
              </span>
            </button>
          )}
        </div>

        {/* Interactive filter bar & search */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
            <div
              role="tablist"
              aria-label="Filter sample works by category"
              className="inline-flex min-w-max items-center gap-1 rounded-xl border border-brand-line bg-brand-tint p-1 lg:flex lg:min-w-0 lg:flex-wrap"
            >
              {allTabs.map((tab) => {
                const active = selectedTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedTab(tab)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-150 sm:text-sm ${
                      active
                        ? 'bg-brand-red text-white shadow-xs'
                        : 'text-brand-muted hover:bg-white hover:text-brand-ink'
                    }`}
                  >
                    {tab}{' '}
                    <span
                      className={`tabular-nums ${
                        active ? 'text-white/85' : 'text-brand-muted/80'
                      }`}
                    >
                      ({categoryCounts[tab]})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative w-full lg:w-64">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-brand-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search samples..."
              aria-label="Search sample works"
              className="w-full rounded-xl border border-brand-line bg-white py-2.5 pr-9 pl-10 text-sm text-brand-ink placeholder:text-brand-muted/70 focus:border-brand-red focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-brand-muted hover:text-brand-red"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Gallery grid */}
        {visibleWorks.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-brand-line bg-brand-tint px-6 py-12 text-center">
            <p className="font-display text-base font-semibold text-brand-ink">
              No matching sample works found.
            </p>
            <p className="mt-1 text-sm text-brand-muted">
              Try a different keyword or switch back to all categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedTab('All');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center rounded-full bg-brand-red px-5 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-deep"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {visibleWorks.map((work, idx) => (
                <SampleCard
                  key={work.id}
                  work={work}
                  isSaved={savedSet.has(work.id)}
                  onSelect={() => setLightboxIndex(idx)}
                  onToggleSave={() => onToggleSave(work.id)}
                />
              ))}
            </div>

            {!isFiltered && filteredWorks.length > INITIAL_VISIBLE_COUNT && (
              <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-brand-line pt-6 sm:flex-row">
                <p className="text-sm text-brand-muted tabular-nums">
                  Showing {visibleWorks.length} of {filteredWorks.length} sample
                  works
                </p>
                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-brand-deep"
                >
                  {showAll
                    ? 'Show fewer samples'
                    : `Show all ${filteredWorks.length} samples`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <LightboxModal
        items={lightboxItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(nextIndex) => setLightboxIndex(nextIndex)}
        isSaved={(item) => (item.id !== undefined ? savedSet.has(item.id) : false)}
        onToggleSave={(item) => {
          if (item.id !== undefined) onToggleSave(item.id);
        }}
        onCommissionSimilar={(item) => {
          const matched = SAMPLE_WORKS.find((w) => w.id === item.id);
          setLightboxIndex(null);
          if (matched) onRequestSimilar(matched);
        }}
        onLeaveFeedback={(item) => {
          const matched = SAMPLE_WORKS.find((w) => w.id === item.id);
          setLightboxIndex(null);
          if (matched) onFeedbackSample(matched);
        }}
      />
    </section>
  );
}
