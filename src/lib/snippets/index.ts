import { useState, useEffect, useCallback } from 'react'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import type { Snippet } from '@/db/schema/snippets'

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { data: session, isPending } = authClient.useSession()

  const fetchSnippets = useCallback(async () => {
    if (isPending) return
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

  return {
    snippets,
    isLoading,
    error,
    refetch: fetchSnippets
  }
}

export function useSnippetLike(snippetId: number, userId: string | undefined) {
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkLikeStatus = useCallback(async () => {
    if (!snippetId || !userId) {
      setIsLiked(false)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/snippets/${snippetId}/like/check?userId=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to check like status')
      }

      const { liked } = await response.json()
      setIsLiked(liked)
    } catch (err) {
      console.error('Failed to check like status:', err)
      setError(err instanceof Error ? err.message : 'Failed to check like status')
      setIsLiked(false)
    } finally {
      setIsLoading(false)
    }
  }, [snippetId, userId])

  useEffect(() => {
    checkLikeStatus()
  }, [checkLikeStatus])

  const toggleLike = useCallback(async () => {
    if (!snippetId || !userId) return

    try {
      setIsLoading(true)
      const method = isLiked ? 'DELETE' : 'POST'
      const response = await fetch(`/api/snippets/${snippetId}/like`, {
        method,
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isLiked ? 'unlike' : 'like'} snippet`)
      }

      setIsLiked(!isLiked)
    } catch (err) {
      console.error('Failed to toggle like:', err)
      setError(err instanceof Error ? err.message : 'Failed to toggle like')
    } finally {
      setIsLoading(false)
    }
  }, [snippetId, userId, isLiked])

  return {
    isLiked,
    isLoading,
    error,
    toggleLike,
    checkLikeStatus
  }
}

export function useUserSnippets(userId: string) {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { data: session, isPending } = authClient.useSession()

  const fetchUserSnippets = useCallback(async () => {
    if (isPending) return
    if (!session?.session) {
      redirect('/sign-in')
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/profile/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user snippets')
      }

      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format')
      }

      setSnippets(data)
    } catch (err) {
      console.error('Failed to fetch user snippets', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch user snippets')
      setSnippets([])
    } finally {
      setIsLoading(false)
    }
  }, [isPending, session?.session, userId])

  useEffect(() => {
    fetchUserSnippets()
  }, [fetchUserSnippets])

  return {
    snippets,
    isLoading,
    error,
    refetch: fetchUserSnippets
  }
}
