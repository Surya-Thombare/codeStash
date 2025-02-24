'use client'

import { redirect, useParams, useRouter } from "next/navigation"
import type { Snippet } from "@/db/schema/snippets"
import { CodeEditor } from "@/components/CodeEditor"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCallback, useEffect, useState } from "react"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { ArrowLeft, Bookmark, Code, Heart, Loader2, MessageSquare, Share2, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useSnippetLike } from "@/lib/snippets"
import { cn } from "@/lib/utils"

interface Comment {
  id: number;
  content: string;
  user_id: string;
  createdAt: string;
  metadata: Record<string, string | boolean>;
}

export default function SnippetPage() {
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCommenting, setIsCommenting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const {
    data: session,
    isPending,
  } = authClient.useSession()

  const { id } = useParams()

  const { isLiked, isLoading: isLikeLoading, toggleLike } = useSnippetLike(
    snippet?.id || 0,
    session?.user?.id
  );

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

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/snippets/${id}/comment`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isCommenting) return;

    try {
      setIsCommenting(true);
      const response = await fetch(`/api/snippets/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: newComment, 
          snippet_id: Number(id), 
          user_id: session?.user?.id, 
          // parent_id: Number(id) 
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');
      
      const updatedComments = await response.json();
      setComments(updatedComments);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  useEffect(() => {
    fetchSnippet()
    fetchComments()
  }, [fetchSnippet, fetchComments])

  useEffect(() => {
    setMounted(true)
  }, [])

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
                    {mounted ? formatDistanceToNow(new Date(snippet.createdAt), {
                      addSuffix: true,
                    }) : ''}
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={toggleLike}
              disabled={isLikeLoading || !session?.user}
            >
              <Heart 
                className={cn("h-4 w-4", {
                  "fill-red-500 text-red-500": isLiked,
                  "animate-pulse": isLikeLoading
                })} 
              />
              <span>{snippet.likes_count || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length}</span>
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
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            
            {/* Comment Input */}
            <form onSubmit={handleComment} className="flex gap-4 mb-6">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || undefined} />
                <AvatarFallback>
                  {session?.user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!newComment.trim() || isCommenting}
                >
                  {isCommenting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.metadata?.user?.image} />
                    <AvatarFallback>
                      {comment.metadata?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {comment.metadata?.user?.name || 'User'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {mounted ? formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        }) : ''}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}