import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfqyWUR5viZHNLVSXrob_BmyGmZPW6AGk",
  authDomain: "osteoscan-ai.firebaseapp.com",
  projectId: "osteoscan-ai",
  storageBucket: "osteoscan-ai.firebasestorage.app",
  messagingSenderId: "905833872598",
  appId: "1:905833872598:web:5eb5551ada972e45729d77",
  measurementId: "G-ZB7YFH8VPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
