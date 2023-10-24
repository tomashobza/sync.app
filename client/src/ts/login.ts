import {
	signInWithEmailAndPassword,
	signOut,
	createUserWithEmailAndPassword,
	updateProfile
} from 'firebase/auth';
import { auth } from '$ts/firebase';
import { user_token } from '$ts/stores';
import { goto } from '$app/navigation';

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
				updateProfile(userCredential.user, {
					displayName: username
				}).then(
					function () {
						user_token.set(userCredential.user);
						goto('/');
						resolve(userCredential.user);
					},
					function (error) {
						const errorCode = error.code;
						const errorMessage = error.message;
						console.error(errorCode, errorMessage);
						reject(error);
					}
				);
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
