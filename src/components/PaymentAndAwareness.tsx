import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, ExternalLink, Instagram } from 'lucide-react';
import { FACEBOOK_URL } from '../data/samples';

const INSTAGRAM_URL = 'https://www.instagram.com/jascommission2025';

export type PaymentPlatformName =
  | 'GCash'
  | 'BPI'
  | 'Maya'
  | 'Visa'
  | 'Mastercard'
  | 'PayPal';

function GCashLogo() {
  return (
    <svg
      viewBox="0 0 120 32"
      className="h-7 w-auto"
      role="img"
      aria-label="GCash"
    >
      <circle cx="16" cy="16" r="14" fill="#007DFE" />
      <path
        d="M21.8 14.8H16v3.1h2.9c-.4 1.6-1.6 2.5-3.3 2.5-2.2 0-3.8-1.7-3.8-4.4s1.6-4.4 3.8-4.4c1.2 0 2.2.5 2.9 1.3l2.3-2.2C19.5 9.3 17.8 8.5 15.6 8.5 11.4 8.5 8.4 11.6 8.4 16s3 7.5 7.2 7.5c4.2 0 6.8-2.9 6.8-7.1 0-.6-.1-1.1-.6-1.6z"
        fill="#FFFFFF"
      />
      <text
        x="36"
        y="22"
        fill="#0057C2"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontWeight="800"
        fontSize="16"
        letterSpacing="-0.4"
      >
        GCash
      </text>
    </svg>
  );
}

function BPILogo() {
  return (
    <svg
      viewBox="0 0 112 32"
      className="h-7 w-auto"
      role="img"
      aria-label="BPI"
    >
      <rect x="2" y="3" width="26" height="26" rx="5" fill="#B11116" />
      <rect x="2" y="23" width="26" height="6" rx="2" fill="#F4B223" />
      <path
        d="M8.5 19.5V8.5h5.2c2.2 0 3.5 1.1 3.5 2.8 0 1.2-.7 2-1.8 2.4 1.4.3 2.2 1.3 2.2 2.7 0 1.9-1.5 3.1-3.9 3.1H8.5zm2.7-6.7h2c.8 0 1.3-.4 1.3-1s-.5-1-1.3-1h-2v2zm0 4.5h2.2c.9 0 1.4-.4 1.4-1.1s-.5-1.1-1.4-1.1h-2.2v2.2z"
        fill="#FFFFFF"
      />
      <text
        x="36"
        y="22"
        fill="#B11116"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontWeight="800"
        fontSize="17"
        letterSpacing="0.8"
      >
        BPI
      </text>
    </svg>
  );
}

function MayaLogo() {
  return (
    <svg
      viewBox="0 0 110 32"
      className="h-7 w-auto"
      role="img"
      aria-label="Maya"
    >
      <rect x="2" y="4" width="24" height="24" rx="6" fill="#0B1320" />
      <path
        d="M7.5 21V11h2.8l3.7 5.2L17.7 11h2.8v10h-2.6v-5.6l-3.2 4.4h-1.4l-3.2-4.4V21H7.5z"
        fill="#2EE59D"
      />
      <text
        x="33"
        y="22"
        fill="#0B1320"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontWeight="800"
        fontSize="16"
        letterSpacing="-0.3"
      >
        maya
      </text>
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg
      viewBox="0 0 100 32"
      className="h-7 w-auto"
      role="img"
      aria-label="Visa"
    >
      <rect x="2" y="5" width="96" height="22" rx="4" fill="#1A1F71" />
      <rect x="2" y="23" width="96" height="4" rx="1" fill="#F7B600" />
      <text
        x="50"
        y="20"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="14.5"
        letterSpacing="1.6"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg
      viewBox="0 0 132 32"
      className="h-7 w-auto"
      role="img"
      aria-label="Mastercard"
    >
      <circle cx="15" cy="16" r="10" fill="#EB001B" />
      <circle cx="27" cy="16" r="10" fill="#F79E1B" fillOpacity="0.92" />
      <text
        x="43"
        y="20.5"
        fill="#2B0D0F"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontWeight="700"
        fontSize="12.5"
        letterSpacing="-0.3"
      >
        Mastercard
      </text>
    </svg>
  );
}

