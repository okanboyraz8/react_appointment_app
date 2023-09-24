// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Import the functions we need database from firebase/firestore by using "getFirestore"
import { getFirestore } from "firebase/firestore"

// Import the functions we need authentication from firebase/auth by using "getAuth"
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9xK1VN_wciBm-vCHET2oTj4LaGMdyThk",
    authDomain: "rrt-appointment-6c729.firebaseapp.com",
    projectId: "rrt-appointment-6c729",
    storageBucket: "rrt-appointment-6c729.appspot.com",
    messagingSenderId: "565094165966",
    appId: "1:565094165966:web:8e21ff2b46d46046730f9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Database as "db"
const db = getFirestore(app);

// Initialize Authentication as "auth"
const auth = getAuth(app);

export { db, auth }