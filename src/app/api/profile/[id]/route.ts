import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { snippets } from '@/db/schema';


export async function GET(request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const id = (await params).id

  try {

    const snippet = await db.select().from(snippets).where(eq(snippets.user_id, id))

    return NextResponse.json(snippet)
  } catch (error) {
    console.error('Failed to delete snippet:', error);
    return NextResponse.json({ error: 'Failed to delete snippet' }, { status: 500 });
  }
}