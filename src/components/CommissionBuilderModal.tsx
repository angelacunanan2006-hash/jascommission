import { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  Send,
  X,
} from 'lucide-react';
import {
  SAMPLE_CATEGORIES,
  type SampleWork,
} from '../data/samples';
import {
  PAYMENT_PLATFORMS,
  type PaymentPlatformName,
} from './PaymentAndAwareness';

export interface CommissionPrefill {
  category?: string;
  referenceSample?: SampleWork | null;
  focusDeadline?: boolean;
  deliverables?: string[];
  deadline?: string;
  urgency?: (typeof URGENCY_OPTIONS)[number]['id'];
}

interface CommissionBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill: CommissionPrefill | null;
  savedSamples: SampleWork[];
  selectedPayment: PaymentPlatformName;
  onSelectPayment: (platform: PaymentPlatformName) => void;
  onRemoveSavedSample: (id: number) => void;
}

const DESTINATION_EMAIL = 'jajascommision@gmail.com';
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${DESTINATION_EMAIL}`;

const SERVICE_OPTIONS = [
  ...SAMPLE_CATEGORIES.filter((c) => c !== 'All'),
  'AI Services',
  'Custom Request',
];

const URGENCY_OPTIONS = [
  { id: 'standard', label: 'Standard (3+ days)' },
  { id: 'priority', label: 'Priority (1–2 days)' },
  { id: 'rush', label: 'Rush (Under 24 hrs)' },
] as const;

export function CommissionBuilderModal({
  isOpen,
  onClose,
  prefill,
  savedSamples,
  selectedPayment,
  onSelectPayment,
  onRemoveSavedSample,
}: CommissionBuilderModalProps) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceType, setServiceType] = useState('Data & Excel');
  const [deadline, setDeadline] = useState('');
  const [urgency, setUrgency] = useState<(typeof URGENCY_OPTIONS)[number]['id']>(
    'standard'
  );
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [sendStatus, setSendStatus] = useState<
    'idle' | 'sending' | 'sent' | 'fallback'
  >('idle');
  const [fbCopied, setFbCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (prefill?.category && SERVICE_OPTIONS.includes(prefill.category)) {
      setServiceType(prefill.category);
    }
    if (prefill?.referenceSample) {
      setServiceType(prefill.referenceSample.category);
    }
    if (prefill?.deadline !== undefined) {
      setDeadline(prefill.deadline);
    }
    if (prefill?.urgency) {
      setUrgency(prefill.urgency);
    }
    setError('');
    setSendStatus('idle');
    setFbCopied(false);
  }, [isOpen, prefill]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const urgencyLabel =
    URGENCY_OPTIONS.find((u) => u.id === urgency)?.label ?? 'Standard (3+ days)';

  const referenceList = useMemo(() => {
    const map = new Map<number, SampleWork>();
    if (prefill?.referenceSample) {
      map.set(prefill.referenceSample.id, prefill.referenceSample);
    }
    for (const s of savedSamples) {
      map.set(s.id, s);
    }
    return Array.from(map.values());
  }, [prefill?.referenceSample, savedSamples]);

  const formattedMessage = useMemo(() => {
    const lines = [
      'Hi Ja’s Commission! I would like to request a quote / invoice:',
      '',
      `Name: ${clientName.trim() || '(Not provided)'}`,
      `Email: ${clientEmail.trim() || '(Not provided)'}`,
      `Service Type: ${serviceType}`,
      `Deadline: ${deadline || 'Flexible'} (${urgencyLabel})`,
      `Preferred Payment: ${selectedPayment} (50% downpayment ready)`,
    ];
    if (referenceList.length > 0) {
      lines.push(
        `Reference Samples: ${referenceList
          .map((s) => `#${s.id} ${s.title}`)
          .join(', ')}`
      );
    }
    return lines.join('\n');
  }, [
    clientName,
    clientEmail,
    serviceType,
    deadline,
    urgencyLabel,
    selectedPayment,
    referenceList,
  ]);

  if (!isOpen) return null;

  const emailSubject = `Commission Request: ${serviceType}${
    deadline ? ` (Due ${deadline})` : ''
  }`;
  const mailtoHref = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(formattedMessage)}`;
  const gmailComposeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    DESTINATION_EMAIL
  )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
    formattedMessage
  )}`;
  const messengerHref = `https://m.me/jascommission2024?text=${encodeURIComponent(
    formattedMessage
  )}`;

  const validateForm = () => {
    if (!clientName.trim()) {
      setError('Please enter your name so we know who to address the invoice to.');
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(clientEmail.trim())) {
      setError('Please enter a valid email address so we can send your official invoice.');
      return false;
    }
    setError('');
    return true;
  };

  const handleAutoSendEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSendStatus('sending');
    setError('');

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: clientName.trim(),
          email: clientEmail.trim(),
          _replyto: clientEmail.trim(),
          _subject: emailSubject,
          _template: 'table',
          _captcha: 'false',
          'Service Category': serviceType,
          'Target Deadline': deadline || 'Flexible',
          'Turnaround Pace': urgencyLabel,
          'Preferred Payment': `${selectedPayment} (50% deposit policy)`,
          'Reference Samples':
            referenceList.length > 0
              ? referenceList.map((s) => `#${s.id} ${s.title}`).join(', ')
              : 'None selected',
        }),
      });

      if (!response.ok) {
        throw new Error('Email service returned an error');
      }

      setSendStatus('sent');
    } catch {
      setSendStatus('fallback');
    }
  };

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setError('Could not access clipboard. You can select the text preview manually.');
    }
  };

  const handleCopyAndFacebook = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setFbCopied(true);
    } catch {
      // Allow opening Facebook even if clipboard is unavailable
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Send commission request by email"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-brand-line bg-brand-tint px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4">
          <div>
            <h2 className="font-display text-xl font-extrabold text-brand-red">
              Send commission request
            </h2>
            <p className="mt-0.5 text-sm text-brand-muted">
              Fill out your details below to send them automatically to{' '}
              <span className="font-semibold text-brand-ink">
                {DESTINATION_EMAIL}
              </span>{' '}
              or Facebook Messenger.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close commission form"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-line bg-white text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Success state */}
        {sendStatus === 'sent' ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-tint text-brand-red">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-2xl font-extrabold text-brand-ink">
              Email sent automatically!
            </h3>
            <p className="mt-2 max-w-md text-base text-brand-muted">
              Your commission request for{' '}
              <strong className="font-semibold text-brand-ink">
                {serviceType}
              </strong>{' '}
              has been delivered to{' '}
              <strong className="font-semibold text-brand-ink">
                {DESTINATION_EMAIL}
              </strong>
              . We will reply to{' '}
              <strong className="font-semibold text-brand-ink">
                {clientEmail}
              </strong>{' '}
              with your official invoice.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-brand-deep"
              >
                Done
              </button>
              <a
                href={messengerHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCopyAndFacebook}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-line bg-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
              >
                <Send className="h-3.5 w-3.5 text-brand-red" aria-hidden="true" />
                <span>Send on Facebook Messenger too</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleAutoSendEmail}
            noValidate
            className="grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-y-auto p-4 sm:gap-6 sm:p-6 lg:grid-cols-[1.2fr_1fr]"
          >
            {/* Form Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="comm-name"
                    className="block text-sm font-semibold text-brand-ink"
                  >
                    Your name <span className="text-brand-red">*</span>
                  </label>
                  <input
                    id="comm-name"
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="e.g. Alex Santos"
                    className="mt-1.5 w-full rounded-xl border border-brand-line bg-white px-3.5 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted/60 focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="comm-email"
                    className="block text-sm font-semibold text-brand-ink"
                  >
                    Your email <span className="text-brand-red">*</span>
                  </label>
                  <input
                    id="comm-email"
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => {
                      setClientEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl border border-brand-line bg-white px-3.5 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted/60 focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="comm-service"
                    className="block text-sm font-semibold text-brand-ink"
                  >
                    Task category
                  </label>
                  <select
                    id="comm-service"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-brand-line bg-white px-3.5 py-2.5 text-sm text-brand-ink focus:border-brand-red focus:outline-none"
                  >
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="comm-deadline"
                    className="block text-sm font-semibold text-brand-ink"
                  >
                    Target deadline
                  </label>
                  <input
                    id="comm-deadline"
                    type="date"
                    autoFocus={Boolean(prefill?.focusDeadline)}
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-brand-line bg-white px-3.5 py-2.5 text-sm text-brand-ink focus:border-brand-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold text-brand-ink">
                  Turnaround pace
                </span>
                <div className="mt-1.5 grid grid-cols-1 gap-1.5 rounded-xl border border-brand-line bg-brand-tint p-1.5 sm:grid-cols-3 sm:gap-1 sm:p-1">
                  {URGENCY_OPTIONS.map((opt) => {
                    const active = urgency === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setUrgency(opt.id)}
                        className={`rounded-lg px-2.5 py-2.5 text-xs font-semibold transition-colors duration-150 sm:py-2 ${
                          active
                            ? 'bg-brand-red text-white'
                            : 'text-brand-muted hover:bg-white hover:text-brand-ink'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-sm font-semibold text-brand-ink">
                  Preferred payment method
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {PAYMENT_PLATFORMS.map((p) => {
                    const active = selectedPayment === p.name;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => onSelectPayment(p.name)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                          active
                            ? 'border-brand-red bg-brand-red text-white'
                            : 'border-brand-line bg-white text-brand-ink hover:border-brand-red/60'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {referenceList.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-brand-muted">
                    Attached reference samples
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {referenceList.map((sample) => (
                      <span
                        key={sample.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-line bg-brand-tint px-2.5 py-1 text-xs font-medium text-brand-ink"
                      >
                        <span className="tabular-nums text-brand-red">
                          #{sample.id}
                        </span>
                        <span>{sample.title}</span>
                        {savedSamples.some((s) => s.id === sample.id) && (
                          <button
                            type="button"
                            onClick={() => onRemoveSavedSample(sample.id)}
                            aria-label={`Remove sample #${sample.id}`}
                            className="ml-0.5 text-brand-muted hover:text-brand-red"
                          >
                            <X className="h-3 w-3" aria-hidden="true" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-brand-red/30 bg-brand-tint px-3.5 py-2.5 text-sm font-medium text-brand-red"
                >
                  {error}
                </p>
              )}
            </div>

            {/* Live Order Summary & Automatic Send */}
            <div className="flex flex-col justify-between rounded-2xl border border-brand-line bg-brand-tint p-5">
              <div>
                <div className="flex items-baseline justify-between border-b-2 border-brand-ink pb-3">
                  <h3 className="font-display text-lg font-extrabold text-brand-ink">
                    ORDER BRIEF
                  </h3>
                  <span className="text-xs font-semibold text-brand-red">
                    Invoice before work
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                  <dt className="text-brand-muted">To</dt>
                  <dd className="m-0 truncate text-right font-semibold text-brand-ink">
                    {DESTINATION_EMAIL}
                  </dd>
                  <dt className="text-brand-muted">Category</dt>
                  <dd className="m-0 text-right font-semibold text-brand-ink">
                    {serviceType}
                  </dd>
                  <dt className="text-brand-muted">Deadline</dt>
                  <dd className="m-0 text-right font-semibold text-brand-ink tabular-nums">
                    {deadline || 'Flexible'}
                  </dd>
                  <dt className="text-brand-muted">Pace</dt>
                  <dd className="m-0 text-right font-semibold text-brand-ink">
                    {urgencyLabel}
                  </dd>
                  <dt className="text-brand-muted">Payment</dt>
                  <dd className="m-0 text-right font-semibold text-brand-ink">
                    {selectedPayment}
                  </dd>
                  <dt className="border-t border-brand-line pt-2 text-brand-muted">
                    Deposit policy
                  </dt>
                  <dd className="m-0 border-t border-brand-line pt-2 text-right font-bold text-brand-red">
                    50% downpayment
                  </dd>
                </dl>
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={sendStatus === 'sending'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-70 sm:px-5"
                >
                  {sendStatus === 'sending' ? (
                    <>
                      <Loader2
                        className="h-4 w-4 shrink-0 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Sending email...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>Send details to Email automatically</span>
                    </>
                  )}
                </button>

                {sendStatus === 'fallback' && (
                  <div className="rounded-xl border border-brand-red/30 bg-white p-3 text-xs text-brand-ink">
                    <p className="font-semibold text-brand-red">
                      Direct send was blocked by your network.
                    </p>
                    <p className="mt-1 text-brand-muted">
                      Send instantly with one click below:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={gmailComposeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-red px-3 py-1.5 font-semibold text-white"
                      >
                        <span>Open in Gmail</span>
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                      <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-1 rounded-lg border border-brand-line bg-brand-tint px-3 py-1.5 font-semibold text-brand-ink"
                      >
                        <span>Open Mail App</span>
                      </a>
                    </div>
                  </div>
                )}

                <a
                  href={messengerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCopyAndFacebook}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-red bg-white px-4 py-2.5 text-center text-sm font-semibold text-brand-red transition-colors duration-150 hover:bg-brand-red hover:text-white sm:px-5"
                >
                  <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Send details to Facebook Messenger</span>
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0 opacity-70"
                    aria-hidden="true"
                  />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={gmailComposeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-line bg-white px-3 py-2 text-xs font-semibold whitespace-nowrap text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
                  >
                    <span>Open in Gmail</span>
                    <ExternalLink
                      className="h-3 w-3 opacity-60"
                      aria-hidden="true"
                    />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyBrief}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-brand-line bg-white px-3 py-2 text-xs font-semibold whitespace-nowrap text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
                  >
                    {copied ? (
                      <>
                        <Check
                          className="h-3.5 w-3.5 text-brand-red"
                          aria-hidden="true"
                        />
                        <span>Brief copied</span>
                      </>
                    ) : (
                      <>
                        <Copy
                          className="h-3.5 w-3.5 text-brand-red"
                          aria-hidden="true"
                        />
                        <span>Copy brief</span>
                      </>
                    )}
                  </button>
                </div>

                {fbCopied && (
                  <p className="text-center text-xs font-medium text-brand-red">
                    Messenger opened with your brief pre-filled (and copied as backup).
                  </p>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
