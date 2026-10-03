# Email OTP rollout

The prepared frontend uses `signInWithOtp` with `shouldCreateUser: true`, then `verifyOtp` with `type: email`. Both login and signup use the same shared form. Successful verification establishes the browser session before a fresh dashboard request; the existing profile guard sends incomplete profiles to onboarding. Completing onboarding opens the dashboard. Existing user IDs, profiles and attempts are retained.

## Production configuration required before merging

Project: `afhwegrxnvgsqbqadvwr` (defence-pathshala-pyq).

1. Authentication > Emails: confirm custom SMTP is configured and can deliver to ordinary student addresses. Supabase's built-in test mail service is restricted and is unsuitable for production. Do not replace existing working SMTP settings without checking them.
2. Authentication > Emails > Templates: paste `email-otp-template.html` into both **Magic link or OTP** and **Confirm sign up** templates. Subject: `Your Defence Pathshala verification code`. Preserve any unrelated templates. The literal `{{ .Token }}` variable is required; a confirmation URL alone does not deliver a code.
3. Authentication > Sign In / Providers > Email: retain email verification, enable email sign-in and new-user signup, inspect the configured OTP length, and use an appropriate short expiry (10 minutes recommended). The frontend accepts 6–10 digits to support the configured length. Preserve server-side resend and verification rate limits.
4. Do not disable email confirmation or manually mark accounts confirmed to get around failed delivery.
5. Check the live main branch for concurrent Google OAuth work before merging; retain Google sign-in if it has been added.

## Verification before publishing

- Request a code for the owner's existing test account, including an account that was previously unconfirmed. Check that the email contains a code, not only a link.
- Enter the code through secure browser authentication. Confirm verification creates a signed-in session.
- For a new/incomplete profile, complete all three onboarding steps. The dashboard must open automatically and remain signed in after refresh.
- For an existing onboarded user, verification must open the dashboard directly and preserve attempts.
- Incorrect/expired codes must show an error without navigating. Resend uses a 60-second client cooldown in addition to Supabase enforcement. Changing email clears the old code.
- Code/session values must never be logged or committed.

## Automated checks

From repository root:

```
node --test scripts/test-email-otp.cjs scripts/test-onboarding.cjs
npx --prefix frontend tsc --noEmit -p frontend/tsconfig.json
npm run build --prefix frontend
```

Run targeted ESLint inside frontend for the changed auth components and helper.

## Rollback

Keep the previous deployment available. If delivery or verification fails, retain/revert the current password-login production deployment; do not publish an OTP-only interface with unverified templates/SMTP. OTP verification depends on email delivery even though it removes passwords and confirmation-link friction.

References:
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/auth-email-templates
- https://supabase.com/docs/guides/auth/auth-smtp
