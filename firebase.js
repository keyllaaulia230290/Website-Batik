import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

/* FIREBASE CONFIG */

const firebaseConfig = {
  apiKey: "AIzaSyAXMEPLUJIV7_A57DN4II-p64Re4Xhwr4k",

  authDomain: "ajra-batik.firebaseapp.com",

  projectId: "ajra-batik",

  storageBucket: "ajra-batik.firebasestorage.app",

  messagingSenderId: "79687500462",

  appId: "1:79687500462:web:12d1c7bb6011ee0ec9633f",
};

/* INIT */

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

/* EXPORT */

export { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc };
