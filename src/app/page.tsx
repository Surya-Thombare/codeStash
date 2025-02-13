// app/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SnippetForm } from '@/components/SnippetForm'
import { SnippetCardClient } from '@/components/SnippetCardClient'
import { ApiSnippet } from '@/types/snippet'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Code, Loader2 } from 'lucide-react'

export default function Home() {
  const [snippets, setSnippets] = useState<ApiSnippet[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    data: session,
    isPending,
  } = authClient.useSession()

  const fetchSnippets = useCallback(async () => {
    if (isPending) {
      return <div>Loading...</div>
    }

    if (!session?.session) {
      redirect('/sign-in')
    }
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/snippets')
      if (!response.ok) {
        throw new Error('Failed to fetch snippets')
      }

      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format')
      }

      setSnippets(data)
    } catch (err) {
      console.error('Failed to fetch snippets', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch snippets')
      setSnippets([])
    } finally {
      setIsLoading(false)
    }
  }, [isPending, session?.session])

  useEffect(() => {
    fetchSnippets()
  }, [fetchSnippets])

  if (error) {
    return (
      <div className="container mx-auto py-16">
        <motion.div
          className="text-center bg-destructive/10 rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-destructive mb-4 font-medium">Error: {error}</p>
          <Button onClick={fetchSnippets} variant="outline">
            Retry
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Code Snippets
            </h1>
          </div>

          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button className="group hover:scale-105 transition-transform">
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                New Snippet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogTitle>Add Code Snippet</DialogTitle>
              <SnippetForm
                onSuccess={() => {
                  setShowCreate(false)
                  fetchSnippets()
                }}
              />
            </DialogContent>
          </Dialog>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : snippets.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-muted/50 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">
              No snippets found. Create your first one!
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence mode="popLayout">
              {snippets.map((snippet, index) => (
                <motion.div
                  key={snippet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <SnippetCardClient
                    snippet={snippet}
                    onDelete={fetchSnippets}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  )
}