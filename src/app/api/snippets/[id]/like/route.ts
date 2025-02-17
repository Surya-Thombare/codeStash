import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq, and, count } from "drizzle-orm";
import { snippets, snippetLikes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

    const id = (await params).id

  try {

    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const snippetId = parseInt(id);
    if (isNaN(snippetId)) {
      return NextResponse.json(
        { error: "Invalid snippet ID" },
        { status: 400 }
      );
    }

    await db.insert(snippetLikes).values({
      snippet_id: snippetId,
      user_id: session?.user.id,
    });

    const likeCount = await db.select({value : count(snippetLikes.snippet_id) }).from(snippetLikes)

    console.log('likeCount', likeCount)

    await db.update(snippets).set({
      likes_count: Number(likeCount[0].value)
    }).where(eq(snippets.id, snippetId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error liking snippet:", error);
    return NextResponse.json(
      { error: "Failed to like snippet" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

    const id = (await params).id
  try {

    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const snippetId = Number(id);
    if (isNaN(snippetId)) {
      return NextResponse.json(
        { error: "Invalid snippet ID" },
        { status: 400 }
      );
    }

    await db.delete(snippetLikes).where(
      and(
        eq(snippetLikes.snippet_id, snippetId),
        eq(snippetLikes.user_id, session?.user.id)
      ) 
    )

    const likeCount = await db.select({value : count(snippetLikes.snippet_id) }).from(snippetLikes)

    console.log('likeCount', likeCount)

    await db.update(snippets).set({
      likes_count: Number(likeCount[0].value)
    }).where(eq(snippets.id, snippetId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unliking snippet:", error);
    return NextResponse.json(
      { error: "Failed to unlike snippet" },
      { status: 500 }
    );
  }
}