// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8qV0zTb7wEAh5jm3_L7gMsXuGdEqJLaM",
  authDomain: "pizza-app-3bba6.firebaseapp.com",
  projectId: "pizza-app-3bba6",
  storageBucket: "pizza-app-3bba6.firebasestorage.app",
  messagingSenderId: "520939213100",
  appId: "1:520939213100:web:ff14f7d97e00560fdd5c89",
  measurementId: "G-NEBGS71EWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;