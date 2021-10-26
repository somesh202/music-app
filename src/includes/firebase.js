import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA2CXp4GEJOMCDL6eMEEG2vgOfbzPaRi2g',
  authDomain: 'music-app-55c05.firebaseapp.com',
  projectId: 'music-app-55c05',
  storageBucket: 'music-app-55c05.appspot.com',
  appId: '1:739443072965:web:101a9e041600176bef75ac',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const usersCollection = db.collection('users');

export {
  auth,
  db,
  usersCollection,
};