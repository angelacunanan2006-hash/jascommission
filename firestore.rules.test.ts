/**
 * Security Rules Verification Specification for `/feedback/{feedbackId}`
 * Covers all 12 Dirty Dozen adversarial payloads from `security_spec.md`.
 *
 * Run against the Firebase Emulator Suite (`@firebase/rules-unit-testing`)
 * when testing rules locally.
 */

export interface AdversarialCase {
  id: number;
  name: string;
  operation: 'create' | 'update' | 'delete';
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  docId: string;
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: AdversarialCase[] = [
  {
    id: 1,
    name: 'Unauthenticated create blocked',
    operation: 'create',
    auth: null,
    docId: 'rev_001',
    payload: {
      authorUid: 'anon',
      authorName: 'Guest',
      rating: 5,
      category: 'Portfolio & General',
      message: 'Great portfolio work!',
      status: 'published',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified email create blocked',
    operation: 'create',
    auth: { uid: 'user_a', email: 'a@example.com', email_verified: false },
    docId: 'rev_002',
    payload: {
      authorUid: 'user_a',
      authorName: 'Alex',
      rating: 5,
      category: 'Graphic & Video',
      message: 'Super fast delivery!',
      status: 'published',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Identity spoofing authorUid blocked',
    operation: 'create',
    auth: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    docId: 'rev_003',
    payload: {
      authorUid: 'user_b',
      authorName: 'Alex',
      rating: 5,
      category: 'Graphic & Video',
      message: 'Impersonated review text',
      status: 'published',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow field injection blocked',
    operation: 'create',
    auth: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    docId: 'rev_004',
    payload: {
      authorUid: 'user_a',
      authorName: 'Alex',
      rating: 5,
      category: 'IT & Coding',
      message: 'Valid length message text',
      status: 'published',
      isAdminVerified: true,
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Client-forged timestamp blocked',
    operation: 'create',
    auth: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    docId: 'rev_005',
    payload: {
      authorUid: 'user_a',
      authorName: 'Alex',
      rating: 5,
      category: 'Data & Excel',
      message: 'Trying to backdate timestamp',
      status: 'published',
      createdAt: new Date('2020-01-01T00:00:00Z'),
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Rating out of bounds blocked',
    operation: 'create',
    auth: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    docId: 'rev_006',
    payload: {
      authorUid: 'user_a',
      authorName: 'Alex',
      rating: 99,
      category: 'Research & Docs',
      message: 'Invalid rating value test',
      status: 'published',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Oversized message (>500 chars) blocked',
    operation: 'create',
    auth: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    docId: 'rev_007',
    payload: {
      authorUid: 'user_a',
      authorName: 'Alex',
      rating: 5,
      category: 'AI Services',
      message: 'A'.repeat(501),
      status: 'published',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Invalid document ID poisoning blocked',
    operation: 'create',
    auth: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    docId: 'bad$id!space',
    payload: {
      authorUid: 'user_a',
      authorName: 'Alex',
      rating: 5,
      category: 'Portfolio & General',
      message: 'Testing invalid doc ID',
      status: 'published',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Unauthorized category enum blocked',
    operation: 'create',
    auth: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    docId: 'rev_009',
    payload: {
      authorUid: 'user_a',
      authorName: 'Alex',
      rating: 5,
      category: 'Unlisted Service',
      message: 'Testing invalid category',
      status: 'published',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Sample ID out of range (>45) blocked',
    operation: 'create',
    auth: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    docId: 'rev_010',
    payload: {
      authorUid: 'user_a',
      authorName: 'Alex',
      rating: 5,
      category: 'Graphic & Video',
      message: 'Testing out of range sampleId',
      sampleId: 999,
      status: 'published',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Unverified admin email spoof delete blocked',
    operation: 'delete',
    auth: {
      uid: 'attacker',
      email: 'angelacunanan2006@gmail.com',
      email_verified: false,
    },
    docId: 'rev_existing',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Author tampering with immutable authorUid on update blocked',
    operation: 'update',
    auth: { uid: 'user_a', email: 'a@example.com', email_verified: true },
    docId: 'rev_existing',
    payload: {
      authorUid: 'user_b',
      message: 'Attempting ownership transfer',
    },
    expected: 'PERMISSION_DENIED',
  },
];
