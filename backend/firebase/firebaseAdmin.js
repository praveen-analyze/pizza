const admin = require('firebase-admin');

// Safely replace the literal text '\n' with real cryptographic linebreaks
const formattedPrivateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').trim()
  : undefined;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: formattedPrivateKey, // <-- Use the newly formatted key variable here
  }),
});