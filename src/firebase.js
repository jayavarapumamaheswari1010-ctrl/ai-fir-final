import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBBBCQ7s26CAedDJLjhzZwDV2XnVT0lM1k",
  authDomain: "ai-fir-83741.firebaseapp.com",
  projectId: "ai-fir-83741",
  storageBucket: "ai-fir-83741.firebasestorage.app",
  messagingSenderId: "389097152107",
  appId: "1:389097152107:web:fe0661e4195c6b031e1b2e",
  measurementId: "G-L62MC0DFB9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
