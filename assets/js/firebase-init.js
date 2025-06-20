// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAU7VSaflcU9Rl7x0v3qixgVMv4TCn-40",
  authDomain: "timetobite-633d8.firebaseapp.com",
  projectId: "timetobite-633d8",
  storageBucket: "timetobite-633d8.firebasestorage.app",
  messagingSenderId: "110240199781",
  appId: "1:110240199781:web:2fb811aeaf242de138028c",
  measurementId: "G-SZN87MPS2V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);