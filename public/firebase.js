// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  child, 
  update,
  query,
  orderByChild,
  limitToFirst
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX6Ss6i1aEy_oQ_ZCvnkASMetFU1yAS7s",
  authDomain: "pinmate-v2.firebaseapp.com",
  databaseURL: "https://pinmate-v2-default-rtdb.asia-southeast1.firebasedatabase.app", // Realtime DB URL
  projectId: "pinmate-v2",
  storageBucket: "pinmate-v2.appspot.com",
  messagingSenderId: "956442114065",
  appId: "1:956442114065:web:e74bab5fcd8f1a16ab19b0",
  measurementId: "G-7F5VTNC40F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app,
  "https://pinmate-v2-default-rtdb.asia-southeast1.firebasedatabase.app"
);

// Export for other scripts
export { 
  app, 
  auth, 
  db, 
  ref, 
  set, 
  get, 
  child, 
  update,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
  , sendEmailVerification
};
