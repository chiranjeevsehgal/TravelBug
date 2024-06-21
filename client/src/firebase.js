// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//temporary souls firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "travel-9d056.firebaseapp.com",
  projectId: "travel-9d056",
  storageBucket: "travel-9d056.appspot.com",
  messagingSenderId: "334784263545",
  appId: "1:334784263545:web:3a535462d03b4c4513aba8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
