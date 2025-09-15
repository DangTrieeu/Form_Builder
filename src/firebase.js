// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCTXvGfl6uSCuj9eg7wVoUrQMh46Ta4ZDs",
    authDomain: "formbuilder-e62b4.firebaseapp.com",
    projectId: "formbuilder-e62b4",
    storageBucket: "formbuilder-e62b4.firebasestorage.app",
    messagingSenderId: "821797959281",
    appId: "1:821797959281:web:ff89f74086e8228d194dd0",
    measurementId: "G-30CTEW5ZXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
