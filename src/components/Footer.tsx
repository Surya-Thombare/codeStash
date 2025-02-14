// app/landing/Footer.tsx
"use client"

import Link from 'next/link'
import { Code2, Github, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Documentation", href: "/docs" },
    { label: "Changelog", href: "/changelog" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Community", href: "/community" },
    { label: "Support", href: "/support" },
    { label: "Status", href: "/status" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
  social: [
    { label: "GitHub", href: "https://github.com", icon: <Github className="w-5 h-5" /> },
    { label: "Twitter", href: "https://twitter.com", icon: <Twitter className="w-5 h-5" /> },
    { label: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin className="w-5 h-5" /> },
  ]
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Code2 className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl">CodeStash</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              The modern way to store, organize, and share your code snippets. Built for developers, by developers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CodeStash. All rights reserved.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {link.icon}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}