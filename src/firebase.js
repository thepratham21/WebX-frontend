import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webx-c62e5.firebaseapp.com",
  projectId: "webx-c62e5",
  storageBucket: "webx-c62e5.firebasestorage.app",
  messagingSenderId: "738963390038",
  appId: "1:738963390038:web:96879102ec0f76b904c5f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };