// types/snippet.ts
import { snippets } from "@/db/schema"

export type ApiSnippet = Omit<typeof snippets, 'code'> & {
  code: string
}