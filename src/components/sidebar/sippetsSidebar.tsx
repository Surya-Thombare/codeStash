// components/sidebar/snippetsSidebar.tsx
"use client"

import { Home, Search, Bookmark, Settings, Hash, PlusCircle, Folder, Code2, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { SnippetForm } from "../SnippetForm"
import { authClient } from "@/lib/auth-client"
import { useSnippets } from "@/lib/snippets"
import { useState } from "react"

const mainNavItems = [
  {
    title: "Home",
    icon: Home,
    href: "/snippets",
  },
  {
    title: "Search",
    icon: Search,
    href: "/snippets/search",
  },
  {
    title: "Bookmarks",
    icon: Bookmark,
    href: "/snippets/bookmarks",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/profile",
  },
]

const folders = [
  { name: "APIs", count: 5 },
  { name: "Utils", count: 3 },
  { name: "Components", count: 8 },
]

const tags = [
  "javascript",
  "react",
  "typescript",
  "python",
  "go",
  "rust",
]

export function AppSidebar() {
  const { data: session, isPending } = authClient.useSession()
  const { refetch } = useSnippets()

  const [showCreate, setShowCreate] = useState(false)

  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center gap-2 px-4 py-4">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">CodeStash</span>
        </div>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                {/* <Link
                  href="/snippets/new"
                  className="flex items-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                >
                  <PlusCircle className="h-5 w-5" />
                  New Snippet
                </Link> */}
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
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={(pathname === item.href)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted",
                        pathname === item.href && "bg-muted"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Your Folders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/snippets/folders/${folder.name.toLowerCase()}`}
                      className="flex items-center justify-between px-4 py-2 rounded-md hover:bg-muted"
                    >
                      <span className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        {folder.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {folder.count}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Popular Tags</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-wrap gap-2 px-4">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/snippets/tags/${tag}`}
                  className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm hover:bg-muted/80"
                >
                  <Hash className="h-3 w-3" />
                  {tag}
                </Link>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}