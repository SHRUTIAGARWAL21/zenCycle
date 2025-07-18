import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/taskModel";
import Productivity from "@/models/productivityModel";
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
      expectedTime: task.expectedTime, // in hours
      timeTaken: task.timeTaken || 0, // in hours
      expectedTimeMinutes: task.expectedTime * 60, // convert to minutes for AI
      timeTakenMinutes: (task.timeTaken || 0) * 60, // convert to minutes for AI
    }));

    const prompt = `
You are a productivity assistant AI.

I will give you a list of today's tasks with their titles, expected time, time taken, and progress. 

IMPORTANT: The expectedTime and timeTaken values are in HOURS. The expectedTimeMinutes and timeTakenMinutes are in MINUTES.

You must analyze the user's performance and return a JSON object in the following format:

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
    "totalExpectedTime": "in hours (e.g., '2.5 hours')",
    "actualTime": "in hours (e.g., '3 hours')",
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

    const response = await callGemini(prompt);

    // Parse the JSON string response from Gemini
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, try to clean the response and parse again
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim();
      try {
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (secondParseError) {
        console.error("Failed to parse Gemini response:", response);
        return NextResponse.json({
          error: "Failed to parse AI response",
          status: 500,
        });
      }
    }

    // Calculate total expected and actual time in hours
    const totalExpectedTime = formattedTasks.reduce(
      (sum, task) => sum + task.expectedTime,
      0
    );
    const totalActualTime = formattedTasks.reduce(
      (sum, task) => sum + task.timeTaken,
      0
    );

    // Store productivity data
    try {
      // Check if productivity data for today already exists
      const existingProductivity = await Productivity.findOne({
        userId,
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      });

      const productivityData = {
        userId,
        date: today,
        productivityScore: parsedResponse.timeAnalysis.productivityScore,
        totalExpectedTime,
        totalActualTime,
      };

      if (existingProductivity) {
        // Update existing record
        await Productivity.findByIdAndUpdate(
          existingProductivity._id,
          productivityData
        );
      } else {
        // Create new record
        await Productivity.create(productivityData);
      }
    } catch (productivityError) {
      console.error("Error storing productivity data:", productivityError);
      // Continue without failing the entire request
    }

    return NextResponse.json({
      summary: parsedResponse,
      status: 200,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
      status: 500,
    });
  }
}
