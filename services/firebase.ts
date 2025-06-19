// firebase.js
import { FirebaseApp, initializeApp } from 'firebase/app'; // Import FirebaseApp type
import { Auth, getAuth } from 'firebase/auth'; // Import Auth type
import { Firestore, getFirestore } from 'firebase/firestore'; // Import Firestore t
// --- Firebase Configuration ---
// IMPORTANT: Replace with your actual Firebase project configuration
// You can find this in your Firebase project settings -> Project settings -> General -> Your apps
// const firebaseConfig = {
//   apiKey: Config.API_KEY,
//   authDomain: Config.AUTH_DOMAIN,
//   projectId: Config.PROJECT_ID,
//   storageBucket: Config.STORAGE_BUCKET,
//   messagingSenderId: Config.MESSAGING_SENDER_ID,
//   appId: Config.APP_ID,
//   measurementId: Config.MEASUREMENT_ID
// };

const firebaseConfig = {
    apiKey: 'AIzaSyB40qBaRnLTdPauztHcSajA6mFAGJe__Ck',
    authDomain: 'connect-354ab.firebaseapp.com',
    projectId: 'connect-354ab',
    storageBucket: 'connect-354ab.firebasestorage.app',
    messagingSenderId: '1078014453255',
    appId: '1:1078014453255:web:5b9ddfc9209de0fa82eca2',
    measurementId: 'G-5SP4KCQSY7'
  };
console.log("firebaseConfig",firebaseConfig)
// Initialize Firebase App
let app: FirebaseApp;
let authInstance: Auth;
let dbInstance: Firestore;

try {
  // Initialize Firebase App
  app = initializeApp(firebaseConfig);

  // Get Auth and Firestore service instances
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);

  console.log("Firebase app initialized successfully.");
} catch (e: any) {
  console.error("Failed to initialize Firebase app:", e.message);
  // Optionally, re-throw or handle the error more gracefully if Firebase init is critical
  // For production, you might want to show an error screen or log to a crash reporting service
}

// Export the instances only if they were successfully initialized
export const auth = authInstance!; // Using ! for non-null assertion as initialization is handled above
export const db = dbInstance!;

// This file initializes Firebase and exports the auth and db instances.
// You can now import `auth` and `db` into any component or service file that needs to interact with Firebase.
