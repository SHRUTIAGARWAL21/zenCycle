importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCjWe-GnutOlic_AHso33r2mxxPMbv3sIE",
  authDomain: "zencycle-6627f.firebaseapp.com",
  projectId: "zencycle-6627f",
  storageBucket: "zencycle-6627f.firebasestorage.app",
  messagingSenderId: "266193771884",
  appId: "1:266193771884:web:27abdbf34c608f078b6749",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/logo.png", // optional
  });
});
