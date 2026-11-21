import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  PaymentMethodsCard,
  PaymentProcessBanner,
  type PaymentPlatformName,
} from './PaymentAndAwareness';

const WORKFLOW_STEPS = [
  {
    title: 'Send your request',
    description:
      'Message us on Facebook or by email with what you need and your deadline.',
    tip: 'Include your rubric, file format, target deadline, and any reference sample number so we can quote accurately right away.',
  },
  {
    title: 'Receive your invoice',
    description:
      'We send an official invoice with the price before the task begins.',
    tip: 'Your official invoice clearly lists the agreed price, payment channel, and expected turnaround so there are zero surprises.',
  },
  {
    title: 'Pay the 50% downpayment',
    description:
      'This confirms your order. Orders are only processed after the downpayment is confirmed.',
    tip: 'Send a clear screenshot of your transfer receipt to lock in your slot on our production schedule.',
  },
  {
    title: 'We start your task',
    description:
      'We may send a sample or progress update to show your work has begun.',
    tip: 'You can review progress previews and request small alignment tweaks while the work is underway.',
  },
  {
    title: 'Settle the balance',
    description: 'Pay the remaining balance once the task is complete.',
    tip: 'Once we notify you that your commission is finished, settle the remaining 50% via your preferred payment platform.',
  },
  {
    title: 'Receive your final file',
    description: 'The final file is sent after the balance is paid in full.',
    tip: 'Delivered cleanly in your requested editable or ready-to-submit format (DOCX, XLSX, PDF, Canva, MP4, or source code).',
  },
];

interface WorkflowSectionProps {
  selectedPayment: PaymentPlatformName;
  onSelectPayment: (platform: PaymentPlatformName) => void;
}

export function WorkflowSection({
  selectedPayment,
  onSelectPayment,
}: WorkflowSectionProps) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="flow" className="pt-12 sm:pt-20">
      <div className="mx-auto w-[min(1120px,100%-1.5rem)] sm:w-[min(1120px,100%-2.5rem)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.7rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-red">
              How a commission flows
            </h2>
            <p className="mt-2.5 text-base text-brand-muted sm:text-[1.125rem]">
              You get an invoice first, and the work starts once your
              downpayment is confirmed. Click any step to see details.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-end">
            <span className="text-xs font-semibold text-brand-muted tabular-nums">
              Step {activeStep + 1} of {WORKFLOW_STEPS.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setActiveStep(
                  (prev) => (prev - 1 + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length
                )
              }
              aria-label="Previous step"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length)
              }
              aria-label="Next step"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink transition-colors duration-150 hover:border-brand-red hover:text-brand-red"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-9 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.25fr_1fr]">
          <ol className="m-0 list-none p-0">
            {WORKFLOW_STEPS.map((step, index) => {
              const isLast = index === WORKFLOW_STEPS.length - 1;
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              return (
                <li
                  key={step.title}
                  className={`relative grid grid-cols-[2.25rem_1fr] gap-3 sm:grid-cols-[2.6rem_1fr] sm:gap-4 ${
                    isLast ? 'pb-0' : 'pb-5'
                  }`}
                >
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className={`absolute top-[2.25rem] bottom-0 left-[1.125rem] w-0.5 transition-colors duration-150 sm:top-[2.6rem] sm:left-[1.3rem] ${
                        isCompleted ? 'bg-brand-red' : 'bg-brand-line'
                      }`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveStep(index)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`relative z-10 grid h-[2.25rem] w-[2.25rem] place-items-center rounded-full font-display text-sm font-extrabold tabular-nums transition-transform duration-150 sm:h-[2.6rem] sm:w-[2.6rem] sm:text-base ${
                      isActive
                        ? 'scale-105 bg-brand-red text-white shadow-[0_6px_16px_rgba(211,20,28,0.3)]'
                        : isCompleted
                        ? 'bg-brand-red/85 text-white'
                        : 'border-2 border-brand-line bg-white text-brand-red hover:border-brand-red'
                    }`}
                  >
                    {index + 1}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors duration-150 ${
                      isActive
                        ? 'border-brand-red/40 bg-brand-tint'
                        : 'border-transparent bg-transparent hover:bg-brand-tint/60'
                    }`}
                  >
                    <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-brand-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-base text-brand-muted">
                      {step.description}
                    </p>
                    {isActive && (
                      <p className="mt-2.5 border-t border-brand-line pt-2.5 text-sm leading-relaxed text-brand-ink">
                        {step.tip}
                      </p>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <PaymentMethodsCard
            selectedPayment={selectedPayment}
            onSelectPayment={onSelectPayment}
          />
        </div>

        <PaymentProcessBanner />
      </div>
    </section>
  );
}
