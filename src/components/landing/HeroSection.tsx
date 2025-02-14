// app/landing/HeroSection.tsx
"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Github, ArrowRight } from 'lucide-react'
import { TypewriterEffect } from './TypewriterEffect'
import { authClient } from '@/lib/auth-client'

export function HeroSection() {
  const { data: session } = authClient.useSession()


  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 grid grid-cols-6 gap-4 opacity-10">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="col-span-1 border-r border-primary/20" />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground pb-2 text-center">
              Store, Share & Organize Your Code Snippets
            </h1>
            <TypewriterEffect
              words="The modern way to manage your code snippets"
              className="text-xl md:text-2xl text-muted-foreground"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            CodeStash helps developers store, organize, and share code snippets efficiently.
            With powerful features like syntax highlighting, tags, and cloud sync.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-4 justify-center"
          >
            <Button size="lg" asChild className="group">
              <Link href={session?.session ? '/snippets' : '/sign-up'}>
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/Surya-Thombare/codeStash" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 w-4 h-4" />
                Star on GitHub
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 max-w-3xl mx-auto"
          >
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'Snippets Stored', value: '1M+' },
              { label: 'Languages', value: '50+' },
              { label: 'Stars', value: '2.5K' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="space-y-2"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}