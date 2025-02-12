import { NextResponse } from 'next/server';
import { db } from '@/db';
import { snippets } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allSnippets = await db.select().from(snippets).orderBy(desc(snippets.createdAt));
    return NextResponse.json(allSnippets);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Failed to create snippet : ${error}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSnippet = await db.insert(snippets).values(body).returning();
    return NextResponse.json(newSnippet[0]);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Failed to create snippet : ${error}` }, { status: 500 });
  }
}
