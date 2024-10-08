// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoV3KrlRu47z0KDmOmT5fPmQIONsQm6iE",
  authDomain: "spoileralert-bfa07.firebaseapp.com",
  projectId: "spoileralert-bfa07",
  storageBucket: "spoileralert-bfa07.appspot.com",
  messagingSenderId: "725327401623",
  appId: "1:725327401623:web:f40c1f1ef928128c990fd2",
  measurementId: "G-72PM20M51G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);