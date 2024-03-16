import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  getFirestore,
  initializeFirestore,
  persistentLocalCache
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAdrQB9DLftmMIoS0NraJURi78PenfHA0o',
  authDomain: 'music-76f68.firebaseapp.com',
  projectId: 'music-76f68',
  storageBucket: 'music-76f68.appspot.com',
  messagingSenderId: '1017226300207',
  appId: '1:1017226300207:web:b55973ffb0e5fd7874afda'
};

// init firestore service
const init = initializeApp(firebaseConfig);
initializeFirestore(init, { localCache: persistentLocalCache(/*settings*/ {}) });
const db = getFirestore(init);
const storage = getStorage();
const auth = getAuth();

const usersCollection = doc(collection(db, 'users'));
const userRef = (id) => doc(db, 'users', id);

const songsCollection = collection(db, 'songs');
const songRef = (id) => doc(db, 'songs', id);

const commentsCollection = collection(db, 'comments');

export {
  auth,
  commentsCollection,
  db,
  songRef,
  songsCollection,
  storage,
  userRef,
  usersCollection
};
