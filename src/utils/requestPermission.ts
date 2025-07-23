// import { messaging } from "@/lib/firebase";
// import { getToken } from "firebase/messaging";

// export const requestNotificationPermission = async () => {
//   try {
//     const permission = await Notification.requestPermission();

//     if (permission !== "granted") {
//       alert("Please enable notifications to receive task reminders");
//       return;
//     }

//     const registration = await navigator.serviceWorker.register(
//       "/firebase-messaging-sw.js"
//     );

//     const token = await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//       serviceWorkerRegistration: registration,
//     });

//     if (!token) {
//       console.error("Failed to get FCM token.");
//       return;
//     }

//     console.log("FCM Token:", token);

//     const res = await fetch("/api/users/save-fcm-token", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ token }),
//     });

//     if (!res.ok) {
//       console.error("Failed to send FCM token to backend");
//     } else {
//       console.log("Token sent to backend successfully");
//     }
//   } catch (err) {
//     console.error("Error during FCM setup:", err);
//   }
// };
