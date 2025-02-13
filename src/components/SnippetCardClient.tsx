// components/SnippetCardClient.tsx
'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { SnippetForm } from './SnippetForm'
import { CodeEditor } from './CodeEditor'
import { Edit2, Trash2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Snippet } from '@/db/schema/snippets'

interface SnippetCardClientProps {
  snippet: Snippet
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{snippet.title}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
            {snippet.language}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background opacity-0 group-hover:opacity-100 transition-opacity" />
          <CodeEditor
            code={snippet.code}
            language={snippet.language}
            maxLines={10}
          />
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {snippet.tags && snippet.tags.map((tag: string) => (
              <motion.span
                key={tag}
                className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t bg-muted/30 p-4">
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="group hover:scale-105 transition-transform"
            >
              <Edit2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <SnippetForm
              snippet={snippet}
              onSuccess={handleEditSuccess}
            />
          </DialogContent>
        </Dialog>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="group hover:scale-105 transition-transform"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
          )}
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </CardFooter>
    </Card>
  )
}