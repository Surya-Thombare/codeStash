'use client'

import { redirect, useParams, useRouter } from "next/navigation"
import { Snippet } from "@/db/schema/snippets"
import { CodeEditor } from "@/components/CodeEditor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCallback, useEffect, useState } from "react"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { ArrowLeft, Bookmark, Code, Heart, Loader2, MessageSquare, Share2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

export default function SnippetPage() {
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    data: session,
    isPending,
  } = authClient.useSession()

  const { id } = useParams()

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
      <div className="ml-64 p-4">
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
      <div className="ml-64 flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!snippet) {
    return (
      <motion.div
        className="ml-64 text-center py-16 bg-muted/50 rounded-lg"
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
    <div className="ml-64">
      <div className="max-w-3xl mx-auto">
        {/* Back Button Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur px-4 py-2 border-b">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Snippet</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          {/* Author Info */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={session?.user?.image || undefined} />
              <AvatarFallback>
                {session?.user?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="font-semibold">{session?.user?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(snippet.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h2 className="text-2xl font-bold mt-2">{snippet.title}</h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {snippet.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-sm text-primary hover:underline cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Code Block */}
          <div className="my-4 rounded-lg border bg-card overflow-hidden">
            <div className="p-2 bg-muted/50 border-b flex items-center justify-between">
              <span className="text-sm font-medium">{snippet.language}</span>
              <Button variant="ghost" size="sm">Copy Code</Button>
            </div>
            <CodeEditor
              code={snippet.code}
              language={snippet.language}
              showCopy={false}
            />
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between py-4 border-y">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              <span>234</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>12</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              <span>56</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Comments Section */}
          <div className="mt-4 space-y-4">
            <div className="flex gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || undefined} />
                <AvatarFallback>
                  {session?.user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  placeholder="Write a comment..."
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Sample Comments (you can map through actual comments) */}
            <div className="space-y-4 mt-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">User Name</span>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                      <p className="text-sm">Great snippet! Really helpful.</p>
                    </div>
                    <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                      <button className="hover:text-foreground">Like</button>
                      <button className="hover:text-foreground">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}