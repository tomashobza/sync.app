/**
 * @module firebase
 * @description
 * Provides functions for initializing Firebase and accessing its services.
 * @author Tomáš Hobza (xhobza03)
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCpCf1o-eCBPFb5trtc2gVbOaRAbsXftYo',
	authDomain: 'itu-projekt-23307.firebaseapp.com',
	projectId: 'itu-projekt-23307',
	storageBucket: 'itu-projekt-23307.appspot.com',
	messagingSenderId: '46008500572',
	appId: '1:46008500572:web:764247aaae0439b23c8199',
	measurementId: 'G-1BTPXSZNF0'
};

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth();
export const db = getFirestore(app);
