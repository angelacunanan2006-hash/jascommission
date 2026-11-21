import { type TouchEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  ExternalLink,
  Mail,
  Send,
} from 'lucide-react';
import type { SampleCategory } from '../data/samples';
import { SERVICE_OFFERINGS, type ServiceOffering } from '../data/services';
import { LightboxModal, type LightboxItem } from './LightboxModal';

interface ServicesSectionProps {
  onCommissionService: (
    service: ServiceOffering,
    selectedDeliverables: string[]
  ) => void;
  onBrowseRelatedSamples: (category: SampleCategory) => void;
  externalServiceIndex?: number | null;
  externalServiceTick?: number;
}

export function ServicesSection({
  onCommissionService,
  onBrowseRelatedSamples,
  externalServiceIndex = null,
  externalServiceTick = 0,
}: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copiedServiceId, setCopiedServiceId] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (
      externalServiceIndex !== null &&
      externalServiceTick > 0 &&
      externalServiceIndex >= 0 &&
      externalServiceIndex < SERVICE_OFFERINGS.length
    ) {
      setActiveIndex(externalServiceIndex);
    }
  }, [externalServiceIndex, externalServiceTick]);

  const activeService = SERVICE_OFFERINGS[activeIndex];

  const messengerMessage = `Hi Ja’s Commission! I would like to inquire about ${activeService.title}. Please let me know the details and payment process.`;
  const messengerHref = `https://m.me/jascommission2024?text=${encodeURIComponent(
    messengerMessage
  )}`;

  const handleOpenMessenger = async () => {
    try {
      await navigator.clipboard.writeText(messengerMessage);
      setCopiedServiceId(activeService.id);
      setTimeout(() => setCopiedServiceId(null), 3000);
    } catch {
      // Allow opening Messenger even if clipboard is unavailable
    }
  };

  const goPrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + SERVICE_OFFERINGS.length) % SERVICE_OFFERINGS.length
    );

  const goNext = () =>
    setActiveIndex((prev) => (prev + 1) % SERVICE_OFFERINGS.length);

  const lightboxItems: LightboxItem[] = useMemo(
    () =>
      SERVICE_OFFERINGS.map((service) => ({
        src: service.poster,
        alt: service.alt,
        title: service.title,
        subtitle: service.tagline,
      })),
    []
  );

  const handlePosterTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handlePosterTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 45) {
      if (delta < 0) goNext();
      else goPrev();
    }
  };

  return (
    <section id="services" className="pt-12 sm:pt-20">
      <div className="mx-auto w-[min(1120px,100%-1.5rem)] sm:w-[min(1120px,100%-2.5rem)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-red">
              Services we offer
            </h2>
            <p className="mt-2.5 text-base text-brand-muted sm:text-[1.125rem]">
              Explore all{' '}
              <span className="font-medium text-brand-ink tabular-nums">
                {SERVICE_OFFERINGS.length}
              </span>{' '}
              commission specialties. Click any poster to zoom in or send your
              request directly.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start sm:self-end">
            <span className="text-xs font-semibold text-brand-muted tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(SERVICE_OFFERINGS.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous service"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next service"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Single-row interactive service tabs (no orphan wrapping) */}
        <div className="mt-7 overflow-x-auto pb-1">
          <div
            role="tablist"
            aria-label="Commission services"
            className="grid min-w-[660px] grid-cols-7 gap-1 rounded-xl border border-brand-line bg-brand-tint p-1"
          >
            {SERVICE_OFFERINGS.map((service, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150 sm:text-sm ${
                    isActive
                      ? 'bg-brand-red text-white shadow-xs'
                      : 'text-brand-muted hover:bg-white hover:text-brand-ink'
                  }`}
                >
                  <span className="truncate">{service.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Active Service Spotlight */}
        <div
          key={activeService.id}
          onTouchStart={handlePosterTouchStart}
          onTouchEnd={handlePosterTouchEnd}
          className="jas-fade-in mt-5 grid grid-cols-1 items-stretch gap-5 overflow-hidden rounded-2xl border border-brand-line bg-white p-4 sm:gap-6 sm:p-7 lg:grid-cols-[1.05fr_1fr] lg:gap-8"
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(activeIndex)}
            aria-label={`View full-size poster for ${activeService.title}`}
            className="group relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-xl border border-brand-line bg-[#faf6f6] p-3 sm:min-h-[420px]"
          >
            <img
              key={activeService.poster}
              src={activeService.poster}
              alt={activeService.alt}
              referrerPolicy="no-referrer"
              className="max-h-[460px] w-auto max-w-full rounded-lg object-contain transition-transform duration-200 ease-out group-hover:scale-[1.02]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-brand-ink/85 px-3 py-1.5 text-xs font-semibold text-white opacity-90 transition-opacity duration-150 group-hover:opacity-100"
            >
              <Expand className="h-3.5 w-3.5" />
              <span>Zoom poster</span>
            </span>
          </button>

          <div className="flex flex-col justify-center py-2">
            <div>
              <p className="text-xs font-semibold text-brand-muted tabular-nums">
                Service {String(activeIndex + 1).padStart(2, '0')} of{' '}
                {String(SERVICE_OFFERINGS.length).padStart(2, '0')}
              </p>

              <h3 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em] text-brand-ink sm:text-[1.75rem]">
                {activeService.title}
              </h3>
              <p className="mt-2 text-base text-brand-muted">
                {activeService.tagline}
              </p>
            </div>

            <div className="mt-6 border-t border-brand-line pt-5 sm:mt-7 sm:pt-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={messengerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOpenMessenger}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-deep sm:w-auto sm:whitespace-nowrap"
                >
                  <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Message on Facebook ({activeService.tabLabel})</span>
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0 opacity-80"
                    aria-hidden="true"
                  />
                </a>

                <button
                  type="button"
                  onClick={() => onCommissionService(activeService, [])}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-brand-line bg-white px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red sm:flex-none"
                >
                  <Mail className="h-4 w-4 text-brand-red" aria-hidden="true" />
                  <span>Send email</span>
                </button>

                {activeService.sampleCategory && (
                  <button
                    type="button"
                    onClick={() =>
                      onBrowseRelatedSamples(activeService.sampleCategory!)
                    }
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-brand-line bg-white px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red sm:flex-none"
                  >
                    <span>Related samples</span>
                    <ArrowDownRight
                      className="h-4 w-4 text-brand-red"
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>

              {copiedServiceId === activeService.id && (
                <p className="mt-2.5 text-xs font-medium text-brand-red">
                  Messenger opened with your {activeService.tabLabel} inquiry
                  pre-filled (and copied as backup).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* All 7 Service Posters Visual Strip */}
        <div className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-7">
          {SERVICE_OFFERINGS.map((service, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isSelected}
                className={`group flex flex-col overflow-hidden rounded-xl border-2 bg-white text-left transition-transform duration-150 hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-brand-red shadow-xs'
                    : 'border-brand-line hover:border-brand-red/50'
                }`}
              >
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-[#faf6f6] p-1.5">
                  <img
                    src={service.poster}
                    alt={service.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full rounded-md object-contain transition-transform duration-150 group-hover:scale-[1.03]"
                  />
                </div>
                <span
                  className={`block truncate px-2.5 py-2 font-display text-xs font-semibold ${
                    isSelected ? 'text-brand-red' : 'text-brand-ink'
                  }`}
                >
                  {service.tabLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <LightboxModal
        items={lightboxItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(nextIndex) => setLightboxIndex(nextIndex)}
        onCommissionSimilar={() => {
          const target =
            lightboxIndex !== null
              ? SERVICE_OFFERINGS[lightboxIndex]
              : activeService;
          setLightboxIndex(null);
          onCommissionService(target, []);
        }}
      />
    </section>
  );
}
