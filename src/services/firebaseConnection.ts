import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAcezCC5NxaxcxI_RTMpV22Xxse6_tPSEg",
  authDomain: "drive-32767.firebaseapp.com",
  projectId: "drive-32767",
  storageBucket: "drive-32767.appspot.com",
  messagingSenderId: "794458175139",
  appId: "1:794458175139:web:54cc07dd926be8cc15f116",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
