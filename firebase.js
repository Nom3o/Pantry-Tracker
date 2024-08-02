// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAE-XyxjTbug5iazXIOH9131zEvqYNGbes",
  authDomain: "pntry-tracker.firebaseapp.com",
  projectId: "pntry-tracker",
  storageBucket: "pntry-tracker.appspot.com",
  messagingSenderId: "693789383668",
  appId: "1:693789383668:web:e7156db7a7b229dab1b7a1",
  measurementId: "G-Y6TDR5J7RR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}
