import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { environment } from '../environments/environment';

const firebaseInstance = firebase;

if (firebaseInstance.apps.length === 0) {
    firebaseInstance.initializeApp(environment.firebase);
}

export default firebaseInstance;
