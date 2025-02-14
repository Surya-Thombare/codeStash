// components/Header.tsx
"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { Code2, LogOut, Plus, User } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import { SnippetForm } from './SnippetForm'
import { useSnippets } from '@/lib/snippets'


export function Header() {
  const { data: session, isPending } = authClient.useSession()
  const { snippets, isLoading, error, refetch } = useSnippets()

  const [showCreate, setShowCreate] = useState(false)

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/sign-in")
        },
      },
    })
  }

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Code2 className="w-6 h-6 text-primary" />
          </motion.div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            CodeStash
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <ThemeToggle />

          {isPending ? (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          ) : session?.session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                      {session.user.image && (
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name || ''}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogTrigger asChild>
                  <Button className="group hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                    New Snippet
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogTitle>Add Code Snippet</DialogTitle>
                  <SnippetForm
                    onSuccess={() => {
                      setShowCreate(false)
                      refetch()
                    }}
                  />
                </DialogContent>
              </Dialog>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col px-2 py-1.5">
                  <span className="text-sm font-medium">{session.user.name}</span>
                  <span className="text-xs text-muted-foreground">{session.user.email}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                  <Link href="/profile">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                asChild
                className="hover:scale-105 transition-transform"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button
                asChild
                className="hover:scale-105 transition-transform"
              >
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </motion.div>
          )}
        </nav>
      </div>
    </motion.header>
  )
}