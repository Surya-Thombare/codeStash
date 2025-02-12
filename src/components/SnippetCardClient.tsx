// components/SnippetCardClient.tsx
'use client'

import { useState, useCallback } from 'react'
import { HighlightedCode, Pre } from "codehike/code"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { SnippetForm } from './SnippetForm'
import type { HighlightedSnippet } from '@/types/snippet'
import { CodeEditor } from './CodeEditor'

interface SnippetCardClientProps {
  snippet: HighlightedSnippet
  onDelete?: () => void
}

export function SnippetCardClient({
  snippet,
  onDelete
}: SnippetCardClientProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = useCallback(async () => {
    if (isDeleting) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/snippets/${snippet.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete snippet')
      }

      onDelete?.()
    } catch (error) {
      console.error('Failed to delete snippet:', error)
    } finally {
      setIsDeleting(false)
    }
  }, [snippet.id, onDelete, isDeleting])

  const handleEditSuccess = useCallback(() => {
    setShowEdit(false)
    onDelete?.() // Use onDelete as a refresh callback
  }, [onDelete])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{snippet.title}</CardTitle>
      </CardHeader>

      <CardContent>
        code: highlighted
        {/* <Pre code={snippet.code} /> */}

        <CodeEditor code={snippet.code} language={snippet.language} />

        <div className="mt-4 flex flex-wrap gap-2">
          {snippet.tags.map(tag => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <SnippetForm
              snippet={snippet}
              onSuccess={handleEditSuccess}
            />
          </DialogContent>
        </Dialog>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </CardFooter>
    </Card>
  )
}