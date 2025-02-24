'use client'

import { useUserSnippets } from '@/lib/snippets'
import type { Snippet } from '@/db/schema/snippets'
import { authClient } from '@/lib/auth-client'
import { redirect, useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Code2, PlusCircle, Pencil, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { SnippetForm } from '@/components/SnippetForm'

export default function UserSnippetsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const { snippets, isLoading, error, refetch } = useUserSnippets(userId)
  const { data: session, isPending } = authClient.useSession()
  const [deleteSnippetId, setDeleteSnippetId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [showEdit, setShowEdit] = useState(false)
  const [snippet, setSnippet] = useState<Snippet | null>(null)

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

  const isCurrentUser = session.user.id === userId

  const handleEdit = (snippet: Snippet) => {
    setShowEdit(true)
    setSnippet(snippet)
  }

  const handleDeleteSnippet = async () => {
    if (!deleteSnippetId) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/snippets/${deleteSnippetId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete snippet')
      }

      await refetch()
    } catch (error) {
      console.error('Error deleting snippet:', error)
    } finally {
      setIsDeleting(false)
      setDeleteSnippetId(null)
    }
  }

  return (
    <main className="container max-w-5xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            {session.user.image && (
              <AvatarImage
                src={session.user.image}
                alt={session.user.name || ''}
                className="object-cover"
              />
            )}
            <AvatarFallback>
              {session?.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {isCurrentUser ? 'My Snippets' : `${session.user.name}'s Snippets`}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isCurrentUser
                ? 'View and manage your code snippets'
                : `Browse ${session.user.name}'s code snippets`}
            </p>
          </div>
        </div>
        {isCurrentUser && (
          <Button asChild>
            <Link href="/snippets/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Snippet
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={`${i}-key`}
              className="h-40 rounded-lg border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">{error}</div>
      ) : snippets.length === 0 ? (
        <div className="text-center py-16">
          <Code2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg mb-4">
            {isCurrentUser
              ? "You haven't created any snippets yet"
              : "This user hasn't created any snippets yet"}
          </p>
          {isCurrentUser && (
            <Button asChild>
              <Link href="/snippets/new">Create your first snippet</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {snippets.map((snippet, index) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Link
                      href={`/snippets/${snippet.id}`}
                      className="block group-hover:text-primary transition-colors"
                    >
                      <h2 className="text-lg font-semibold line-clamp-1">
                        {snippet.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {snippet.description}
                    </p>
                  </div>
                  {isCurrentUser && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEdit(snippet)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteSnippetId(snippet.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <span className="inline-flex items-center text-xs text-muted-foreground">
                    <Code2 className="w-3.5 h-3.5 mr-1" />
                    {snippet.language}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(snippet.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteSnippetId} onOpenChange={() => setDeleteSnippetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              snippet and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSnippet}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="sm:max-w-[600px]">
          <SnippetForm
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            snippet={snippet!}
            onSuccess={() => {
              setShowEdit(false)
              refetch()
            }}
          />
        </DialogContent>
      </Dialog>
    </main>
  )
}