function PayPalLogo() {
  return (
    <svg
      viewBox="0 0 116 32"
      className="h-7 w-auto"
      role="img"
      aria-label="PayPal"
    >
      <path
        d="M11.5 6.5h6.7c3.3 0 5.3 1.6 4.8 4.9-.5 3.6-2.9 5.5-6.4 5.5h-2.5l-1.1 6.6H9.2l2.3-17z"
        fill="#003087"
      />
      <path
        d="M15.6 10.5h6c2.9 0 4.6 1.4 4.1 4.4-.5 3.2-2.6 4.9-5.8 4.9h-2.2l-1 5.7h-3.4l2.3-15z"
        fill="#009CDE"
        fillOpacity="0.9"
      />
      <text
        x="32"
        y="21.5"
        fill="#003087"
        fontFamily="Montserrat, system-ui, sans-serif"
        fontWeight="800"
        fontSize="14.5"
        letterSpacing="-0.3"
      >
        Pay<tspan fill="#009CDE">Pal</tspan>
      </text>
    </svg>
  );
}

export const PAYMENT_PLATFORMS: {
  name: PaymentPlatformName;
  subtitle: string;
  note: string;
  Logo: () => React.JSX.Element;
}[] = [
  {
    name: 'GCash',
    subtitle: 'E-Wallet',
    note: 'Instant GCash transfer — send your receipt screenshot on Facebook right after paying the 50% deposit.',
    Logo: GCashLogo,
  },
  {
    name: 'BPI',
    subtitle: 'Bank Transfer',
    note: 'Direct BPI bank transfer or InstaPay — account details are included on your official invoice.',
    Logo: BPILogo,
  },
  {
    name: 'Maya',
    subtitle: 'E-Wallet',
    note: 'Fast Maya wallet or InstaPay transfer with instant verification before your task starts.',
    Logo: MayaLogo,
  },
  {
    name: 'Visa',
    subtitle: 'Debit / Credit',
    note: 'Pay securely with Visa debit or credit card via the payment link included with your invoice.',
    Logo: VisaLogo,
  },
  {
    name: 'Mastercard',
    subtitle: 'Debit / Credit',
    note: 'Mastercard debit and credit cards accepted for both downpayment and final balance settlement.',
    Logo: MastercardLogo,
  },
  {
    name: 'PayPal',
    subtitle: 'International',
    note: 'Ideal for overseas clients — official PayPal invoice sent before work begins.',
    Logo: PayPalLogo,
  },
];

interface PaymentMethodsCardProps {
  selectedPayment: PaymentPlatformName;
  onSelectPayment: (platform: PaymentPlatformName) => void;
}

