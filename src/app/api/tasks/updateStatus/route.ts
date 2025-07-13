import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/taskModel";
import { getDataFromToken } from "@/helpers/getUser";

connect();

export async function PUT(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const { taskId, totalTimeTaken } = await request.json();

    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      return NextResponse.json({ error: "Task not found", status: 404 });
    }

    task.status = true;
    task.timeTaken = totalTimeTaken;

    const delay = totalTimeTaken - task.timeExpected;

    await task.save();

    return NextResponse.json({
      message: "Task updated successfully",
      taskId,
      delay,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 400,
    });
  }
}
