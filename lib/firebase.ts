// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZQWcq8pbt_4TUmNUO9ifbVD_Yuen68vc",
  authDomain: "jeff-c174f.firebaseapp.com",
  projectId: "jeff-c174f",
  storageBucket: "jeff-c174f.appspot.com",
  messagingSenderId: "1031595977146",
  appId: "1:1031595977146:web:0781b41be8de1d8391d583",
  measurementId: "G-E3RYRV5LVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);