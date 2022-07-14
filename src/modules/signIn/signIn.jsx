import React, {useEffect, useState} from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import {auth, uiConfig} from "../../etiFirebase";
import {Navigate} from "react-router-dom"
import {Button, TextField} from "@mui/material";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {sendVerificaionEmail} from "../../helpers/firebaseAuthentication";

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
    const [state, setState] = useState({email: '', errors: {}});
    const errors = {email: 'Ingrese un email válido'}
    const onChange = (fieldName) => (e) => {
        setState(s => ({...s, [fieldName]: e.target.value}))
    }


    async function getUserCredential() {
        await createUserWithEmailAndPassword(getAuth(), state.email, state.password);
        await sendVerificaionEmail();
    }

    if (!isSignedIn) {
        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>Inicia sesión para continuar</p>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
                <TextField
                    label="Email"
                    type="email"
                    value={state.email}
                    name="email"
                    required
                    error={Boolean(state.errors.email)}
                    helperText={errors.email || ''}
                    onChange={onChange('email')}
                />
                <TextField
                    label="Contraseña"
                    type="password"
                    value={state.password}
                    name="password"
                    required
                    error={Boolean(state.errors.password)}
                    helperText={errors.password || ''}
                    onChange={onChange('password')}
                />
                <Button onClick={() => getUserCredential()}>Enviar</Button>
            </div>
        );
    }
    if (!isVerified) {
        return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}> <p>Valida tu email para continuar. (Clickeando en el link que reibiste a tu correo)</p>
            <p>No lo recibiste? <button onClick={sendVerificaionEmail}>Reenviar</button></p>
            <p>Si seguis sin verlo, revisá la carpeta de SPAM (Correo no deseado) </p>
            </div>
    }
    return (
        <Navigate to='/inscripcion'/>
    );
}

export default SignInScreen