import { sendNotification } from "@/utils/sendNotification";
import Task from "@/models/taskModel";
import User from "@/models/userModel";

export async function checkTasksAndSendNotifications() {
  const now = new Date();

  const tasks = await Task.find({ progress: { $lt: 100 } }); // ✅ task not fully complete

  for (const task of tasks) {
    const deadline = new Date(task.deadline);
    const expected = task.expectedTime; // in minutes
    const created = new Date(task.createdAt);
    const timeRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60); // mins left
    const timeSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60); // mins passed

    const user = await User.findById(task.userId);
    if (!user?.fcmToken) continue;

    // 1. Not enough time left vs expected time
    if (expected > timeRemaining && timeRemaining > 0) {
      await sendNotification(
        user.fcmToken,
        `⏳ Less time than expected for "${task.title}". Please hurry up!`
      );
    }

    // 2. 5–10 mins before deadline
    if (timeRemaining <= 10 && timeRemaining >= 5) {
      await sendNotification(
        user.fcmToken,
        `⏰ Only ${Math.floor(timeRemaining)} mins left for "${task.title}"`
      );
    }

    // 3. High priority and overdue for a long time (e.g. 3 hours = 180 mins)
    if (task.priority === "high" && timeSinceCreated >= 180) {
      await sendNotification(
        user.fcmToken,
        `🔥 High-priority task "${task.title}" still pending after 3+ hrs`
      );
    }
  }
}
