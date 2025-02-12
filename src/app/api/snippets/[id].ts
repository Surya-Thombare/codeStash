import { NextResponse } from 'next/server';
import { db } from '@/db';
import { snippets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedSnippet = await db
      .update(snippets)
      .set(body)
      .where(eq(snippets.id, params.id))
      .returning();
    return NextResponse.json(updatedSnippet[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update snippet' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(snippets).where(eq(snippets.id, params.id));
    return NextResponse.json({ message: 'Snippet deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 500 });
  }
}