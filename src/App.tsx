import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Expand,
  ExternalLink,
  Instagram,
  LayoutGrid,
  Mail,
  Menu,
  MessageSquarePlus,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  X,
} from 'lucide-react';
import {
  CommissionBuilderModal,
  type CommissionPrefill,
} from './components/CommissionBuilderModal';
import { ConcernLetterModal } from './components/ConcernLetterModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FaqSection } from './components/FaqSection';
import { FloatingQuickDock } from './components/FloatingQuickDock';
import { LightboxModal, type LightboxItem } from './components/LightboxModal';
import { type PaymentPlatformName } from './components/PaymentAndAwareness';
import { PortfolioFeedbackBoard } from './components/PortfolioFeedbackBoard';
import { Reveal } from './components/Reveal';
import { SampleWorksSection } from './components/SampleWorksSection';
import { ServicesSection } from './components/ServicesSection';
import { WorkflowSection } from './components/WorkflowSection';
import {
  CLIENT_FEEDBACK_IMAGES,
  FACEBOOK_URL,
  SAMPLE_WORKS,
  type SampleCategory,
  type SampleWork,
} from './data/samples';
import type { ServiceOffering } from './data/services';

const DOWNPAYMENT_REASONS = [
  'A downpayment confirms your order and allows us to begin your commission.',
  'We may send a sample or progress update to show that your work has already started.',
  'Some clients stop replying after receiving the sample, leaving the time and work unpaid.',
  'To protect our time and keep the process fair, we do not provide the full service before payment confirmation.',
];

const NAV_LINKS = [
  { href: '#services', id: 'services', label: 'Services' },
  { href: '#work', id: 'work', label: 'Sample works' },
  { href: '#feedback', id: 'feedback', label: 'Feedback' },
  { href: '#flow', id: 'flow', label: 'How it works' },
  { href: '#contact', id: 'contact', label: 'Contact' },
];

