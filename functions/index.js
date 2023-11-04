/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();

// exports.createUserDocument = functions.auth.user().onCreate((user) => {
//   const db = admin.firestore();

//   // Define the data for the new user document
//   const userData = {
//     uid: user.uid,
//     email: user.email,
//     displayName: user.displayName,
//     photoURL: user.photoURL,
//     createdAt: admin.firestore.FieldValue.serverTimestamp(),
//   };

//   // Add the new user document to the /users collection
//   return db.collection("users").doc(user.uid).set(userData);
// });

// exports.updateUserDocument = functions.https.onCall((data, context) => {
//   // Ensure the user is authenticated
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       "unauthenticated",
//       "The function must be called by an authenticated user."
//     );
//   }

//   const db = admin.firestore();
//   const uid = context.auth.uid;

//   // Update the user document in the /users collection
//   return db.collection("users").doc(uid).update(data);
// });
