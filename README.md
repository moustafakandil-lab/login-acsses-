# Mini LMS — Week 1: Login & Roles

Base task: login for admin and learner, role-based page access, and one
centralized place that sends every email.

## Folder structure

```
mini-lms/
├── index.html                     # Vite entry HTML
├── package.json
├── vite.config.js
├── firestore.rules                # REAL access-control layer (server-side)
├── functions/
│   └── index.js                   # Cloud Function: the one place emails are sent
├── tests/
│   └── selfAdmin.test.js          # Proves no one can self-promote to admin
├── src/
│   ├── main.jsx                   # React entry point
│   ├── App.jsx                    # Routes + role-based redirect
│   ├── firebase.js                # Firebase config/init
│   ├── context/
│   │   └── AuthContext.jsx        # Tracks who is logged in + their role
│   ├── components/
│   │   └── ProtectedRoute.jsx     # Blocks a page if role doesn't match
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── LearnerDashboard.jsx
│   │   └── Unauthorized.jsx
│   ├── utils/
│   │   └── sendEmail.js           # Single email chokepoint + logging
│   └── styles/
│       ├── index.css
│       ├── auth.css
│       └── dashboard.css
└── plain-html-version/            # Same logic, no React/build tools
    ├── login.html
    ├── signup.html
    ├── dashboard-router.html
    └── style.css
```

## Setup

1. **Create a Firebase project** at console.firebase.google.com
2. Enable **Authentication → Email/Password**
3. Enable **Firestore Database** (start in production mode)
4. Copy your config values into `src/firebase.js` (and the plain HTML
   files if you use those) — replace every `YOUR_...` placeholder
5. Deploy the security rules: `firebase deploy --only firestore:rules`
6. Deploy the email function: `cd functions && npm install firebase-functions nodemailer && cd .. && firebase deploy --only functions`
7. Install and run the app:
   ```
   npm install
   npm run dev
   ```

## How each requirement is met

| Requirement | Where |
|---|---|
| Admin/learner sign up & login | `Signup.jsx` / `Login.jsx` via Firebase Auth |
| Role-based pages after login | `App.jsx` (`HomeRedirect`) + `AdminDashboard.jsx` / `LearnerDashboard.jsx` |
| Server blocks wrong-role access, even via direct URL | Two layers: `ProtectedRoute.jsx` (frontend redirect) **and** `firestore.rules` (real enforcement — blocks data access regardless of what the UI shows) |
| No self-promotion to admin | `Signup.jsx` hardcodes `role: 'learner'`; `firestore.rules` rejects any signup doc where role isn't `'learner'`; proven by `tests/selfAdmin.test.js` |
| Same error for wrong password / unknown email | `Login.jsx` always shows "Invalid email or password." regardless of the real Firebase error |
| One place sends every email, each one logged | `src/utils/sendEmail.js` (the only function anything should call) → `functions/index.js` (Cloud Function) → writes to `emailLogs` collection in Firestore |
| Test emails to a local inbox, failures logged | `functions/index.js` uses Ethereal (fake SMTP) instead of a real provider; `sendEmail.js` catches failures and logs `status: 'failed'` + reason without crashing |

## "Who is logged in" — the short version for your handover note

`AuthContext.jsx` listens to Firebase's `onAuthStateChanged`. Whenever
login state changes, it re-fetches that user's role from their
Firestore `users/{uid}` document (never trusting anything cached on
the client) and stores both the user and role in React Context. Any
component calls `useAuth()` to read `{ currentUser, role }`.
`ProtectedRoute` uses this to redirect away from pages that don't
match the user's role, and `firestore.rules` uses the same
`users/{uid}.role` field to enforce it again at the database level —
so even a request that skips the UI entirely is still blocked.

## Running the self-admin test

```
firebase emulators:exec --only firestore,auth "npx vitest run tests/selfAdmin.test.js"
```
