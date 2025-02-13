
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { desc } from 'drizzle-orm';
import { insertSnippetSchema, snippets } from '@/db/schema/snippets';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Check if user is authenticated
  if (!session?.session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const snippet = {
      ...body,
      user_id: session.session.userId  // Ensure user_id is set correctly
    };

    // Validate the input using the schema
    const validated = insertSnippetSchema.parse(snippet);

    const newSnippet = await db.insert(snippets)
      .values(validated)
      .returning();

    return NextResponse.json(newSnippet[0]);
  } catch (error) {
    console.error('Error creating snippet:', error);
    return NextResponse.json(
      { error: `Failed to create snippet: ${error}` },
      { status: 500 }
    );
  }
}