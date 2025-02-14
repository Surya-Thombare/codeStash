// app/landing/CodeDemo.tsx
"use client"

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { highlight, Pre, RawCode } from 'codehike/code'
import type { HighlightedCode } from 'codehike/code'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code } from './CodeBlock'

const demoSnippets = {
  javascript: `// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};`,
  python: `from typing import List

def merge_sort(arr: List[int]) -> List[int]:
    if len(arr) <= 1:
        return arr
        
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)
    
def merge(left: List[int], right: List[int]) -> List[int]:
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
            
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  rust: `#[derive(Debug)]
struct Cache<T> {
    data: HashMap<String, (T, Instant)>,
    ttl: Duration,
}

impl<T: Clone> Cache<T> {
    pub fn new(ttl: Duration) -> Self {
        Self {
            data: HashMap::new(),
            ttl,
        }
    }
    
    pub fn get(&self, key: &str) -> Option<T> {
        self.data.get(key).and_then(|(value, timestamp)| {
            if timestamp.elapsed() < self.ttl {
                Some(value.clone())
            } else {
                None
            }
        })
    }
    
    pub fn set(&mut self, key: String, value: T) {
        self.data.insert(key, (value, Instant::now()));
    }
}`
}

export function CodeDemo() {
  const ref = useRef(null)
  const [codeSnippets, setCodeSnippets] = useState<Record<string, RawCode>>({})
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const formatCode = async () => {
    try {
      const highlightedSnippets: Record<string, RawCode> = {}

      for (const [language, code] of Object.entries(demoSnippets)) {
        highlightedSnippets[language] = await highlight(code, "github-dark")
      }

      setCodeSnippets(highlightedSnippets)
    } catch (error) {
      console.error('Failed to highlight code:', error)
    }
  }

  useEffect(() => {
    formatCode()
  }, [])

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            Powerful Code Management
          </h2>
          <p className="text-muted-foreground">
            Store and organize your code snippets with beautiful syntax highlighting
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="javascript" className="relative">
            <div className="absolute -top-4 right-4 z-10">
              <TabsList className="bg-background/95 backdrop-blur-sm">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="rust">Rust</TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-2 rounded-lg border bg-card shadow-2xl">
              <TabsContent value="javascript">
                {codeSnippets.javascript && (
                  <Pre code={codeSnippets.javascript} lang="javascript" />
                )}
              </TabsContent>
              <TabsContent value="python">
                {codeSnippets.python && (
                  <Pre code={codeSnippets.python} lang="python" />
                )}
              </TabsContent>
              <TabsContent value="rust">
                {codeSnippets.rust && (
                  // <Pre code={codeSnippets.rust} lang="rust" />
                  <Code code={codeSnippets.rust} lang="rust" />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}