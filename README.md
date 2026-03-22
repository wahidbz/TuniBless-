# TuniBless — README

## 🌍 Overview
**TuniBless** is a production-ready web application for a Tunisian-German volunteer organization with 24 regional branches across Tunisia.

---

## 🗂 Project Structure
```
tunibless/
├── index.html          # Home page (regions + activity feed)
├── login.html          # Auth page (login + register)
├── dashboard.html      # Coordinator dashboard
├── leaderboard.html    # Regional rankings
├── style.css           # All styles (RTL/LTR, responsive)
├── script.js           # Shared utilities, i18n, helpers
├── firebase.js         # Firebase SDK + config (ESM)
├── assets/
│   └── logo.png        # App logo
├── lang/
│   ├── ar.json         # Arabic translations
│   └── de.json         # German translations
├── README.md
└── .gitignore
```

---

## 🔥 Firebase Setup

### Step 1 — Create Firebase Project
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **Add project** → name it `tunibless`
3. Disable Google Analytics if not needed → **Create project**

### Step 2 — Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**

### Step 3 — Create Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose a region close to your users

### Step 4 — Set Firestore Rules
Paste in **Firestore → Rules** tab:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      allow read: if request.auth != null;
    }
    match /activities/{id} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.createdBy;
    }
  }
}
```

### Step 5 — Add Web App
1. In Project Settings → **Your apps** → click **</>** (Web)
2. Register app name: `TuniBless Web`
3. Copy the `firebaseConfig` object

### Step 6 — Paste Config into firebase.js
Open `firebase.js` and replace the placeholder values:
```js
const FIREBASE_CONFIG = {
  apiKey:            "AIza...",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId:             "1:1234567890:web:abc123"
};
```

---

## 🌐 Language System

Translations live in `lang/ar.json` (Arabic) and `lang/de.json` (German).

To translate any HTML element, add the `data-i18n` attribute:
```html
<h1 data-i18n="hero.title"></h1>
```

To translate a placeholder:
```html
<input data-i18n-ph="auth.email" />
```

The `t("key.path")` function in `script.js` does the lookup.

The language toggle button switches between Arabic (RTL) and German (LTR) and saves the preference in `localStorage`.

---

## 🚀 GitHub Pages Deployment

1. Push the project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USER/tunibless.git
   git push -u origin main
   ```

2. In GitHub → **Settings** → **Pages**
3. Source: **Deploy from a branch** → `main` / `root`
4. Visit: `https://YOUR_USER.github.io/tunibless/`

> ⚠️ Make sure Firebase config is filled in before deploying.

---

## ⭐ Points System

| Activity Type | Points |
|---------------|--------|
| Normal        | 10     |
| Big           | 20     |
| Special       | 30     |

---

## 🏆 Badge System

| Badge | Condition |
|-------|-----------|
| 🥇 Top State | Highest points overall |
| 🔥 Most Active | Highest number of activities |
| 🚀 Rising Star | 100–299 points |
| 💎 Impact Leader | 300+ points |

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Coordinator** | Add activities (no duplicate links), view dashboard |
| **Viewer** | Browse activities and leaderboard only |

---

## 📝 License
MIT License — Free to use and modify.
