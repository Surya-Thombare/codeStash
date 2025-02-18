import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { snippets, snippetComments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { insertCommentSchema, SnippetComment } from "@/db/schema/snippets";

// Get comments for a snippet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const snippetId = Number(id);

    if (isNaN(snippetId)) {
      return NextResponse.json(
        { error: "Invalid snippet ID" },
        { status: 400 }
      );
    }

    // Get all comments for the snippet with user information
    const comments = await db.select().from(snippetComments).orderBy(desc(snippetComments.createdAt)).where(eq(snippetComments.snippet_id, snippetId))
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = (await params).id;
    const snippetId = Number(id);

    if (isNaN(snippetId)) {
      return NextResponse.json(
        { error: "Invalid snippet ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    console.log('validatedData One', body);
    
    const validatedData = insertCommentSchema.parse(body) as SnippetComment;

    console.log('validatedData Two');

    console.log('validatedData', validatedData);

    await db.insert(snippetComments).values(validatedData)
      
    await db.update(snippets).set({ comments_count: sql`${snippets.comments_count} + 1` }).where(eq(snippets.id, snippetId))
    // Get the updated comments
    const comments = await db.select().from(snippetComments).orderBy(desc(snippetComments.createdAt)).where(eq(snippetComments.snippet_id, snippetId))


    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = (await params).id;
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Check if the comment exists and belongs to the user
    const comment = await db.select().from(snippetComments)
    .orderBy(desc(snippetComments.createdAt))
    .where(and(eq(snippetComments.id, parseInt(commentId)), eq(snippetComments.snippet_id, Number(id))))

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.delete(snippetComments).where(eq(snippetComments.id, parseInt(commentId)))

    await db.update(snippets).set({ comments_count: sql`${snippets.comments_count} - 1` }).where(eq(snippets.id, Number(id)))

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}