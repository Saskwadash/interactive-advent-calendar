import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANfy17YjNp_Zh_TVZ-KBZQnrbWXtQ4vwM",
  authDomain: "advent-calendar-1219d.firebaseapp.com",
  projectId: "advent-calendar-1219d",
  storageBucket: "advent-calendar-1219d.firebasestorage.app",
  messagingSenderId: "350359114979",
  appId: "1:350359114979:web:9e3c0c9f2c6584b0eae1d6",
  measurementId: "G-DK0CZNPC26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
