import { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  type Timestamp,
  where,
} from 'firebase/firestore';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogIn,
  LogOut,
  MessageSquarePlus,
  Send,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import {
  auth,
  db,
  FEEDBACK_CATEGORIES,
  FEEDBACK_CONSTRAINTS,
  googleProvider,
  handleFirestoreError,
  OperationType,
  OWNER_ADMIN_EMAIL,
  type FeedbackCategory,
} from '../firebase';
import type { SampleWork } from '../data/samples';

interface FeedbackRecord {
  id: string;
  authorUid: string;
  authorName: string;
  rating: number;
  category: FeedbackCategory;
  message: string;
  sampleId?: number;
  status: 'published';
  createdAt: Timestamp | null;
}

interface PortfolioFeedbackBoardProps {
  prefillSample: SampleWork | null;
  onClearPrefillSample: () => void;
  onNotify?: (message: string) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Needs improvement',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent!',
};

function formatDate(ts: Timestamp | null): string {
  if (!ts) return 'Just now';
  try {
    return ts.toDate().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

export function PortfolioFeedbackBoard({
  prefillSample,
  onClearPrefillSample,
  onNotify,
}: PortfolioFeedbackBoardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);

  const [reviews, setReviews] = useState<FeedbackRecord[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Composer state
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<FeedbackCategory>(
    'Portfolio & General'
  );
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [justPosted, setJustPosted] = useState(false);

  // Delete confirmation state (no window.confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Category filter
  const [filterCategory, setFilterCategory] = useState<'All' | FeedbackCategory>(
    'All'
  );

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (nextUser?.displayName) {
        setAuthorName((prev) =>
          prev.trim().length > 0
            ? prev
            : nextUser.displayName!.slice(0, FEEDBACK_CONSTRAINTS.authorNameMax)
        );
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync prefilled sample when visitor clicks "Leave feedback" from a portfolio work
  useEffect(() => {
    if (!prefillSample) return;
    if (
      (FEEDBACK_CATEGORIES as readonly string[]).includes(prefillSample.category)
    ) {
      setCategory(prefillSample.category as FeedbackCategory);
    }
  }, [prefillSample]);

  // Live subscription to published portfolio feedback (publicly readable)
  useEffect(() => {
    const feedbackRef = collection(db, 'feedback');
    const publishedQuery = query(
      feedbackRef,
      where('status', '==', 'published'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      publishedQuery,
      (snapshot) => {
        const list: FeedbackRecord[] = snapshot.docs.map((snap) => {
          const data = snap.data();
          return {
            id: snap.id,
            authorUid: String(data.authorUid ?? ''),
            authorName: String(data.authorName ?? 'Client'),
            rating: Number(data.rating ?? 5),
            category: (data.category as FeedbackCategory) ?? 'Portfolio & General',
            message: String(data.message ?? ''),
            sampleId:
              typeof data.sampleId === 'number' ? data.sampleId : undefined,
            status: 'published',
            createdAt: (data.createdAt as Timestamp | null) ?? null,
          };
        });

        // Sort newest first client-side (avoids requiring a composite index)
        list.sort((a, b) => {
          const timeA = a.createdAt ? a.createdAt.toMillis() : Date.now();
          const timeB = b.createdAt ? b.createdAt.toMillis() : Date.now();
          return timeB - timeA;
        });

        setReviews(list);
        setLoadingReviews(false);
        setLoadError(null);
      },
      (error) => {
        setLoadingReviews(false);
        setLoadError('Unable to load visitor feedback right now.');
        try {
          handleFirestoreError(error, OperationType.LIST, 'feedback');
        } catch {
          // Structured error logged by handleFirestoreError
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const isOwnerAdmin =
    Boolean(user?.emailVerified) &&
    user?.email?.toLowerCase() === OWNER_ADMIN_EMAIL.toLowerCase();

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (filterCategory === 'All') return reviews;
    return reviews.filter((r) => r.category === filterCategory);
  }, [reviews, filterCategory]);

  const handleGoogleSignIn = async () => {
    setFormError(null);
    setAuthBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: string }).code)
          : '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // User dismissed the popup intentionally
      } else if (code === 'auth/unauthorized-domain') {
        const host = window.location.hostname;
        setFormError(
          `This website domain (${host}) needs to be added under Firebase Console → Authentication → Settings → Authorized domains before Google sign-in works here.`
        );
      } else if (code === 'auth/popup-blocked') {
        setFormError(
          'Your browser blocked the Google sign-in popup. Please allow popups for this site (or open the link directly in Chrome or Safari) and try again.'
        );
      } else {
        setFormError(
          `Could not complete Google sign-in${code ? ` (${code})` : ''}. Please open in Chrome or Safari and try again.`
        );
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    setAuthBusy(true);
    try {
      await signOut(auth);
      setConfirmDeleteId(null);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSubmitFeedback = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setJustPosted(false);

    if (!user || !user.emailVerified) {
      setFormError('Please sign in with a verified Google account to post.');
      return;
    }

    const cleanName = authorName
      .trim()
      .slice(0, FEEDBACK_CONSTRAINTS.authorNameMax);
    const cleanMessage = message
      .trim()
      .slice(0, FEEDBACK_CONSTRAINTS.messageMax);
    const safeRating = Math.min(
      FEEDBACK_CONSTRAINTS.ratingMax,
      Math.max(FEEDBACK_CONSTRAINTS.ratingMin, Math.round(rating))
    );

    if (cleanName.length < FEEDBACK_CONSTRAINTS.authorNameMin) {
      setFormError('Please enter your display name.');
      return;
    }

    if (cleanMessage.length < FEEDBACK_CONSTRAINTS.messageMin) {
      setFormError(
        `Please write at least ${FEEDBACK_CONSTRAINTS.messageMin} characters of feedback.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        authorUid: user.uid,
        authorName: cleanName,
        rating: safeRating,
        category,
        message: cleanMessage,
        status: 'published',
        createdAt: serverTimestamp(),
      };

      if (
        prefillSample &&
        Number.isInteger(prefillSample.id) &&
        prefillSample.id >= FEEDBACK_CONSTRAINTS.sampleIdMin &&
        prefillSample.id <= FEEDBACK_CONSTRAINTS.sampleIdMax
      ) {
        payload.sampleId = prefillSample.id;
      }

      await addDoc(collection(db, 'feedback'), payload);

      setMessage('');
      setRating(5);
      onClearPrefillSample();
      setJustPosted(true);
      onNotify?.('Thank you! Your feedback is now live.');
      window.setTimeout(() => setJustPosted(false), 4000);
    } catch (error) {
      setFormError('Could not save your feedback. Please try again.');
      try {
        handleFirestoreError(error, OperationType.CREATE, 'feedback');
      } catch {
        // Structured error logged by handleFirestoreError
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingId(reviewId);
    const targetPath = `feedback/${reviewId}`;
    try {
      await deleteDoc(doc(db, 'feedback', reviewId));
      setConfirmDeleteId(null);
      onNotify?.('Feedback removed.');
    } catch (error) {
      setFormError('Could not delete this feedback.');
      try {
        handleFirestoreError(error, OperationType.DELETE, targetPath);
      } catch {
        // Structured error logged by handleFirestoreError
      }
    } finally {
      setDeletingId(null);
    }
  };

  const displayStarValue = hoverRating ?? rating;

  return (
    <div
      id="leave-feedback"
      className="mt-10 border-t border-brand-line pt-8 sm:mt-12 sm:pt-10"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] text-brand-ink sm:text-2xl">
            Leave your feedback
          </h3>
          <p className="mt-1 text-sm text-brand-muted sm:text-base">
            Viewed our portfolio or completed a commission? Share your honest
            review for other visitors to see.
          </p>
        </div>

        {averageRating && (
          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-brand-line bg-white px-3.5 py-2 sm:self-end">
            <Star
              className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]"
              aria-hidden="true"
            />
            <span className="font-display text-sm font-extrabold text-brand-ink tabular-nums">
              {averageRating} / 5
            </span>
            <span className="text-xs text-brand-muted tabular-nums">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
      </div>

      {/* Feedback Submission Card */}
      <div className="mt-5 overflow-hidden rounded-2xl border-2 border-brand-red/30 bg-white shadow-[0_12px_30px_rgba(143,12,18,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-[#d3141c] to-[#9b0d14] px-4 py-3 text-white sm:px-6">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
            <span className="font-display text-sm font-extrabold tracking-tight sm:text-base">
              Share your experience with Ja’s Commission
            </span>
          </div>
          <div className="flex items-center gap-0.5" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="h-3.5 w-3.5 fill-[#fbbf24] text-[#fbbf24]"
              />
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {prefillSample && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-brand-red/30 bg-brand-tint px-3.5 py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={prefillSample.image}
                  alt={prefillSample.alt}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 shrink-0 rounded-lg border border-brand-line object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-brand-red">
                    Reviewing portfolio piece
                  </p>
                  <p className="truncate font-display text-xs font-bold text-brand-ink sm:text-sm">
                    {prefillSample.title} · Sample #{prefillSample.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClearPrefillSample}
                aria-label="Remove portfolio piece tag"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-brand-muted hover:bg-white hover:text-brand-red"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {!authReady ? (
            <div className="flex items-center gap-2 py-4 text-sm text-brand-muted">
              <Loader2 className="h-4 w-4 animate-spin text-brand-red" />
              <span>Checking sign-in status...</span>
            </div>
          ) : !user ? (
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-base font-extrabold text-brand-ink">
                  Tap the button to post your rating &amp; review
                </p>
                <p className="mt-1 text-xs leading-relaxed text-brand-muted sm:text-sm">
                  One-tap Google sign-in keeps reviews real and spam-free. Your
                  email is never displayed publicly.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authBusy}
                className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-bold whitespace-nowrap text-white shadow-[0_8px_20px_rgba(211,20,28,0.28)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-deep disabled:opacity-60 sm:w-auto sm:text-base"
              >
                {authBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                )}
                <span>Sign in with Google &amp; Write Review</span>
              </button>
            </div>
          ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-line pb-3">
              <div className="flex items-center gap-2 text-xs text-brand-muted">
                <span className="font-semibold text-brand-ink">
                  Signed in as {user.displayName || 'Google User'}
                </span>
                {isOwnerAdmin && (
                  <span className="rounded-md bg-brand-tint px-2 py-0.5 font-display text-[11px] font-bold text-brand-red">
                    Owner
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={authBusy}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-muted transition-colors hover:text-brand-red"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Sign out</span>
              </button>
            </div>

            {/* Interactive Star Rating */}
            <div>
              <span className="block text-xs font-semibold text-brand-muted">
                Your rating
              </span>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <div
                  className="inline-flex items-center gap-1"
                  role="radiogroup"
                  aria-label="Star rating"
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= displayStarValue;
                    return (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={rating === star}
                        aria-label={`Rate ${star} out of 5 stars`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setRating(star)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            filled
                              ? 'fill-[#f59e0b] text-[#f59e0b]'
                              : 'text-brand-line'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-semibold text-brand-ink tabular-nums">
                  {displayStarValue} / 5 — {RATING_LABELS[displayStarValue]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="feedback-name"
                  className="block text-xs font-semibold text-brand-muted"
                >
                  Your display name
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  required
                  maxLength={FEEDBACK_CONSTRAINTS.authorNameMax}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Alex S."
                  className="mt-1.5 w-full rounded-xl border border-brand-line bg-white px-3.5 py-2.5 text-sm text-brand-ink placeholder:text-brand-muted/65 focus:border-brand-red focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="feedback-category"
                  className="block text-xs font-semibold text-brand-muted"
                >
                  What are you reviewing?
                </label>
                <select
                  id="feedback-category"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as FeedbackCategory)
                  }
                  className="mt-1.5 w-full rounded-xl border border-brand-line bg-white px-3.5 py-2.5 text-sm font-medium text-brand-ink focus:border-brand-red focus:outline-none"
                >
                  {FEEDBACK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="feedback-message"
                  className="block text-xs font-semibold text-brand-muted"
                >
                  Your feedback
                </label>
                <span className="text-[11px] text-brand-muted tabular-nums">
                  {message.length} / {FEEDBACK_CONSTRAINTS.messageMax}
                </span>
              </div>
              <textarea
                id="feedback-message"
                required
                rows={3}
                minLength={FEEDBACK_CONSTRAINTS.messageMin}
                maxLength={FEEDBACK_CONSTRAINTS.messageMax}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share what you liked about our portfolio, layouts, communication, or finished commission..."
                className="mt-1.5 w-full resize-y rounded-xl border border-brand-line bg-white px-3.5 py-2.5 text-sm leading-relaxed text-brand-ink placeholder:text-brand-muted/65 focus:border-brand-red focus:outline-none"
              />
            </div>

            {formError && (
              <p
                role="alert"
                className="flex items-center gap-1.5 text-xs font-medium text-brand-red"
              >
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{formError}</span>
              </p>
            )}

            {justPosted && (
              <p
                role="status"
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Your review has been published to the portfolio!</span>
              </p>
            )}

            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-brand-muted">
                Posted publicly under your display name only.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition-colors duration-150 hover:bg-brand-deep disabled:opacity-60 sm:w-auto"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
                <span>{submitting ? 'Posting...' : 'Post feedback'}</span>
              </button>
            </div>
          </form>
        )}

          {formError && !user && (
            <p
              role="alert"
              className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-red"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{formError}</span>
            </p>
          )}
        </div>
      </div>

      {/* Live Visitor Reviews Feed */}
      <div className="mt-6">
        {reviews.length > 0 && (
          <div className="-mx-1 mb-4 overflow-x-auto px-1 pb-1">
            <div className="inline-flex min-w-max items-center gap-1 rounded-xl border border-brand-line bg-white p-1">
              {(['All', ...FEEDBACK_CATEGORIES] as const).map((tab) => {
                const isActive = filterCategory === tab;
                const count =
                  tab === 'All'
                    ? reviews.length
                    : reviews.filter((r) => r.category === tab).length;
                if (tab !== 'All' && count === 0) return null;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilterCategory(tab)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-brand-red text-white'
                        : 'text-brand-muted hover:bg-brand-tint hover:text-brand-ink'
                    }`}
                  >
                    {tab} <span className="tabular-nums">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loadingReviews ? (
          <div className="flex items-center gap-2 rounded-2xl border border-brand-line bg-white px-5 py-6 text-sm text-brand-muted">
            <Loader2 className="h-4 w-4 animate-spin text-brand-red" />
            <span>Loading portfolio reviews...</span>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-brand-line bg-white px-5 py-5 text-sm text-brand-muted">
            {loadError}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-line bg-white px-5 py-7 text-center">
            <p className="font-display text-sm font-bold text-brand-ink">
              Be the first to leave a portfolio review!
            </p>
            <p className="mt-1 text-xs text-brand-muted sm:text-sm">
              Your feedback appears live here for everyone viewing Ja’s
              Commission.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredReviews.map((review) => {
              const canDelete =
                Boolean(user?.emailVerified) &&
                (isOwnerAdmin || user?.uid === review.authorUid);

              return (
                <article
                  key={review.id}
                  className="jas-fade-in flex flex-col justify-between rounded-2xl border border-brand-line bg-white p-4 sm:p-5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-4 w-4 ${
                                s <= review.rating
                                  ? 'fill-[#f59e0b] text-[#f59e0b]'
                                  : 'text-brand-line'
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <h4 className="mt-1.5 truncate font-display text-sm font-bold text-brand-ink">
                          {review.authorName}
                        </h4>
                      </div>
                      <span className="shrink-0 text-xs text-brand-muted tabular-nums">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-brand-ink">
                      {review.message}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-line pt-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted">
                      <span className="font-semibold text-brand-red">
                        {review.category}
                      </span>
                      {review.sampleId && (
                        <span className="tabular-nums">
                          · Sample #{review.sampleId}
                        </span>
                      )}
                    </div>

                    {canDelete && (
                      <div className="flex items-center gap-1.5">
                        {confirmDeleteId === review.id ? (
                          <>
                            <button
                              type="button"
                              disabled={deletingId === review.id}
                              onClick={() => handleDeleteReview(review.id)}
                              className="rounded-md bg-brand-red px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
                            >
                              {deletingId === review.id
                                ? 'Removing...'
                                : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-md border border-brand-line px-2 py-1 text-xs font-semibold text-brand-muted hover:text-brand-ink"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(review.id)}
                            aria-label={`Delete review by ${review.authorName}`}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-muted transition-colors hover:bg-brand-tint hover:text-brand-red"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
