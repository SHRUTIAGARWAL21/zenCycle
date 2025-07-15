import cron from "node-cron";
import { checkTasksAndSendNotifications } from "./checkTasksLogic";

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("🔔 Running task notification check...");
  await checkTasksAndSendNotifications();
});
