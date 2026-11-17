
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAc_5OQJgX5mB74PriwSWKWC9phpsCqPjc",
  authDomain: "studysync-77259.firebaseapp.com",
  projectId: "studysync-77259",
  storageBucket: "studysync-77259.firebasestorage.app",
  messagingSenderId: "821367665477",
  appId: "1:821367665477:web:7f549eda0e1f3678fc042c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Cloud Firestore
const db = getFirestore(app);

// Export Firebase services and functions
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
};
