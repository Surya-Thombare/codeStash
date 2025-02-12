'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { SnippetForm } from '@/components/SnippetForm'
import { SnippetCard } from '@/components/SnippetCard'
import type { ApiSnippet } from '@/types/snippet'

export default function SnippetList() {
  const [snippets, setSnippets] = useState<ApiSnippet[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSnippets = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/snippets')
      if (!response.ok) {
        throw new Error('Failed to fetch snippets')
      }
      const data = await response.json()
      setSnippets(data)
      setError(null)
    } catch (err) {
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
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={fetchSnippets}>Retry</Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Code Snippets</h1>

        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button>New Snippet</Button>
          </DialogTrigger>
          <DialogContent>
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
        <p className="text-center text-muted-foreground">Loading snippets...</p>
      ) : snippets.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No snippets found. Create your first one!
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {snippets.map(snippet => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onDelete={fetchSnippets}
            />
          ))}
        </div>
      )}
    </>
  )
}
