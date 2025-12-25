
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, disableNetwork, setLogLevel } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * FIREBASE CONFIGURATION
 * Using the specific API key provided by the user to fix Google Sign-In and Auth service errors.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAbB2niq5JKmAu2zGjLmpDWIt1NxBM7j2E",
  authDomain: "somaiyacampusai.firebaseapp.com",
  projectId: "somaiyacampusai",
  storageBucket: "somaiyacampusai.appspot.com",
  messagingSenderId: "364007415782",
  appId: "1:364007415782:web:6443c7b897825a0b"
};

setLogLevel('error');

let dbInstance: any = null;
let storageInstance: any = null;
let authInstance: any = null;
let isDbAvailable = true;

try {
  const app = initializeApp(firebaseConfig);
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
  storageInstance = getStorage(app);
  authInstance = getAuth(app);
} catch (error) {
  console.warn("[Somaiya AI] Firebase initialization error. Please ensure the API Key has the 'Identity Toolkit API' enabled in Google Cloud Console.");
  isDbAvailable = false;
}

export const db = dbInstance;
export const storage = storageInstance;
export const auth = authInstance;
export const googleProvider = new GoogleAuthProvider();
export { isDbAvailable, disableNetwork };
