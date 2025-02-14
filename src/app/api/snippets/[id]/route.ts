import { NextResponse } from 'next/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { snippets } from '@/db/schema';

export async function GET(request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {

    const snippet = await db.select().from(snippets).where(eq(snippets.id, parseInt(id)))

    return NextResponse.json(snippet)
  } catch (error) {
    console.error('Failed to delete snippet:', error);
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {

  const { id } = await params

  try {
    const body = await request.json();
    const updatedSnippet = await db
      .update(snippets)
      .set(body)
      .where(eq(snippets.id, parseInt(id)))
      .returning();
    return NextResponse.json(updatedSnippet[0]);
  } catch (error) {
    console.error('Failed to update snippet:', error);
    return NextResponse.json({ error: 'Failed to update snippet' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {

  const { id } = await params

  try {
    await db.delete(snippets).where(eq(snippets.id, parseInt(id)));
    return NextResponse.json({ success: 'snippet deleted successfully' })
  } catch (error) {
    console.error('Failed to delete snippet:', error);
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 500 });
  }
}