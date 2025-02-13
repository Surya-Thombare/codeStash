// components/SnippetForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RawCode } from 'codehike/code'
import { Snippet } from '@/db/schema/snippets'
import { motion } from 'framer-motion'
import { Save, X } from 'lucide-react'

const LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'ruby', 'go', 'rust']

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

export function SnippetForm({
  snippet,
  onSuccess,
  onCancel
}: {
  snippet?: Omit<Snippet, 'code'> & { code: RawCode }
  onSuccess?: () => void
  onCancel?: () => void
}) {
  const [title, setTitle] = useState(snippet?.title ?? '')
  const [code, setCode] = useState(snippet?.code ?? '')
  const [language, setLanguage] = useState(snippet?.language ?? 'javascript')
  const [tags, setTags] = useState(snippet?.tags?.join(', ') ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formattedTags = tags.split(',').map(tag => tag.trim()).filter(Boolean)

      const content = {
        title,
        code,
        language,
        tags: formattedTags
      }

      const response = await fetch(
        snippet?.id ? `/api/snippets/${snippet.id}` : '/api/snippets',
        {
          method: snippet?.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content),
        }
      )

      if (!response.ok) throw new Error('Failed to save snippet')
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save snippet:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter snippet title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1.5"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Label htmlFor="code">Code</Label>
        <Textarea
          id="code"
          placeholder="Paste your code here"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-1.5 h-48 font-mono"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language" className="mt-1.5">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map(lang => (
              <SelectItem
                key={lang}
                value={lang}
                className="hover:bg-primary/10"
              >
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Enter tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-1.5"
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-end gap-2 pt-2"
      >
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="group"
          >
            <X className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="group"
        >
          <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          {isSubmitting ? 'Saving...' : snippet ? 'Update' : 'Create'}
        </Button>
      </motion.div>
    </motion.form>
  )
}