import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCWIEmexFXPXjxcdDT8RsPgpnCIqYxwnhE",
  authDomain: "billsnap-1313f.firebaseapp.com",
  projectId: "billsnap-1313f",
  storageBucket: "billsnap-1313f.firebasestorage.app",
  messagingSenderId: "407545439206",
  appId: "1:407545439206:web:48b82d1d81e6b6eab16c27",
  measurementId: "G-6B4SPJLVEQ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;