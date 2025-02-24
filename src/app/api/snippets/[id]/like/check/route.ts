import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { snippetLikes } from "@/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const snippetId = (await params).id
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !snippetId) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    // Check if the like exists
    const existingLike = await db.select()
      .from(snippetLikes)
      .where(
        and(
          eq(snippetLikes.snippet_id, Number(snippetId)),
          eq(snippetLikes.user_id, userId)
        )
      );

    return NextResponse.json({ 
      liked: existingLike.length > 0 
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json(
      { error: "Failed to check like status" },
      { status: 500 }
    );
  }
}
