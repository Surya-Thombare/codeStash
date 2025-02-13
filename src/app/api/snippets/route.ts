import { sessions } from './../../../../auth-schema';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { desc, eq } from 'drizzle-orm';
import { snippets } from '@/db/schema/snippets';
import { authClient } from '@/lib/auth-client';
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
    headers: await headers() // you need to pass the headers object.
  })
  try {
    const body = await request.json();
    body.user_id = session?.session.userId
    console.log('session', body)
    const newSnippet = await db.insert(snippets).values(body).returning();
    return NextResponse.json(newSnippet[0]);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Failed to create snippet : ${error}` }, { status: 500 });
  }
}
