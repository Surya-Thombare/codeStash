'use client'

import { redirect, useParams } from "next/navigation"
import { Snippet } from "@/db/schema/snippets"
import { CodeEditor } from "@/components/CodeEditor"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCallback, useEffect, useState } from "react"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { Code, Loader2 } from "lucide-react"


export default function SnippetPage() {
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    data: session,
    isPending,
  } = authClient.useSession()

  const { id } = useParams(); // Get the `id` from the URL
  const fetchSnippet = useCallback(async () => {

    if (isPending) return
    if (!session?.session) {
      redirect('/sign-in')
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/snippets/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch snippet')
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format')
      }

      setSnippet(data[0])
    } catch (err) {
      console.error('Failed to fetch snippet', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch snippet')
      setSnippet(null)
    } finally {
      setIsLoading(false)
    }
  }, [id, isPending, session?.session])

  useEffect(() => {
    fetchSnippet()
  }, [fetchSnippet])

  if (error) {
    return (
      <div className="container mx-auto py-16">
        <motion.div
          className="text-center bg-destructive/10 rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-destructive mb-4 font-medium">Error: {error}</p>
          <Button onClick={fetchSnippet} variant="outline">
            Retry
          </Button>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!snippet) {
    return (
      <motion.div
        className="container mx-auto text-center py-16 bg-muted/50 rounded-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">
          Snippet not found
        </p>
      </motion.div>
    )
  }

  return (

    <main className="container max-w-5xl py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {snippet.title}
            </h1>
            {/* <p className="text-sm text-muted-foreground">
              {snippet.description}
            </p> */}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* {snippet.user && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={snippet.user.image || undefined} />
                  <AvatarFallback>
                    {snippet.user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )} */}
              <div className="space-y-1">
                {/* {snippet.user?.name && (
                  <p className="text-sm font-medium leading-none">
                    {snippet.user.name}
                  </p>
                )} */}
                {/* <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(snippet.createdAt), {
                    addSuffix: true,
                  })}
                </p> */}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border">
          <CodeEditor
            code={snippet.code}
            language={snippet.language}
          // readOnly
          // maxLines={10}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Comments
          </h2>
          {/* Add comments section here */}
        </div>
      </div>
    </main>
  )
}