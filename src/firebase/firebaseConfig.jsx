// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOb2YOrkbnLq_dgYYg5gvcsppU5hvpPgs",
  authDomain: "travsplit.firebaseapp.com",
  projectId: "travsplit",
  storageBucket: "travsplit.appspot.com",
  messagingSenderId: "1094379024513",
  appId: "1:1094379024513:web:bb3d32c7ade85bd91c1d80",
  measurementId: "G-S1Z2GBN1QB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);