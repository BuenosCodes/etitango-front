import {createDoc, getCollection} from "./index";

const SIGNUPS = 'events/F2nfi0LED1QwMW0PEojg/signups';

export const getSignups = async () => getCollection(SIGNUPS);
export const getSignup = async (signupId) => getCollection(SIGNUPS, signupId);
export const createSignup = async (data) => createDoc(SIGNUPS, data);

