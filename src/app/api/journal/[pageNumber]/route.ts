import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getUser";
import { connect } from "@/dbconfig/dbconfig";
import Journal from "@/models/journalModel";

connect();

export async function GET(
  request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  try {
    const userId = await getDataFromToken(request);
    const page = parseInt(params.pageNumber);

    const journal = await Journal.findOne({ userId, pageNumber: page });

    if (!journal) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });
    }

    return NextResponse.json(journal);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  try {
    const userId = await getDataFromToken(request);
    const page = parseInt(params.pageNumber);
    const { content, imageUrls } = await request.json();

    const updated = await Journal.findOneAndUpdate(
      { userId, pageNumber: page },
      { content, imageUrls },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageNumber: string } }
) {
  try {
    const userId = await getDataFromToken(request);
    const page = parseInt(params.pageNumber);

    const deleted = await Journal.findOneAndDelete({
      userId,
      pageNumber: page,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Journal not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
