import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import Productivity from "@/models/productivityModel";
import { getDataFromToken } from "@/helpers/getUser";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    // Get current month
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const productivityData = await Productivity.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Simple format - just the essential data
    const monthlyData = productivityData.map((item) => ({
      date: item.date.toISOString().split("T")[0], // YYYY-MM-DD
      day: item.date.getDate(),
      score: item.productivityScore,
      expectedTime: item.totalExpectedTime,
      actualTime: item.totalActualTime,
    }));

    return NextResponse.json({
      data: monthlyData,
      month: now.getMonth() + 1, // 1-12
      year: now.getFullYear(),
      status: 200,
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
      status: 500,
    });
  }
}
