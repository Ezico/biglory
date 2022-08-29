import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDe_2PUUgihcg4b-SroE27NH1iEKsiOQw8",
  authDomain: "biglory-e1386.firebaseapp.com",
  projectId: "biglory-e1386",
  storageBucket: "biglory-e1386.appspot.com",
  messagingSenderId: "458112209233",
  appId: "1:458112209233:web:b48d35bd61a92906a98370",
  measurementId: "G-71DGWB6XSV",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
// export const storage = getStorage(app);
