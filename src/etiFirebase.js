import {config} from "dotenv";
import {initializeApp} from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import {connectAuthEmulator, getAuth} from "firebase/auth";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import {connectFunctionsEmulator, getFunctions} from "firebase/functions";

config()
export const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

// Configure Firebase.
const app = initializeApp(firebaseConfig)

export const auth = getAuth();
export const db = getFirestore(app);
export const functions = getFunctions(app);

if (process.env.NODE_ENV === 'development') {
    console.log("connecting to emulators")
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
}

// // Configure FirebaseUI.
export const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    // signInSuccessUrl: "/inscripcion",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
        firebaseAuth.FacebookAuthProvider.PROVIDER_ID,
    ]
};