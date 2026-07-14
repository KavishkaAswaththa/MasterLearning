# MasterLearning LMS Application

MasterLearning is a premium, state-of-the-art Learning Management System (LMS) designed with a modern glassmorphic layout, fluid animations, and real-time database synchronizations.

---

## 🌟 Key Features

* **Liquid Glassmorphism**: Stunning visual aesthetics, harmonies of tailored HSL colors, dynamic hover effects, and ambient glow graphic overlays using pure CSS modules and `framer-motion`.
* **Dynamic Role-Based Workspaces**:
  * **Student**: View progress metrics, study streaks, upcoming assignments, and take responsive interactive quizzes.
  * **Teacher**: Monitor assigned classes, review recent quiz submissions, and publish curriculum modules.
  * **Administrator**: Manage user profiles, monitor system log events, backup databases, and revoke user access dynamically.
* **Assessment Engine**: Custom multi-choice interactive quizzes with timed countdowns and real-time score logging.
* **Auth Protection**: Client-side route guards protecting dashboards and quiz routes from unauthorized guest access.

---

## 🛠️ Technology Stack

1. **Framework**: [Next.js](https://nextjs.org/) (App Router & Turbopack compiler)
2. **Styling**: Vanilla CSS Modules (avoiding Tailwind for clean modular layout controls)
3. **Database**: [Firebase Firestore](https://firebase.google.com/) with a hybrid client-side cache fallback
4. **Icons & Animations**: [Lucide React](https://lucide.dev/) and [Framer Motion](https://www.framer.com/motion/)

---

## 📁 Environment Setup

Create a `.env.local` file in the root directory mapping your Firebase Web App credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

An example template is provided in [.env.sample](file:///.env.sample).

---

## 🗄️ Hybrid Database Architecture (`src/lib/db.ts`)

MasterLearning implements a **fail-safe database access layer** that coordinates operations:
1. **Primary Writes/Reads**: Queries are processed through **Firebase Firestore** Client SDK collections (`users` and `submissions`).
2. **Automatic Fallback**: If the client is offline, has network connection issues, or Firestore security rules throw a `PERMISSION_DENIED` warning, the helper catches the exception and processes the transaction locally in the browser's `localStorage` cache (`registered_users` and `submissions` data blocks).

---

## 🔒 Firebase Security Rules Setup

To resolve `PERMISSION_DENIED` error codes when running database scripts, configure your **Firestore Rules** in the Firebase Console to allow client-side reading and writing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // In production, customize rules to secure user records
    }
  }
}
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Seeding (Firestore & localStorage)
Run the seeder utility script to inject the predefined users and dynamic submissions logs:
```bash
node --env-file=.env.local scripts/seed.js
```
*(Make sure Firestore security rules are configured to permit writes before running the seeder, or it will fall back to local caching).*

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build and Compile checks
Verify TypeScript compilation and linter cleanliness:
```bash
npm run build
npm run lint
```

---

## 👥 Seeded Test Credentials

You can log in to the portal using these default credentials:

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@masterlearning.com` | `password123` |
| **Teacher** | `teacher@masterlearning.com` | `password123` |
| **Student** | `student@masterlearning.com` | `password123` |
