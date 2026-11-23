# Security Specification — Portfolio Feedback (`firestore.rules`)

## 1. Data Invariants
1. Every document in `/feedback/{feedbackId}` MUST have a valid ID (`^[a-zA-Z0-9_\-]+$`, 1–128 chars).
2. Only verified authenticated users (`request.auth != null && request.auth.token.email_verified == true`) can create, update, or delete feedback documents.
3. On `create`, `authorUid` MUST strictly match `request.auth.uid`, `status` MUST be `'published'`, and `createdAt` MUST equal `request.time`.
4. No PII (`email`, `phone`, `address`) is ever stored in `/feedback/{feedbackId}`.
5. `authorUid` and `createdAt` are immortal (immutable) after creation.
6. Only the document's author (updating `rating`, `message`, or `category` only) or the verified owner admin (`angelacunanan2006@gmail.com` with `email_verified == true`) may update or delete a review.
7. Public reads (`get` and `list`) are restricted exclusively to documents where `resource.data.status == 'published'`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Write**: Anonymous client tries to `create` a feedback doc without signing in. -> `PERMISSION_DENIED`
2. **Unverified Email Write**: Signed-in user with `email_verified: false` tries to `create` feedback. -> `PERMISSION_DENIED`
3. **Identity Spoofing**: Verified user A tries to `create` feedback with `authorUid: "user_B"`. -> `PERMISSION_DENIED`
4. **Shadow Field Injection**: Verified user includes extra ghost field `isVerified: true` on `create`. -> `PERMISSION_DENIED`
5. **Backdated / Forged Timestamp**: Verified user sends a client-fabricated `createdAt` instead of `serverTimestamp()`. -> `PERMISSION_DENIED`
6. **Rating Out of Range**: Verified user sends `rating: 99` or `rating: "5"` (wrong type). -> `PERMISSION_DENIED`
7. **Denial-of-Wallet Oversized Message**: Verified user sends a 2,000-char `message` (exceeds `maxLength: 500`). -> `PERMISSION_DENIED`
8. **ID Poisoning**: Verified user attempts to `create` at `/feedback/invalid$id!with..spaces` or a 200-char ID. -> `PERMISSION_DENIED`
9. **Unauthorized Category**: Verified user sends `category: "Hacked Category"` outside the allowed enum. -> `PERMISSION_DENIED`
10. **Sample ID Out of Bounds**: Verified user sends `sampleId: 999` or `sampleId: "1"`. -> `PERMISSION_DENIED`
11. **Admin Email Spoofing**: Attacker sets token email `angelacunanan2006@gmail.com` with `email_verified: false` to delete another user's review. -> `PERMISSION_DENIED`
12. **Immutable Field Tampering**: Author tries to `update` their review to change `authorUid` or `createdAt` or `authorName`. -> `PERMISSION_DENIED`
