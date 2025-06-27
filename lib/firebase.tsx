// Importa las funciones necesarias de Firebase
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

// Tu configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyARsQqSxbmrQ_aEXrzZyf1je370vMAHeGI",
  authDomain: "proyectoweb-7c1c8.firebaseapp.com",
  projectId: "proyectoweb-7c1c8",
  storageBucket: "proyectoweb-7c1c8.firebasestorage.app",
  messagingSenderId: "1034429937754",
  appId: "1:1034429937754:web:37686171612ec0b8a00063",
  measurementId: "G-2X025KPRQY"
};

// Inicializa Firebase sólo si no está inicializado (evitar errores en hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializa Analytics (opcional)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Inicializa Firestore
const db = getFirestore(app);

const auth = getAuth(app);
export { db, app, analytics, auth, signInWithEmailAndPassword };
