import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/taskModel";
import { getDataFromToken } from "@/helpers/getUser";
import { callGemini } from "@/helpers/gemini";

connect();
export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      userId,
      deadline: { $gte: today, $lt: tomorrow },
    }).sort({ createdAt: -1 });

    const formattedTasks = tasks.map((task: any) => ({
      title: task.title,
      progress: task.progress,
      expectedTime: task.expectedTime,
      timeTaken: task.timeTaken || 0,
    }));

    const prompt = `
You are a productivity assistant AI.

I will give you a list of today's tasks with their titles, expected time, time taken, and progress. You must analyze the user's performance and return a JSON object in the following format:

DO NOT RETURN MARKDOWN OR BACKTICKS — just the raw JSON object as output.

Expected format:
{
  "summary": "Concise feedback (1–2 lines)",
  "tasksCompleted": [
    {
      "title": "Title of task done",
      "productivity": "Score from 0-100, based on time expected, time taken, priority etc"
    }
  ],
  "pendingTasks": [
    {
      "title": "Title of pending/incomplete task",
      "progress": "percent done"
    }
  ],
  "timeAnalysis": {
    "totalExpectedTime": "in minutes or hours",
    "actualTime": "in minutes or hours",
    "productivityScore": "Score from 0-100 based on how efficiently time was used"
  },
  "productivityGaps": [
    "Mention possible reasons for low productivity (e.g., distractions, poor time estimates, task switching, lack of breaks)"
  ],
  "suggestions": [
    "Give practical advice to improve productivity next time (e.g., focus sessions, break scheduling, realistic time estimates)"
  ]
}

Here is the task data for today:
${JSON.stringify(formattedTasks, null, 2)}

Return ONLY the raw JSON object in response, nothing else.
`;

    const response = await callGemini(prompt + tasks);
    return NextResponse.json({ summary: response, status: 200 });
  } catch (err: any) {
    return NextResponse.json({ err: err.message, status: 500 });
  }
}
