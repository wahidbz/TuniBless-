// ============================================================
//  TuniBless — firebase.js
//  Replace the placeholder values below with your Firebase
//  project credentials from the Firebase Console.
//
//  HOW TO GET YOUR CONFIG:
//  1. Go to https://console.firebase.google.com/
//  2. Create or open your project
//  3. Click ⚙️ Project Settings → General → Your apps
//  4. Click </> (Web app) and copy the firebaseConfig object
//  5. Paste the values into the constants below
//
//  FIRESTORE RULES (paste in Firebase Console → Firestore → Rules):
//  rules_version = '2';
//  service cloud.firestore {
//    match /databases/{database}/documents {
//      match /users/{uid} {
//        allow read, write: if request.auth != null && request.auth.uid == uid;
//      }
//      match /activities/{id} {
//        allow read: if true;
//        allow create: if request.auth != null;
//        allow update, delete: if request.auth != null &&
//          request.auth.uid == resource.data.createdBy;
//      }
//    }
//  }
// ============================================================

const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ── Import Firebase SDKs (ESM CDN) ──────────────────────────
import { initializeApp }                    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, signOut,
         onAuthStateChanged }               from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, doc,
         setDoc, getDoc, getDocs, addDoc,
         query, where, orderBy, onSnapshot,
         serverTimestamp, Timestamp }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Initialize ───────────────────────────────────────────────
const app  = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db   = getFirestore(app);

export {
  auth, db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection, doc, setDoc, getDoc, getDocs,
  addDoc, query, where, orderBy, onSnapshot,
  serverTimestamp, Timestamp
};
