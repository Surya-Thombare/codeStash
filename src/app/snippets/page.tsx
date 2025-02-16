// app/snippets/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { SnippetCardClient } from '@/components/SnippetCardClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Loader2 } from 'lucide-react'
import { useSnippets } from '@/lib/snippets'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SnippetsPage() {
  const { snippets, isLoading, error, refetch } = useSnippets()

  if (error) {
    return (
      <div className="ml-64 p-4">
        <motion.div
          className="text-center bg-destructive/10 rounded-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-destructive mb-4 font-medium">Error: {error}</p>
          <Button onClick={refetch} variant="outline">
            Retry
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="ml-64 min-h-screen">
      <div className="max-w-3xl mx-auto py-4 px-4">
        {/* Filters */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur mb-4 pb-4 border-b">
          <div className="flex gap-4 items-center">
            <Select defaultValue="latest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Search snippets..." className="flex-1" />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : snippets.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-muted/50 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">
              No snippets found. Create your first one!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {snippets.map((snippet, index) => (
                <motion.div
                  key={String(snippet.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <SnippetCardClient
                    snippet={snippet}
                    onDelete={refetch}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}