export function PaymentMethodsCard({
  selectedPayment,
  onSelectPayment,
}: PaymentMethodsCardProps) {
  const activePlatform =
    PAYMENT_PLATFORMS.find((p) => p.name === selectedPayment) ??
    PAYMENT_PLATFORMS[0];

  return (
    <aside className="rounded-2xl border-2 border-brand-red/25 bg-brand-tint p-4 shadow-[0_10px_28px_rgba(143,12,18,0.07)] sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-extrabold text-brand-red">
          Payment methods
        </h3>
        <span className="text-xs font-medium text-brand-muted">
          Tap to select
        </span>
      </div>
      <p className="mt-1.5 text-sm text-brand-muted">
        Pick your preferred platform for the 50% deposit and final balance:
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
        {PAYMENT_PLATFORMS.map(({ name, subtitle, Logo }) => {
          const isSelected = name === selectedPayment;
          return (
            <button
              key={name}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectPayment(name)}
              className={`relative flex flex-col justify-between gap-2 rounded-xl border-2 bg-white px-2.5 py-2.5 text-left transition-transform duration-150 hover:-translate-y-0.5 sm:px-3.5 sm:py-3 ${
                isSelected
                  ? 'border-brand-red shadow-xs'
                  : 'border-brand-line hover:border-brand-red/50'
              }`}
            >
              {isSelected && (
                <span
                  aria-hidden="true"
                  className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-white"
                >
                  <Check className="h-3 w-3" />
                </span>
              )}
              <div className="flex items-center">
                <Logo />
              </div>
              <span className="text-xs text-brand-muted">{subtitle}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-brand-line bg-white px-4 py-3">
        <p className="text-xs leading-relaxed text-brand-ink">
          <strong className="font-semibold text-brand-red">
            {activePlatform.name}:
          </strong>{' '}
          {activePlatform.note}
        </p>
      </div>
    </aside>
  );
}

export function PaymentProcessBanner() {
  const fbContainerRef = useRef<HTMLDivElement | null>(null);
  const [fbWidth, setFbWidth] = useState(500);

  useEffect(() => {
    const el = fbContainerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const measured = Math.floor(el.clientWidth);
      if (measured > 0) {
        // Facebook Page Plugin supports widths between 180px and 500px
        const clamped = Math.max(260, Math.min(500, measured));
        setFbWidth((prev) => (Math.abs(prev - clamped) >= 12 ? clamped : prev));
      }
    };

    updateWidth();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const facebookPluginSrc = `https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fjascommission2024&tabs=timeline&width=${fbWidth}&height=400&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#d3141c] via-[#b3121a] to-[#8f0c12] p-5 text-white shadow-[0_14px_32px_rgba(143,12,18,0.22)] sm:p-7 lg:p-8">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <AlertTriangle className="h-4.5 w-4.5 text-white" aria-hidden="true" />
          </span>
          <h3 className="font-display text-lg font-extrabold text-white sm:text-xl">
            Payment Process &amp; 50% Deposit
          </h3>
        </div>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-[#ffeaea] sm:text-base">
          After viewing our portfolio, please send a message to our Facebook
          page or any of our contact channels for your payment process. Please{' '}
          <strong className="font-semibold text-white underline decoration-white/60 underline-offset-4">
            confirm and pay a 50% deposit before work begins
          </strong>
          .
        </p>
      </div>

      <div className="mt-5 space-y-4 border-t border-white/20 pt-5">
        <p className="text-sm leading-relaxed text-[#ffeaea]">
          Preview our official Facebook &amp; Instagram accounts to see our
          latest posts, sample updates, and announcements:
        </p>

        {/* Balanced 2-Column Live Social Previews on Desktop/Tablet, Stacked on Phone */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {/* Live Facebook Page Preview */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-white/25 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-brand-line bg-brand-tint px-3.5 py-2.5">
              <span className="truncate font-display text-xs font-bold text-brand-ink">
                Facebook · @jascommission2024
              </span>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-red hover:underline"
              >
                <span>Open</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
            <div
              ref={fbContainerRef}
              className="flex w-full justify-center overflow-hidden bg-white"
            >
              <iframe
                title="Ja’s Commission Facebook Page Live Preview"
                src={facebookPluginSrc}
                width={fbWidth}
                height="400"
                className="block max-w-full border-0 bg-white"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
          </div>

          {/* Live Instagram Profile Preview */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-white/25 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-brand-line bg-brand-tint px-3.5 py-2.5">
              <span className="inline-flex min-w-0 items-center gap-1.5 font-display text-xs font-bold text-brand-ink">
                <Instagram
                  className="h-3.5 w-3.5 shrink-0 text-brand-red"
                  aria-hidden="true"
                />
                <span className="truncate">Instagram · @jascommission2025</span>
              </span>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-red hover:underline"
              >
                <span>Open</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
            <iframe
              title="Ja’s Commission Instagram Profile Preview"
              src="https://www.instagram.com/jascommission2025/embed/"
              width="100%"
              height="400"
              className="block w-full border-0 bg-white"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-brand-red transition-colors duration-150 hover:bg-[#ffeaea] sm:w-auto sm:text-sm"
          >
            <span>View Facebook Page</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border border-white/60 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-white hover:text-brand-red sm:w-auto sm:text-sm"
          >
            <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
            <span>View Instagram (@jascommission2025)</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
