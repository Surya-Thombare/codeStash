'use client'

import { useSnippets } from '@/lib/snippets'
import { Snippet } from '@/db/schema/snippets'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Code2, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function MySnippetsPage() {
  const { snippets, isLoading, error } = useSnippets()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="container mx-auto flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session?.session) {
    redirect('/sign-in')
  }

  return (
    <main className="container max-w-5xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={session.session.user.image || undefined} />
            <AvatarFallback>
              {session.session.user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">My Snippets</h1>
            <p className="text-sm text-muted-foreground">
              Manage your code snippets
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/snippets/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Snippet
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-lg border bg-card p-4 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <motion.div
          className="text-center bg-destructive/10 rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-destructive mb-4 font-medium">Error: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </motion.div>
      ) : snippets.length === 0 ? (
        <motion.div
          className="text-center py-16 bg-muted/50 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Code2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg mb-4">
            You haven't created any snippets yet
          </p>
          <Button asChild>
            <Link href="/snippets/new">Create your first snippet</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snippets.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/snippets/${snippet.id}`}
              className="group relative rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold mb-2 group-hover:text-primary">
                {snippet.title}
              </h2>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {snippet.description}
              </p>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{snippet.language}</span>
                <span>
                  {formatDistanceToNow(new Date(snippet.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}