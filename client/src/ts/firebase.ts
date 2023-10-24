// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, createUserWithEmailAndPassword, type Auth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCpCf1o-eCBPFb5trtc2gVbOaRAbsXftYo',
	authDomain: 'itu-projekt-23307.firebaseapp.com',
	projectId: 'itu-projekt-23307',
	storageBucket: 'itu-projekt-23307.appspot.com',
	messagingSenderId: '46008500572',
	appId: '1:46008500572:web:764247aaae0439b23c8199',
	measurementId: 'G-1BTPXSZNF0'
};

// Initialize Firebase
export let app: FirebaseApp;
export let auth: Auth;

// export const init = () => {
app = initializeApp(firebaseConfig);
auth = getAuth();
// };
