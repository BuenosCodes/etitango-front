import React, {useEffect, useState} from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import {auth, uiConfig} from "../../etiFirebase";
import {Navigate} from "react-router-dom"
import {sendVerificationEmail} from "../../helpers/firebaseAuthentication.js";

function SignInScreen() {
    const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
    const [isVerified, setIsVerified] = useState(false); // Local signed-in state.

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(user => {
            setIsSignedIn(!!user);
            setIsVerified(user?.emailVerified)
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, []);

    if (!isSignedIn) {
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>Inicia sesión para continuar</p>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
            </div>
        );
    }
    if (!isVerified) {
        return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <p>Valida tu email para continuar. (Clickeando en el link que reibiste a tu correo)</p>
            <p>No lo recibiste? <button onClick={sendVerificationEmail}>Reenviar</button></p>
            <p>Si seguis sin verlo, revisá la carpeta de SPAM (Correo no deseado) </p>
        </div>
    }
    return (
        <Navigate to='/inscripcion'/>
    );
}

export default SignInScreen