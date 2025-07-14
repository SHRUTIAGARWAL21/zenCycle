import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCjWe-GnutOlic_AHso33r2mxxPMbv3sIE",
  authDomain: "zencycle-6627f.firebaseapp.com",
  projectId: "zencycle-6627f",
  storageBucket: "zencycle-6627f.firebasestorage.app",
  messagingSenderId: "266193771884",
  appId: "1:266193771884:web:27abdbf34c608f078b6749",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };
