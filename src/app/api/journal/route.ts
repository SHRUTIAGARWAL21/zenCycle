import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getUser";
import { connect } from "@/dbconfig/dbconfig";
import Journal from "@/models/journalModel";

connect();

export async function POST(req: NextRequest) {
  try {
    const userId = await getDataFromToken(req);
    const { content, imageUrls } = await req.json();

    const lastEntry = await Journal.findOne({ userId }).sort({
      pageNumber: -1,
    });
    const nextPageNumber = lastEntry ? lastEntry.pageNumber + 1 : 1;

    const journal = await Journal.create({
      userId,
      content,
      pageNumber: nextPageNumber,
    });

    return NextResponse.json(journal);
  } catch (error: any) {
    return NextResponse.json({ error: error.messgae }, { status: 500 });
  }
}
