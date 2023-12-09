// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-b92e3.firebaseapp.com",
  projectId: "mern-estate-b92e3",
  storageBucket: "mern-estate-b92e3.appspot.com",
  messagingSenderId: "413362702795",
  appId: "1:413362702795:web:6c0a750f969935cbd48e4e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);