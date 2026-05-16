import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBx-O0SWkeptc_h1WbKfcvyFYK7c6SHBqA",
  authDomain: "agora-captain.firebaseapp.com",
  databaseURL: "https://agora-captain-default-rtdb.firebaseio.com",
  projectId: "agora-captain",
  storageBucket: "agora-captain.firebasestorage.app",
  messagingSenderId: "991089692145",
  appId: "1:991089692145:web:899b4a0344725ece2a8850"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
