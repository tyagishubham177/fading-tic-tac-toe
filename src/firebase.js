// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace the following config object with your Firebase project's config
const firebaseConfig = {
  apiKey: "AIzaSyCtJhnjGozdnm2fU5eQQSh8WN8ipVX-P3E",
  authDomain: "fading-tictactoe.firebaseapp.com",
  projectId: "fading-tictactoe",
  storageBucket: "fading-tictactoe.appspot.com",
  messagingSenderId: "211944890149",
  appId: "1:211944890149:web:731db4ad6b552e6ccc84cc",
  measurementId: "G-TKDZ67C09G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
