import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; //fixed the webpack error!
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// import { initializeApp } from "firebase/app";

const firebaseConfig = {
  
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app); //for user authentication
export const provider = new GoogleAuthProvider(); //for Google authentication

export default firebase.firestore();
export const db = getFirestore();