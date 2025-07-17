import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/taskModel";
import { getDataFromToken } from "@/helpers/getUser";
import { callGemini } from "@/helpers/gemini";

connect();

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const tasks = await Task.find({
      userId,
      deadline: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ createdAt: -1 });

    // Group tasks by date (YYYY-MM-DD)
    const taskMap: Record<string, any[]> = {};
    tasks.forEach((task: any) => {
      const dateKey = formatDate(new Date(task.deadline));
      if (!taskMap[dateKey]) taskMap[dateKey] = [];
      taskMap[dateKey].push({
        title: task.title,
        progress: task.progress,
        expectedTime: task.expectedTime,
        timeTaken: task.timeTaken || 0,
        delayReason: task.delayReason || "",
      });
    });

    const results: Record<string, any> = {};

    // Iterate all days of the current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const key = formatDate(date);
      const tasksForDay = taskMap[key] || [];

      if (tasksForDay.length === 0) {
        results[key] = { message: "No tasks added" };
      } else {
        const prompt = `
You are a productivity coach. Based on the tasks below for ${key}, return ONLY the productivity score (0–100) based on progress, delays, expected time vs actual time, and reasons.

Return a detailed JSON object with:
DO NOT ENCLOSE IT IN BACKTICKS. IT SHOULD DIRECTLY START WITH THE JSON OBJECT.
{ "productivityScore": 76 }

Here is the data:
${JSON.stringify(tasksForDay, null, 2)}
        `;

        const response = await callGemini(prompt);
        try {
          results[key] = JSON.parse(response);
        } catch (err) {
          console.log(err.message);
          results[key] = { error: "AI response malformed" };
        }
      }
    }

    return NextResponse.json({ dailyProductivity: results, status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, status: 500 });
  }
}
