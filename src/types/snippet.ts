// types/snippet.ts
import type { RawCode } from "codehike/code"
import type { Snippet } from '@/db/schema'

export type ApiSnippet = Omit<Snippet, 'code'> & {
  code: string
}

export type HighlightedSnippet = Omit<Snippet, 'code'> & {
  code: string
}