import {createDoc, getCollection, getDocument} from "./index";

const SIGNUPS = (eventId) => `events/${eventId}/signups`;
const SIGNUP = (etiEventId, signupId) => `${SIGNUPS(etiEventId)}/${signupId}`;

export const getSignups = async (etiEventId) => getCollection(SIGNUPS(etiEventId));

export const getSignup = async (etiEventId, signupId) => getDocument(SIGNUP(etiEventId, signupId));
export const createSignup = async (etiEventId, data) => createDoc(SIGNUPS(etiEventId), data);

