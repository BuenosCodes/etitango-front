import {httpsCallable} from "firebase/functions";
import {functions} from "../../etiFirebase.js";

export async function callTest() {
    const helloWorld = httpsCallable(functions, 'helloWorld');
    const result = await helloWorld({text: "hola mundo"})
    const {txt} = result.data;
    console.log(txt);
}