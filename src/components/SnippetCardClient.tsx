// components/SnippetCardClient.tsx
'use client'

import { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { SnippetForm } from './SnippetForm'
import { CodeEditor } from './CodeEditor'
import { Edit2, Trash2, Loader2, MessageSquare, Bookmark, Share2, MoreHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import { Snippet } from '@/db/schema/snippets'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
  const router = useRouter()

  const handleDelete = useCallback(async () => {
    if (isDeleting) return
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/snippets/${snippet.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete snippet')
      onDelete?.()
    } catch (error) {
      console.error('Failed to delete snippet:', error)
    } finally {
      setIsDeleting(false)
    }
  }, [snippet.id, onDelete, isDeleting])

  return (
    <div className="border rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all">
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/path-to-user-avatar.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium hover:underline cursor-pointer">
              {snippet.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              @username • {new Date(snippet.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setShowEdit(true)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onSelect={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Code Content */}
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/snippets/${snippet.id}`)}
      >
        <CodeEditor
          code={snippet.code}
          language={snippet.language}
          maxLines={10}
        />
      </div>

      {/* Tags */}
      <div className="px-4 py-2">
        <div className="flex flex-wrap gap-2">
          {snippet.tags && snippet.tags.map((tag: string) => (
            <motion.span
              key={tag}
              className="text-xs text-primary hover:underline cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              #{tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 border-t flex items-center justify-between">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-muted-foreground hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            <span>24</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-muted-foreground hover:text-primary"
          >
            <Bookmark className="h-4 w-4" />
            <span>5</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-muted-foreground hover:text-primary"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <span className="text-xs text-muted-foreground">
          {snippet.language}
        </span>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="sm:max-w-[600px]">
          <SnippetForm
            snippet={snippet}
            onSuccess={() => {
              setShowEdit(false)
              onDelete?.()
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}