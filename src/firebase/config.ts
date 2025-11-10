// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Removed as it was unused
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsZfsf9FxkL9-7dX_2b_J2Q3FUp8JtGJo",
  authDomain: "desarrollo-colombia-5407b.firebaseapp.com",
  projectId: "desarrollo-colombia-5407b",
  storageBucket: "desarrollo-colombia-5407b.firebasestorage.app",
  messagingSenderId: "118449023037",
  appId: "1:118449023037:web:00444a4386fd3a2c54e254",
  measurementId: "G-36GM1TGGTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Removed as it was unused

// Export Firebase services (Added)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);