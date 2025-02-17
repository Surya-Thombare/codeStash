// import { NextResponse } from 'next/server';
// import { db } from '@/db';
// import { desc } from 'drizzle-orm';
// import { insertSnippetSchema, Snippet, snippets } from '@/db/schema/snippets';
// import { auth } from '@/lib/auth';
// import { headers } from 'next/headers';


// export async function POST(request: Request,
//     { params }: { params: Promise<{ id: string }> }
//   ) {
  
//     const id = (await params).id
  
//     const session = await auth.api.getSession({
//       headers: await headers()
//     });
  
    
//   }