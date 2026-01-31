// ============================================
// Firebase v9 (MODULAR) SDKs - 100% Firebase v9
// ============================================
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
  limitToFirst,
  push      // ✅ Added push
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ============================================
// Firebase Configuration
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyAX6Ss6i1aEy_oQ_ZCvnkASMetFU1yAS7s",
  authDomain: "pinmate-v2.firebaseapp.com",
  databaseURL: "https://pinmate-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pinmate-v2",
  storageBucket: "pinmate-v2.appspot.com",
  messagingSenderId: "956442114065",
  appId: "1:956442114065:web:e74bab5fcd8f1a16ab19b0",
  measurementId: "G-7F5VTNC40F"
};

// ============================================
// Initialize Firebase (v9 Modular)
// ============================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ============================================
// Helper: Check if user is admin
// Checks BOTH custom claim AND database role for redundancy
// Force refresh to ensure latest claims
// ============================================
async function isUserAdmin(user) {
  if (!user) return false;
  
  try {
    const idTokenResult = await user.getIdTokenResult(true);
    
    if (idTokenResult?.claims?.admin === true) {
      console.log("✅ Admin verified via custom claim");
      return true;
    }
    
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      if (userData.role === "admin") {
        console.log("✅ Admin verified via database role");
        return true;
      }
    }
    
    console.log("❌ User is not admin");
    return false;
  } catch (err) {
    console.error("❌ Error checking admin status:", err);
    return false;
  }
}

// ============================================
// Export Everything (v9 Modular SDK)
// ============================================
export {
  app,
  auth,
  db,
  isUserAdmin,

  // Auth Functions
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,

  // Database Functions
  ref,
  set,
  get,
  child,
  update,
  query,
  orderByChild,
  limitToFirst,
  push      // ✅ Export push for creating projects
};
// ============================================