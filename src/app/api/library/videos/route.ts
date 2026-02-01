import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const videos = await db.video.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        url: true,
        category: true,
        isHighYield: true,
        createdAt: true,
      },
    });

    return NextResponse.json(videos, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error fetching videos for library:", error);
    return NextResponse.json([], { 
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
