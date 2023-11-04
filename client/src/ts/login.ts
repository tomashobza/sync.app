import {
	signInWithEmailAndPassword,
	signOut,
	createUserWithEmailAndPassword,
	updateProfile
} from 'firebase/auth';
import { auth, db } from '$ts/firebase';
import { user_token } from '$ts/stores';
import { goto } from '$app/navigation';
import { Timestamp, doc, setDoc } from 'firebase/firestore';

export const login = (email: string, password: string) =>
	new Promise((resolve, reject) => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				user_token.set(userCredential.user);
				goto('/');
				resolve(userCredential.user);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error(errorCode, errorMessage);
				reject(error);
			});
	});

export const signin = (username: string, email: string, password: string) =>
	new Promise((resolve, reject) => {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Instead of updating the profile, write to Firestore
				const userDocRef = doc(db, 'users', userCredential.user.uid);
				setDoc(userDocRef, {
					displayName: username,
					email: email,
					uid: userCredential.user.uid,
					photoURL: userCredential.user.photoURL,
					createdAt: Timestamp.now()
				})
					.then(() => {
						user_token.set(userCredential.user); // Assuming user_token is a store or global variable
						goto('/'); // Assuming goto is a function to navigate to a route
						resolve(userCredential.user);
					})
					.catch((error) => {
						const errorCode = error.code;
						const errorMessage = error.message;
						console.error(errorCode, errorMessage);
						reject(error);
					});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error(errorCode, errorMessage);
				reject(error);
			});
	});

export const logout = () =>
	new Promise((resolve, reject) => {
		signOut(auth)
			.then(() => {
				user_token.set(null);
				goto('/login');
				resolve(true);
			})
			.catch((error) => {
				console.error(error);
				reject(error);
			});
	});
