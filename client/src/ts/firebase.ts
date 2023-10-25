import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, createUserWithEmailAndPassword, type Auth } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyCpCf1o-eCBPFb5trtc2gVbOaRAbsXftYo',
	authDomain: 'itu-projekt-23307.firebaseapp.com',
	projectId: 'itu-projekt-23307',
	storageBucket: 'itu-projekt-23307.appspot.com',
	messagingSenderId: '46008500572',
	appId: '1:46008500572:web:764247aaae0439b23c8199',
	measurementId: 'G-1BTPXSZNF0'
};

export let app: FirebaseApp;
export let auth: Auth;

// if (Capacitor.getPlatform() === 'web') {
// For web, use the Firebase JS SDK
app = initializeApp(firebaseConfig);
auth = getAuth();

// Initialize other Firebase services for the web as needed.
// } else {
// 	// For Capacitor (iOS, Android), you would typically use a dedicated Capacitor plugin.
// 	// Initialize Firebase using the Capacitor Firebase plugin here.
// 	// NOTE: The exact method calls might differ based on the plugin's documentation.
// 	// Make sure to follow the documentation of the Capacitor Firebase plugin you're using.
// }
