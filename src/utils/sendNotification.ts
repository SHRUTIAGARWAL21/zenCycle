import { admin } from "../lib/firebaseAdmin";

export async function sendNotification(token: string, message: string) {
  try {
    await admin.messaging().send({
      token,
      notification: {
        title: "Zencycle Reminder",
        body: message,
      },
    });
    console.log("✅ Notification sent");
  } catch (err) {
    console.error("❌ Error sending notification:", err);
  }
}
