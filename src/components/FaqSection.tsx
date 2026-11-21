import { useState } from 'react';
import { ChevronDown, Mail } from 'lucide-react';

interface FaqSectionProps {
  onOpenConcernLetter: () => void;
}

const FAQ_ITEMS = [
  {
    q: 'How do I get a price quote for my task?',
    a: 'Click "Commission now" or message any service on Facebook with your task category, target deadline, and files or rubric. We review everything and send an official invoice with the exact price before any work starts.',
  },
  {
    q: 'Why is there a 50% downpayment before work begins?',
    a: 'The 50% deposit confirms your order and reserves your deadline slot on our schedule. The remaining 50% balance is settled only once your commission is finished, right before the final editable or ready-to-submit file is released.',
  },
  {
    q: 'Do you accept rush deadlines (under 24 hours)?',
    a: 'Yes! Select "Today (Rush)" in our deadline planner or choose Rush (Under 24 hrs) in the commission form so we can immediately check slot availability and fast-track your order.',
  },
  {
    q: 'What file formats will I receive?',
    a: 'We deliver in the exact format you need — including Canva links, PNG/PDF print files, MP4 edited videos, DOCX/PDF papers, Excel (.xlsx) workbooks with working formulas, AutoCAD/SketchUp files, or full web/IT source code.',
  },
  {
    q: 'What if I need small revisions or have a concern?',
    a: 'We send progress updates while working so you can confirm alignment early. For any follow-ups, revisions, or concerns, you can message us on Facebook or send a concern letter directly to our email.',
  },
];

export function FaqSection({ onOpenConcernLetter }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="pt-14 sm:pt-20">
      <div className="mx-auto w-[min(1120px,100%-2.5rem)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-red">
              Frequently asked questions
            </h2>
            <p className="mt-2.5 text-base text-brand-muted sm:text-[1.125rem]">
              Quick answers about pricing, deposits, rush tasks, and file
              delivery.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenConcernLetter}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full border border-brand-line bg-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red sm:self-end"
          >
            <Mail className="h-4 w-4 text-brand-red" aria-hidden="true" />
            <span>Ask a question via email</span>
          </button>
        </div>

        <div className="mt-7 divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-white">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-brand-tint/60 sm:px-6 sm:py-5"
                >
                  <span className="font-display text-base font-bold text-brand-ink sm:text-[1.05rem]">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-red transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="jas-fade-in px-5 pb-5 text-sm leading-relaxed text-brand-muted sm:px-6 sm:text-base">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
