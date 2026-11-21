import { type FormEvent, useEffect, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  Send,
  X,
} from 'lucide-react';

interface ConcernLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DESTINATION_EMAIL = 'jajascommision@gmail.com';
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${DESTINATION_EMAIL}`;

export function ConcernLetterModal({
  isOpen,
  onClose,
}: ConcernLetterModalProps) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [letterBody, setLetterBody] = useState('');
  const [error, setError] = useState('');
  const [sendStatus, setSendStatus] = useState<
    'idle' | 'sending' | 'sent' | 'fallback'
  >('idle');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setSendStatus('idle');
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

  if (!isOpen) return null;

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const resolvedSubject =
    subject.trim() || 'Client Concern — Ja’s Commission';

  const formattedLetter = [
    todayFormatted,
    '',
    'Dear Ja’s Commission,',
    '',
    letterBody.trim() || '(Write your concern or message here)',
    '',
    'Sincerely,',
    senderName.trim() || '(Your Name)',
    senderEmail.trim() || '(Your Email)',
  ].join('\n');

  const gmailComposeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    DESTINATION_EMAIL
  )}&su=${encodeURIComponent(resolvedSubject)}&body=${encodeURIComponent(
    formattedLetter
  )}`;

  const mailtoHref = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(
    resolvedSubject
  )}&body=${encodeURIComponent(formattedLetter)}`;

  const validateLetter = () => {
    if (!letterBody.trim()) {
      setError('Please write your concern or message in the letter before sending.');
      return false;
    }
    if (!senderName.trim()) {
      setError('Please sign your name at the bottom of the letter.');
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(senderEmail.trim())) {
      setError('Please enter a valid email address so we can reply to your concern.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSendLetter = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateLetter()) return;

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
          name: senderName.trim(),
          email: senderEmail.trim(),
          _replyto: senderEmail.trim(),
          _subject: resolvedSubject,
          _template: 'box',
          _captcha: 'false',
          Date: todayFormatted,
          Letter: formattedLetter,
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

  const handleResetAndClose = () => {
    setSenderName('');
    setSenderEmail('');
    setSubject('');
    setLetterBody('');
    setError('');
    setSendStatus('idle');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Send your concern via email letter"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Stationery Top Header */}
        <div className="flex items-center justify-between gap-3 border-b border-brand-line bg-brand-tint px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red text-white">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-xl font-extrabold text-brand-red">
                Write a concern letter
              </h2>
              <p className="text-xs text-brand-muted sm:text-sm">
                Delivered automatically via email to{' '}
                <span className="font-semibold text-brand-ink">
                  {DESTINATION_EMAIL}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close concern letter"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-line bg-white text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {sendStatus === 'sent' ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-tint text-brand-red">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-2xl font-extrabold text-brand-ink">
              Your letter has been sent!
            </h3>
            <p className="mt-2 max-w-md text-base text-brand-muted">
              Thank you,{' '}
              <strong className="font-semibold text-brand-ink">
                {senderName}
              </strong>
              . Your concern letter has been emailed to{' '}
              <strong className="font-semibold text-brand-ink">
                {DESTINATION_EMAIL}
              </strong>
              . We will reply to{' '}
              <strong className="font-semibold text-brand-ink">
                {senderEmail}
              </strong>{' '}
              as soon as possible.
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-7 inline-flex items-center justify-center rounded-full bg-brand-red px-7 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-deep"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSendLetter}
            noValidate
            className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6"
          >
            {/* Letter Paper Frame */}
            <div className="rounded-2xl border border-brand-line bg-[#fffdfd] p-4 shadow-xs sm:p-7">
              {/* Letter Meta: Date & Recipient */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-brand-line pb-4 text-xs text-brand-muted sm:text-sm">
                <div>
                  <span className="font-semibold text-brand-ink">To:</span> Ja’s
                  Commission ({DESTINATION_EMAIL})
                </div>
                <div className="tabular-nums">{todayFormatted}</div>
              </div>

              {/* Subject Line */}
              <div className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                <label
                  htmlFor="letter-subject"
                  className="shrink-0 text-sm font-semibold text-brand-muted"
                >
                  Subject:
                </label>
                <input
                  id="letter-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about my order, revision request, or concern"
                  className="w-full border-b border-brand-line bg-transparent py-1.5 text-sm font-medium text-brand-ink placeholder:text-brand-muted/55 focus:border-brand-red focus:outline-none"
                />
              </div>

              {/* Salutation */}
              <p className="mt-6 font-display text-base font-bold text-brand-ink">
                Dear Ja’s Commission,
              </p>

              {/* Letter Body */}
              <div className="mt-3">
                <label htmlFor="letter-body" className="sr-only">
                  Your concern message
                </label>
                <textarea
                  id="letter-body"
                  rows={6}
                  required
                  value={letterBody}
                  onChange={(e) => {
                    setLetterBody(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Write your concern, question, or feedback here in full detail..."
                  className="w-full resize-y rounded-xl border border-brand-line bg-white px-4 py-3 text-[0.98rem] leading-relaxed text-brand-ink placeholder:text-brand-muted/55 focus:border-brand-red focus:outline-none"
                />
              </div>

              {/* Closing & Signature */}
              <div className="mt-6 border-t border-brand-line/70 pt-5">
                <p className="font-display text-sm font-bold text-brand-ink">
                  Sincerely,
                </p>

                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="letter-name"
                      className="block text-xs font-semibold text-brand-muted"
                    >
                      Your name <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="letter-name"
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => {
                        setSenderName(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="e.g. Alex Santos"
                      className="mt-1 w-full border-b border-brand-line bg-transparent py-1.5 text-sm font-semibold text-brand-ink placeholder:font-normal placeholder:text-brand-muted/55 focus:border-brand-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="letter-email"
                      className="block text-xs font-semibold text-brand-muted"
                    >
                      Your email <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="letter-email"
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => {
                        setSenderEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="you@example.com"
                      className="mt-1 w-full border-b border-brand-line bg-transparent py-1.5 text-sm font-semibold text-brand-ink placeholder:font-normal placeholder:text-brand-muted/55 focus:border-brand-red focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-brand-red/30 bg-brand-tint px-4 py-2.5 text-sm font-medium text-brand-red"
              >
                {error}
              </p>
            )}

            {sendStatus === 'fallback' && (
              <div className="mt-4 rounded-xl border border-brand-red/30 bg-brand-tint p-3.5 text-xs text-brand-ink">
                <p className="font-semibold text-brand-red">
                  Direct email send was blocked by your network.
                </p>
                <p className="mt-1 text-brand-muted">
                  Send your formatted letter in one click below:
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
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
                    className="inline-flex items-center gap-1 rounded-lg border border-brand-line bg-white px-3 py-1.5 font-semibold text-brand-ink"
                  >
                    <span>Open Mail App</span>
                  </a>
                </div>
              </div>
            )}

            {/* Submit & Backup Actions */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="submit"
                disabled={sendStatus === 'sending'}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none"
              >
                {sendStatus === 'sending' ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Sending letter...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Send letter via email</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={gmailComposeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-white px-4 py-2.5 text-xs font-semibold whitespace-nowrap text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
                >
                  <span>Open in Gmail</span>
                  <ExternalLink
                    className="h-3.5 w-3.5 opacity-60"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
