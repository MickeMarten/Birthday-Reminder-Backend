import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getFirestore,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

// Kontrollera om Deno.env finns (i produktion) eller använd dotenv (lokalt)
const firebaseConfig = {
  apiKey: Deno.env.get('FIREBASE_API_KEY') || env.FIREBASE_API_KEY,
  authDomain: Deno.env.get('FIREBASE_AUTH_DOMAIN') || env.FIREBASE_AUTH_DOMAIN,
  projectId: Deno.env.get('FIREBASE_PROJECT_ID') || env.FIREBASE_PROJECT_ID,
  storageBucket: Deno.env.get('FIREBASE_STORAGE_BUCKET') || env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Deno.env.get('FIREBASE_MESSAGING_SENDER_ID') || env.FIREBASE_MESSAGING_SENDER_ID,
  appId: Deno.env.get('FIREBASE_APP_ID') || env.FIREBASE_APP_ID,
  measurementId: Deno.env.get('FIREBASE_MEASUREMENT_ID') || env.FIREBASE_MEASUREMENT_ID,
};

// Initialisera Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };