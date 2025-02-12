// components/SnippetForm.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Snippet } from '@/db/schema'
import { RawCode } from 'codehike/code'

const LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'ruby', 'go', 'rust']

export function SnippetForm({
  snippet,
  onSuccess
}: {
  snippet?: Omit<Snippet, 'code'> & { code: RawCode }
  onSuccess?: () => void
}) {
  const [title, setTitle] = useState(snippet?.title ?? '')
  const [code, setCode] = useState(snippet?.code ?? '')
  const [language, setLanguage] = useState(snippet?.language ?? 'javascript')
  const [tags, setTags] = useState(snippet?.tags?.join(', ') ?? '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formattedTags = tags.split(',').map(tag => tag.trim()).filter(Boolean)

    if (snippet?.id) {
      await fetch(`/api/snippets/${snippet.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          code,
          language,
          tags: formattedTags
        }),
      })
    } else {
      await fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          code,
          language,
          tags: formattedTags
        }),
      })
    }

    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Snippet title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="Paste your code here"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-48 font-mono"
          required
        />
      </div>

      <div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map(lang => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <Button type="submit">
        {snippet ? 'Update Snippet' : 'Create Snippet'}
      </Button>
    </form>
  )
}