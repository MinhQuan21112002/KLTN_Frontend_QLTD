// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getStorage,ref ,uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMtJWu8Ky9MHbEcV73QG0nx6UJ-p-1Z-U",
  authDomain: "quanlytuyendung-4fb2c.firebaseapp.com",
  projectId: "quanlytuyendung-4fb2c",
  storageBucket: "quanlytuyendung-4fb2c.appspot.com",
  messagingSenderId: "956601904059",
  appId: "1:956601904059:web:5b71e170f32f43ac1e729e",
  measurementId: "G-N6HJ38EZ2V"
};

const firebaseConfig2 = {
  apiKey: "AIzaSyDOrICKoV780ZW1zJi1zAaHmkrU2v1C0jQ",
  authDomain: "chatbox-993d2.firebaseapp.com",
  projectId: "chatbox-993d2",
  storageBucket: "chatbox-993d2.appspot.com",
  messagingSenderId: "676443581383",
  appId: "1:676443581383:web:835b743f46f7225fce07e2",
  measurementId: "G-NBXP6M67LJ"
};

// Initialize Firebase
const app1 = initializeApp(firebaseConfig);
const storage = getStorage(app1);

const app2 = initializeApp(firebaseConfig2, "SecondaryApp");
export const db = getFirestore(app2);
export const auth = getAuth(app2);
export const provider = new GoogleAuthProvider();
export {storage};