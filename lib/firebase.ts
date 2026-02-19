// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAE4IwNPU33dniaBSnHA7hjw33ByoQ-14",
  authDomain: "comatching-59f3e.firebaseapp.com",
  projectId: "comatching-59f3e",
  storageBucket: "comatching-59f3e.firebasestorage.app",
  messagingSenderId: "106298040488",
  appId: "1:106298040488:web:e4e7b9c54d55dcaab4229d",
  measurementId: "G-188J563VND",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
