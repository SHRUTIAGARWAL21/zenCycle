import { NextResponse } from "next/server";

// This will run only once when this API route is hit
import "@/app/cron/taskNotification";

export async function GET() {
  return NextResponse.json({ status: "🟢 Task cron is active" });
}
