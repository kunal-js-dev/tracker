import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDt2K8L9OXg1KB258LMKeyItEy7hUadNt0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'tracker-1ec76.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'tracker-1ec76',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'tracker-1ec76.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '310588564419',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:310588564419:web:b7632d65cb3e1f8b5d1376',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-6031K1YPMY',
};

// Check if all essential Firebase credentials are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
  !firebaseConfig.apiKey.includes('your_')
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Failed to initialize live Firebase:', error);
  }
} else {
  console.info(
    'ℹ️ Firebase environment variables are not configured or are using placeholders. Running in local demonstration mode.'
  );
}

export { app, auth, db };
