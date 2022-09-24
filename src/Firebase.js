import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import secrets from "./secrets";

let app = initializeApp(secrets);

export let db = getFirestore(app);