import {httpsCallable} from "firebase/functions";
import {functions} from "../../etiFirebase.js";
import {SampleInterface, SampleResponse} from "../../../shared/example";

export async function callTest() {
    const helloWorld = httpsCallable<SampleInterface, SampleResponse>(functions, 'helloWorld');
    const data: SampleInterface = {fieldA: "hola mundo"};
    const result = await helloWorld(data);
    const {txt} = result.data;
    console.log(txt);
}

export async function createUserInDb(user: { email: string } | null) {
    if (!user) {
        return;
    }
    const email = user.email;
    const createUser = httpsCallable(functions, 'authentication-createUserInDB');
    try {
        await createUser({email});
    } catch (e) {
        console.log(e)
    }


}