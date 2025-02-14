import { useState, useEffect, useCallback } from 'react'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { Snippet } from '@/db/schema/snippets'

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