export default function App() {
  const [feedbackLightboxIndex, setFeedbackLightboxIndex] = useState<
    number | null
  >(null);
  const [dtiLightboxOpen, setDtiLightboxOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive commission state
  const [builderOpen, setBuilderOpen] = useState(false);
  const [concernLetterOpen, setConcernLetterOpen] = useState(false);
  const [builderPrefill, setBuilderPrefill] =
    useState<CommissionPrefill | null>(null);
  const [savedSampleIds, setSavedSampleIds] = useState<number[]>([]);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentPlatformName>('GCash');
  const [sampleJump, setSampleJump] = useState<{
    category: SampleCategory | null;
    tick: number;
  }>({ category: null, tick: 0 });

  // Scroll progress + active section indicator
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('services');
  const [showQuickDock, setShowQuickDock] = useState(false);

  // Quick-copy contact feedback + interactive toast + feedback view
  const [copiedContact, setCopiedContact] = useState<
    'email' | 'phone' | 'dti' | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [feedbackView, setFeedbackView] = useState<'grid' | 'carousel'>('grid');
  const [activeFeedbackIdx, setActiveFeedbackIdx] = useState(0);
  const [feedbackSample, setFeedbackSample] = useState<SampleWork | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  useEffect(() => {
    const liveUrl = window.location.origin + window.location.pathname;
    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = liveUrl;

    let ogUrl = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]'
    );
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = liveUrl;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(
        docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
      );
      setShowQuickDock(scrollTop > 420);

      let current = 'services';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= 160) current = link.id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const savedSamples = useMemo(
    () => SAMPLE_WORKS.filter((w) => savedSampleIds.includes(w.id)),
    [savedSampleIds]
  );

  const toggleSaveSample = (id: number) => {
    const alreadySaved = savedSampleIds.includes(id);
    setSavedSampleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    showToast(
      alreadySaved
        ? `Removed Sample #${id} from saved references`
        : `Saved Sample #${id} to your commission brief`
    );
  };

  const openBuilder = (prefill: CommissionPrefill | null = null) => {
    setBuilderPrefill(prefill);
    setBuilderOpen(true);
    setMobileMenuOpen(false);
  };

  const handleRequestSimilar = (sample: SampleWork) => {
    openBuilder({ category: sample.category, referenceSample: sample });
  };

  const handleFeedbackSample = (sample: SampleWork) => {
    setFeedbackSample(sample);
    document
      .getElementById('leave-feedback')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCommissionService = (
    service: ServiceOffering,
    selectedDeliverables: string[]
  ) => {
    openBuilder({
      category: service.builderCategory,
      deliverables: selectedDeliverables,
    });
  };

  const handleBrowseRelatedSamples = (category: SampleCategory) => {
    setSampleJump((prev) => ({ category, tick: prev.tick + 1 }));
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyContact = async (
    type: 'email' | 'phone' | 'dti',
    value: string
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedContact(type);
      showToast(`Copied ${value}`);
      setTimeout(() => setCopiedContact(null), 2000);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  const feedbackLightboxItems: LightboxItem[] = CLIENT_FEEDBACK_IMAGES.map(
    (item, idx) => ({
      src: item.src,
      alt: item.alt,
      title: `Client feedback #${idx + 1}`,
      subtitle: 'Verified client message',
    })
  );

  const dtiLightboxItems: LightboxItem[] = [
    {
      src: '/assets/jas/dti-certificate.jpg',
      alt: 'DTI Certificate of Business Name Registration for Ja’s Commision Computer Graphic Services',
      title: 'DTI Certificate of Business Name Registration',
      subtitle: 'Business Name No. 8547004 · Valid Oct 12, 2026 – Oct 12, 2031',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-brand-ink">
      {/* Subtle 2px scroll progress indicator */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-40 h-0.5 bg-brand-red transition-[width] duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 border-b border-brand-line bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex w-[min(1120px,100%-1.5rem)] items-center justify-between gap-3 py-3 sm:w-[min(1120px,100%-2.5rem)] sm:gap-8 sm:py-3.5">
          <a
            href="#top"
            className="shrink-0 whitespace-nowrap focus-visible:rounded-md"
            aria-label="Ja’s Commission home"
          >
            <img
              src="/assets/jas/logo.png"
              alt="Ja’s Commission"
              width={170}
              height={54}
              referrerPolicy="no-referrer"
              className="block h-9 w-auto sm:h-[50px]"
            />
          </a>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 text-[0.98rem] font-medium text-brand-muted md:flex"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`shrink-0 whitespace-nowrap transition-colors duration-150 hover:text-brand-red hover:underline hover:underline-offset-4 ${
                    isActive
                      ? 'font-semibold text-brand-red underline underline-offset-4'
                      : ''
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => openBuilder()}
              className="inline-flex items-center justify-center rounded-full bg-brand-red px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-brand-deep sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Commission now
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-brand-line bg-white px-5 py-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-base font-medium text-brand-ink transition-colors hover:text-brand-red"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        {/* Hero */}
        <div className="mx-auto w-[min(1120px,100%-1.5rem)] pt-3.5 sm:w-[min(1120px,100%-2.5rem)] sm:pt-6">
          <div className="jas-hero-panel rounded-[22px] p-5 text-white sm:rounded-[28px] sm:p-10 lg:p-14">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-xs font-medium text-[#ffeaea] sm:text-sm">
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>DTI-registered business name · City of Manila</span>
              </p>

              <h1 className="mt-3.5 max-w-[15ch] font-display text-[clamp(2rem,8vw,3.9rem)] leading-[1.08] font-extrabold tracking-[-0.025em] sm:mt-4">
                Send the task. Get the final file.
              </h1>

              <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-[#ffeaea] sm:mt-5 sm:text-xl">
                Ja’s Commission handles custom requests from order to delivery,
                with an invoice sent before any work begins.
              </p>

              <p className="mt-4 inline-flex items-center gap-2 font-display text-sm font-extrabold text-white sm:text-lg">
                <ShieldCheck
                  className="h-5 w-5 shrink-0 text-white"
                  aria-hidden="true"
                />
                <span>We are 100% trusted — commission-based!</span>
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
                <button
                  type="button"
                  onClick={() => openBuilder()}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-white bg-white px-6 py-3 text-base font-semibold whitespace-nowrap text-[#a50f15] transition-transform duration-150 hover:-translate-y-0.5 sm:w-auto sm:px-7"
                >
                  Start a commission
                </button>
                <a
                  href="#work"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-white/65 bg-transparent px-6 py-3 text-base font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:border-white hover:bg-white/10 sm:w-auto sm:px-7"
                >
                  Browse 45 sample works
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Deadline Banner */}
        <Reveal>
          <section id="cover" className="pt-10 sm:pt-14">
            <div className="mx-auto w-[min(1120px,100%-1.5rem)] sm:w-[min(1120px,100%-2.5rem)]">
              <div className="flex flex-col gap-4 rounded-2xl border border-brand-line bg-brand-tint px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-7">
                <div className="max-w-xl">
                  <h2 className="font-display text-[clamp(1.5rem,3.4vw,2.2rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-red">
                    We’ve got you covered.
                  </h2>
                  <p className="mt-2 text-base text-brand-muted sm:text-lg">
                    Have a deadline coming up? Send us what you need and when
                    you need it.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openBuilder({ focusDeadline: true })}
                  className="inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-full bg-brand-red px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-brand-deep sm:w-auto sm:text-base"
                >
                  Send your deadline
                </button>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Interactive Services Showcase (All 7 Uploaded Service Posters) */}
        <Reveal>
          <ServicesSection
            onCommissionService={handleCommissionService}
            onBrowseRelatedSamples={handleBrowseRelatedSamples}
          />
        </Reveal>

        {/* Verified Owner — Angela (directly under Services we offer) */}
        <div className="mx-auto w-[min(1120px,100%-1.5rem)] pt-8 sm:w-[min(1120px,100%-2.5rem)]">
          <div className="flex flex-col gap-3 rounded-2xl border-2 border-brand-line bg-white px-4 py-4 shadow-[0_8px_24px_rgba(143,12,18,0.06)] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5">
            <div className="flex items-start gap-3 sm:items-center">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand-red">
                <UserCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-sm font-extrabold text-brand-ink sm:text-base">
                  Owner — Angela
                </p>
                <p className="text-sm leading-relaxed text-brand-muted">
                  You may also see our posts or comments under{' '}
                  <strong className="font-semibold text-brand-ink">
                    Angela
                  </strong>
                  , the owner of Ja’s Commission.
                </p>
              </div>
            </div>
            <a
              href="https://www.facebook.com/angela.139078"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-brand-deep sm:w-auto sm:self-center"
            >
              <span>Angela’s Facebook Account</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Interactive Sample Works Gallery */}
        <SampleWorksSection
          savedIds={savedSampleIds}
          onToggleSave={toggleSaveSample}
          onRequestSimilar={handleRequestSimilar}
          onFeedbackSample={handleFeedbackSample}
          onOpenBuilderWithSaved={() => openBuilder()}
          externalCategory={sampleJump.category}
          externalCategoryTick={sampleJump.tick}
        />

        {/* Client Feedback */}
        <section
          id="feedback"
          className="mt-14 border-y border-brand-line/70 bg-brand-tint py-12 sm:mt-20 sm:py-20"
        >
          <div className="mx-auto w-[min(1120px,100%-1.5rem)] sm:w-[min(1120px,100%-2.5rem)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-red">
                  Client feedback
                </h2>
                <p className="mt-2.5 text-base text-brand-muted sm:text-[1.125rem]">
                  What clients say after viewing our portfolio and receiving
                  their final file. Tap any screenshot to zoom in or share your
                  own review.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href="#leave-feedback"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-[0_8px_20px_rgba(211,20,28,0.28)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-deep sm:w-auto sm:text-base"
                  >
                    <MessageSquarePlus
                      className="h-4.5 w-4.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>Write a review / Leave feedback</span>
                  </a>
                </div>
              </div>

              {/* Clean View Switcher (kept separate on the right) */}
              <div className="inline-flex shrink-0 self-start rounded-xl border border-brand-line bg-white p-1 sm:self-end">
                <button
                  type="button"
                  onClick={() => setFeedbackView('grid')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                    feedbackView === 'grid'
                      ? 'bg-brand-red text-white'
                      : 'text-brand-muted hover:text-brand-ink'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackView('carousel')}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                    feedbackView === 'carousel'
                      ? 'bg-brand-red text-white'
                      : 'text-brand-muted hover:text-brand-ink'
                  }`}
                >
                  <SlidersHorizontal
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  <span>Spotlight</span>
                </button>
              </div>
            </div>

            {feedbackView === 'grid' ? (
              <div className="mt-8 grid grid-cols-1 items-start gap-5 md:grid-cols-2">
                {CLIENT_FEEDBACK_IMAGES.map((item, idx) => (
                  <figure
                    key={item.src}
                    className="group m-0 overflow-hidden rounded-2xl border border-brand-line bg-white p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-red/50 hover:shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setFeedbackLightboxIndex(idx)}
                      aria-label={`Zoom ${item.label}`}
                      className="relative block w-full overflow-hidden rounded-xl text-left"
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="block h-auto w-full rounded-xl"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-2.5 bottom-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-ink/80 text-white opacity-90 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Expand className="h-4 w-4" />
                      </span>
                    </button>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="jas-fade-in mt-8 overflow-hidden rounded-2xl border border-brand-line bg-white p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2 pb-4">
                  <span className="font-display text-xs font-bold text-brand-muted tabular-nums">
                    Review {activeFeedbackIdx + 1} of{' '}
                    {CLIENT_FEEDBACK_IMAGES.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveFeedbackIdx(
                          (prev) =>
                            (prev - 1 + CLIENT_FEEDBACK_IMAGES.length) %
                            CLIENT_FEEDBACK_IMAGES.length
                        )
                      }
                      aria-label="Previous client review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink transition-colors hover:border-brand-red hover:text-brand-red"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveFeedbackIdx(
                          (prev) => (prev + 1) % CLIENT_FEEDBACK_IMAGES.length
                        )
                      }
                      aria-label="Next client review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink transition-colors hover:border-brand-red hover:text-brand-red"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFeedbackLightboxIndex(activeFeedbackIdx)}
                  className="group relative mx-auto block max-w-2xl overflow-hidden rounded-xl border border-brand-line"
                >
                  <img
                    key={CLIENT_FEEDBACK_IMAGES[activeFeedbackIdx].src}
                    src={CLIENT_FEEDBACK_IMAGES[activeFeedbackIdx].src}
                    alt={CLIENT_FEEDBACK_IMAGES[activeFeedbackIdx].alt}
                    referrerPolicy="no-referrer"
                    className="jas-fade-in block h-auto w-full"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-brand-ink/85 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <Expand className="h-3.5 w-3.5" />
                    <span>Zoom</span>
                  </span>
                </button>

                <div className="mt-4 flex items-center justify-center gap-2">
                  {CLIENT_FEEDBACK_IMAGES.map((item, idx) => (
                    <button
                      key={item.src}
                      type="button"
                      onClick={() => setActiveFeedbackIdx(idx)}
                      aria-label={`Show review ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-150 ${
                        idx === activeFeedbackIdx
                          ? 'w-7 bg-brand-red'
                          : 'w-2.5 bg-brand-line hover:bg-brand-red/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Live Persistent Portfolio & Client Feedback Board */}
            <ErrorBoundary fallbackTitle="Portfolio reviews are temporarily unavailable.">
              <PortfolioFeedbackBoard
                prefillSample={feedbackSample}
                onClearPrefillSample={() => setFeedbackSample(null)}
                onNotify={showToast}
              />
            </ErrorBoundary>
          </div>
        </section>

        {/* Interactive Commission Flow & Highlighted Payment/Awareness */}
        <WorkflowSection
          selectedPayment={selectedPayment}
          onSelectPayment={setSelectedPayment}
        />

        {/* Why we require a downpayment first */}
        <Reveal>
          <section id="downpayment" className="pt-12 sm:pt-20">
            <div className="mx-auto w-[min(1120px,100%-1.5rem)] sm:w-[min(1120px,100%-2.5rem)]">
              <div className="max-w-2xl">
                <h2 className="font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-red">
                  Why we require a downpayment first
                </h2>
              </div>

              <ol className="mt-8 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2">
                {DOWNPAYMENT_REASONS.map((reason, idx) => (
                  <li
                    key={reason}
                    className="grid grid-cols-[4rem_1fr] overflow-hidden rounded-2xl border border-brand-line bg-white transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-red/50 hover:shadow-sm"
                  >
                    <span className="grid place-items-center bg-brand-red font-display text-xl font-extrabold text-white tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="p-5 text-base leading-relaxed text-brand-ink">
                      {reason}
                    </span>
                  </li>
                ))}
              </ol>

              <p className="mt-6 rounded-2xl border-2 border-brand-red bg-white px-6 py-5 text-lg text-brand-ink sm:text-xl">
                <strong className="font-semibold text-brand-red">
                  Downpayment first.
                </strong>{' '}
                Remaining balance must be paid in full before the final file is
                sent.
              </p>
              <p className="mt-3.5 text-base text-brand-muted">
                Thank you for understanding and supporting our work.
              </p>
            </div>
          </section>
        </Reveal>

        {/* Registered business */}
        <Reveal>
          <section id="registered" className="pt-12 sm:pt-20">
            <div className="mx-auto w-[min(1120px,100%-1.5rem)] sm:w-[min(1120px,100%-2.5rem)]">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
                <div>
                  <h2 className="font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-red">
                    A registered business
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-brand-muted sm:text-[1.125rem]">
                    Ja’s Commission is a business name registered with the
                    Department of Trade and Industry (DTI) in the City of
                    Manila.
                  </p>

                  <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-brand-line pt-6 text-base sm:grid-cols-[auto_1fr] sm:gap-y-3">
                    <dt className="text-brand-muted">Registered name</dt>
                    <dd className="m-0 font-semibold text-brand-ink">
                      Ja’s Commision Computer Graphic Services
                    </dd>
                    <dt className="text-brand-muted">Business Name No.</dt>
                    <dd className="m-0 flex items-center gap-2 font-semibold text-brand-ink tabular-nums">
                      <span>8547004</span>
                      <button
                        type="button"
                        onClick={() => handleCopyContact('dti', '8547004')}
                        aria-label="Copy DTI Business Name Number"
                        className="inline-flex items-center gap-1 rounded-md border border-brand-line bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand-ink transition-colors hover:border-brand-red hover:text-brand-red"
                      >
                        {copiedContact === 'dti' ? (
                          <>
                            <Check
                              className="h-3 w-3 text-brand-red"
                              aria-hidden="true"
                            />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </dd>
                    <dt className="text-brand-muted">Valid</dt>
                    <dd className="m-0 font-semibold text-brand-ink">
                      October 12, 2026 to October 12, 2031
                    </dd>
                  </dl>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setDtiLightboxOpen(true)}
                    aria-label="Inspect full DTI Certificate of Business Name Registration"
                    className="group relative block w-full max-w-[460px] overflow-hidden rounded-xl border border-brand-line shadow-[0_14px_34px_rgba(143,12,18,0.14)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <img
                      src="/assets/jas/dti-certificate.jpg"
                      alt="DTI Certificate of Business Name Registration for Ja’s Commision Computer Graphic Services"
                      width={900}
                      height={1161}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="block h-auto w-full"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-brand-ink/85 px-3 py-1.5 text-xs font-semibold text-white opacity-90 transition-opacity duration-150 group-hover:opacity-100"
                    >
                      <Expand className="h-3.5 w-3.5" />
                      <span>Zoom certificate</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Interactive FAQ Accordion */}
        <Reveal>
          <FaqSection onOpenConcernLetter={() => setConcernLetterOpen(true)} />
        </Reveal>

        {/* We're committed */}
        <Reveal>
          <section id="committed" className="pt-12 sm:pt-20">
            <div className="mx-auto w-[min(1120px,100%-1.5rem)] sm:w-[min(1120px,100%-2.5rem)]">
              <div className="max-w-2xl">
                <h2 className="font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-red">
                  We’re committed.
                </h2>
                <p className="mt-3 text-base leading-relaxed text-brand-muted sm:text-[1.125rem]">
                  We always do our best to complete your tasks with care, smooth
                  communication, and high-quality results.
                </p>
                <p className="mt-2.5 text-base text-brand-muted sm:text-[1.125rem]">
                  Thank you for trusting us.
                </p>
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => setConcernLetterOpen(true)}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3 text-base font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-brand-deep sm:w-auto"
                  >
                    <Mail className="h-4.5 w-4.5" aria-hidden="true" />
                    <span>Send your concern via email</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Contact */}
        <section id="contact" className="pt-12 sm:pt-20">
          <div className="mx-auto w-[min(1120px,100%-1.5rem)] sm:w-[min(1120px,100%-2.5rem)]">
            <div className="jas-hero-panel jas-contact-panel rounded-[22px] p-5 text-white sm:rounded-[28px] sm:p-12 lg:p-14">
              <h2 className="font-display text-[clamp(1.7rem,5vw,2.7rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-white">
                Message us on Facebook
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#ffeaea] sm:text-[1.125rem]">
                Send us a message on Facebook for orders or any concern. You can
                also email{' '}
                <a
                  href="mailto:jajascommision@gmail.com"
                  className="break-all font-semibold text-white underline underline-offset-4"
                >
                  jajascommision@gmail.com
                </a>{' '}
                <button
                  type="button"
                  onClick={() =>
                    handleCopyContact('email', 'jajascommision@gmail.com')
                  }
                  aria-label="Copy email address"
                  className="ml-1 inline-flex items-center gap-1 rounded-md border border-white/35 bg-white/10 px-2 py-0.5 align-middle text-xs font-semibold text-white transition-colors hover:bg-white/20"
                >
                  {copiedContact === 'email' ? (
                    <>
                      <Check className="h-3 w-3" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                .
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border-2 border-white bg-white px-6 py-3 text-base font-semibold whitespace-nowrap text-[#a50f15] transition-transform duration-150 hover:-translate-y-0.5 sm:w-auto sm:px-7"
                >
                  Message us on Facebook
                </a>
                <button
                  type="button"
                  onClick={() => openBuilder()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/65 bg-transparent px-6 py-3 text-base font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:border-white hover:bg-white/10 sm:w-auto sm:px-7"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Send email</span>
                </button>
              </div>

              <ul className="mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
                <li>
                  <a
                    href="https://www.instagram.com/jascommission2025"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border-2 border-white/25 bg-white/5 px-4 py-3.5 text-sm font-medium text-white transition-colors duration-150 hover:border-white"
                  >
                    <Instagram className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">@jascommission2025</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center justify-between gap-2 rounded-xl border-2 border-white/25 bg-white/5 px-4 py-3.5 text-sm font-medium text-white transition-colors duration-150 hover:border-white">
                    <a
                      href="tel:+639467990115"
                      className="flex min-w-0 items-center gap-3 tabular-nums"
                    >
                      <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span className="truncate">+63 946 799 0115</span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyContact('phone', '+63 946 799 0115')
                      }
                      aria-label="Copy phone number"
                      className="shrink-0 rounded-md p-1 text-white/80 hover:bg-white/15 hover:text-white"
                    >
                      {copiedContact === 'phone' ? (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Copy className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </li>
                <li>
                  <a
                    href="https://www.fiverr.com/s/8xy3v9o"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border-2 border-white/25 bg-white/5 px-4 py-3.5 text-sm font-medium text-white transition-colors duration-150 hover:border-white"
                  >
                    <span className="shrink-0 rounded-md bg-white px-2 py-0.5 font-display text-sm font-extrabold text-[#404145]">
                      fiverr<i className="not-italic text-[#1dbf73]">.</i>
                    </span>
                    <span className="truncate">Find us on Fiverr</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.upwork.com/freelancers/~01bb09cfffbc1387ed"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border-2 border-white/25 bg-white/5 px-4 py-3.5 text-sm font-medium text-white transition-colors duration-150 hover:border-white"
                  >
                    <span className="shrink-0 rounded-md bg-white px-2 py-0.5 font-display text-sm font-extrabold text-[#14a800]">
                      Upwork
                    </span>
                    <span className="truncate">Find us on Upwork</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="mt-14 border-t border-brand-line pt-8 pb-24 text-sm text-brand-muted sm:pb-10">
        <div className="mx-auto flex w-[min(1120px,100%-1.5rem)] items-center justify-between gap-4 sm:w-[min(1120px,100%-2.5rem)]">
          <div>© 2026 Ja’s Commission</div>
        </div>
      </footer>

      {/* Instant Interactive Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="jas-fade-in fixed bottom-[max(4.75rem,calc(env(safe-area-inset-bottom)+4.25rem))] left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-full bg-brand-ink px-4 py-2.5 text-center text-xs font-semibold text-white shadow-xl sm:bottom-6 sm:text-sm"
        >
          <Check className="h-4 w-4 shrink-0 text-[#ff8b90]" aria-hidden="true" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Floating Quick-Action Dock */}
      <FloatingQuickDock
        visible={showQuickDock}
        savedCount={savedSampleIds.length}
        onOpenCommission={() => openBuilder()}
      />

      {/* Interactive Commission Request Builder Modal */}
      <CommissionBuilderModal
        isOpen={builderOpen}
        onClose={() => setBuilderOpen(false)}
        prefill={builderPrefill}
        savedSamples={savedSamples}
        selectedPayment={selectedPayment}
        onSelectPayment={setSelectedPayment}
        onRemoveSavedSample={(id) => toggleSaveSample(id)}
      />

      {/* Letter-style Concern Email Modal */}
      <ConcernLetterModal
        isOpen={concernLetterOpen}
        onClose={() => setConcernLetterOpen(false)}
      />

      <LightboxModal
        items={feedbackLightboxItems}
        activeIndex={feedbackLightboxIndex}
        onClose={() => setFeedbackLightboxIndex(null)}
        onNavigate={(nextIndex) => setFeedbackLightboxIndex(nextIndex)}
      />

      <LightboxModal
        items={dtiLightboxItems}
        activeIndex={dtiLightboxOpen ? 0 : null}
        onClose={() => setDtiLightboxOpen(false)}
        onNavigate={() => {}}
      />
    </div>
  );
}
