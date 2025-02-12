import { highlight, RawCode } from "codehike/code"
import { SnippetCardClient } from './SnippetCardClient'
import type { ApiSnippet, HighlightedSnippet } from '@/types/snippet'

export async function SnippetCard({
  snippet,
  onDelete
}: {
  snippet: ApiSnippet
  onDelete?: () => void
}) {
  // Server-side highlighting
  const highlighted = await highlight(snippet.code as RawCode, "github-dark")

  // Create a new object with highlighted codeconst highlighted: HighlightedCode

  const highlightedSnippet: HighlightedSnippet = {
    ...snippet,
    code: highlighted
  }

  return (
    <SnippetCardClient
      snippet={highlightedSnippet}
      onDelete={onDelete}
    />
  )
}