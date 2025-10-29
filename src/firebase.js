// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANfy17YjNp_Zh_TVZ-KBZQnrbWXtQ4vwM",
  authDomain: "advent-calendar-1219d.firebaseapp.com",
  projectId: "advent-calendar-1219d",
  storageBucket: "advent-calendar-1219d.firebasestorage.app",
  messagingSenderId: "350359114979",
  appId: "1:350359114979:web:9e3c0c9f2c6584b0eae1d6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
