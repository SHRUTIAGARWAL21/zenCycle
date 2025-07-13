import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import Task from "@/models/taskModel";
import { getDataFromToken } from "@/helpers/getUser";
connect();

export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    const { title, description, timeExpected, status, priority } =
      await request.json();

    const newTask = new Task({
      userId,
      title,
      description,
      timeExpected,
      status,
      priority,
    });

    await newTask.save();
    return NextResponse.json({
      message: "task added successfully!",
      task: newTask,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, status: 500 });
  }
}
