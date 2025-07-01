import User from "@/models/userModel";

export const updateStreak = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let lastLog = user.lastMoodLoggedDate
    ? new Date(user.lastMoodLoggedDate)
    : null;

  if (lastLog) lastLog.setHours(0, 0, 0, 0);
  const isNewDay = !lastLog || lastLog.getTime() !== today.getTime();

  if (!isNewDay) {
    const diffInDays = lastLog
      ? (today.getTime() - lastLog.getTime()) / (1000 * 60 * 60 * 24)
      : 1;

    user.streak = diffInDays === 1 ? user.streak + 1 : 1;
    user.lastMoodLoggedDate = new Date();
    await user.save();
  }

  return user;
};
