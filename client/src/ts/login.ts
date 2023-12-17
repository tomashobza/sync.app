/**
 * @module login
 * @description
 * Provides functions for logging in and out of the app.
 * @author Anastasia Butok (xbutok00)
 */

import {
	signInWithEmailAndPassword,
	signOut,
	createUserWithEmailAndPassword,
	updateProfile
} from 'firebase/auth';
import { auth, db } from '$ts/firebase';
import { last_route, user_token } from '$ts/stores';
import { goto } from '$app/navigation';
import { Timestamp, doc, setDoc } from 'firebase/firestore';

/**
 * Logs in a user with the provided email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<User>} - A promise that resolves with the logged-in user.
 * @throws {Error} - If there is an error during the login process.
 */
export const login = (email: string, password: string) =>
	new Promise((resolve, reject) => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				user_token.set(userCredential.user);
				resolve(userCredential.user);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error(errorCode, errorMessage);
				reject(error);
			});
	});

/**
 * Signs in a user with the provided username, email, and password.
 *
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<User>} A promise that resolves with the signed-in user.
 * @throws {Error} If there is an error during the sign-in process.
 */
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
						user_token.set(userCredential.user);

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

/**
 * Logs out the user.
 * @returns A promise that resolves to true if the logout is successful, or rejects with an error if it fails.
 */
export const logout = () =>
	new Promise((resolve, reject) => {
		signOut(auth)
			.then(() => {
				user_token.set(null);
				last_route.set(null);
				goto('/login');
				resolve(true);
			})
			.catch((error) => {
				console.error(error);
				reject(error);
			});
	});
