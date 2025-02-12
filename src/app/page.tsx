// app/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SnippetForm } from '@/components/SnippetForm'
import { SnippetCardClient } from '@/components/SnippetCardClient'
import type { Snippet } from '@/db/schema'
import { RawCode } from 'codehike/code'

// Define the type for snippets as they come from the API
type ApiSnippet = Omit<Snippet, 'code'> & {
  code: RawCode
}

export default function Home() {
  const [snippets, setSnippets] = useState<ApiSnippet[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSnippets = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchSnippets()
  }, [fetchSnippets])

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={fetchSnippets}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Code Snippets</h1>

        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button>New Snippet</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add Code Snippet</DialogTitle>
            <SnippetForm
              onSuccess={() => {
                setShowCreate(false)
                fetchSnippets()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading snippets...</p>
        </div>
      ) : snippets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No snippets found. Create your first one!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {snippets.map(snippet => (
            <SnippetCardClient
              key={snippet.id}
              snippet={snippet}
              onDelete={fetchSnippets}
            />
          ))}
        </div>
      )}
    </main>
  )
}