import * as React from "react";
import {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import {Navigate} from "react-router-dom"

const WithAuthentication = (props) => {
    const auth = getAuth()
    const [isSignedIn, setIsSignedIn] = useState(!!auth.currentUser); // Local signed-in state.
    const [ran, setRan] = useState(false);
    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(user => {
            setIsSignedIn(!!user);
            setRan(true);
        });
        return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
    }, [])

    return (
        <>
            {ran && !isSignedIn && <Navigate to='/sign-in'  replace state={{redirectUrl: props.redirectUrl}}/>}
        </>
    )
}
export default WithAuthentication;