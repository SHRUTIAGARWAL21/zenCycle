import User from "@/models/userModel";
import { NextResponse } from "next/server";

export const updateStreak = async (
  userId: string,
  moodLog: boolean = false
) => {
  const user = await User.findById(userId);
  if (!user) return;

  if (moodLog) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    user.totalMoodActiveDays = user.totalMoodActiveDays + 1;

    let lastLog = user.lastMoodLoggedDate
      ? new Date(user.lastMoodLoggedDate)
      : null;

    if (lastLog) lastLog.setHours(0, 0, 0, 0);

    const isNewDay = !lastLog || lastLog.getTime() !== today.getTime();

    if (isNewDay) {
      const diffInDays = lastLog
        ? (today.getTime() - lastLog.getTime()) / (1000 * 60 * 60 * 24)
        : 1;

      user.Moodstreak = diffInDays === 1 ? user.Moodstreak + 1 : 1;

      user.lastMoodLoggedDate = new Date();

      await user.save();
    }
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.lastMoodLoggedDate) {
      let lastLog = new Date(user.lastMoodLoggedDate);
      lastLog.setHours(0, 0, 0, 0);

      const diffInDays =
        (today.getTime() - lastLog.getTime()) / (1000 * 60 * 60 * 24);

      if (diffInDays > 1) {
        user.Moodstreak = 0;
        await user.save();
      }
    }
  }

  return user;
};
