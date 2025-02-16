// app/page.tsx
'use client'

import { Button } from '@/components/ui/button'
import { SnippetCardClient } from '@/components/SnippetCardClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Loader2 } from 'lucide-react'
import { useSnippets } from '@/lib/snippets'

export default function Home() {
  const { snippets, isLoading, error, refetch } = useSnippets()

  if (error) {
    return (
      <div className="container mx-auto py-16">
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
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto py-8 px-4">
        {/* <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Code Snippets
            </h1>
          </div>
        </motion.div> */}

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
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
    </main>
  )
}