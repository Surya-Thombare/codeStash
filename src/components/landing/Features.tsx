// app/landing/Features.tsx
"use client"

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Cloud,
  Tags,
  Search,
  Share2,
  Shield,
  Zap,
  Code2,
  Puzzle,
  Laptop
} from 'lucide-react'

const features = [
  {
    icon: <Cloud className="w-10 h-10" />,
    title: "Cloud Sync",
    description: "Access your snippets from anywhere, anytime. Changes sync automatically across all your devices."
  },
  {
    icon: <Tags className="w-10 h-10" />,
    title: "Smart Organization",
    description: "Organize snippets with tags and folders. Find what you need with powerful search and filtering."
  },
  {
    icon: <Code2 className="w-10 h-10" />,
    title: "Syntax Highlighting",
    description: "Support for 50+ programming languages with beautiful syntax highlighting."
  },
  {
    icon: <Share2 className="w-10 h-10" />,
    title: "Easy Sharing",
    description: "Share snippets with your team or the community. Control access with private and public options."
  },
  {
    icon: <Puzzle className="w-10 h-10" />,
    title: "IDE Integration",
    description: "Seamlessly integrate with popular IDEs like VS Code, IntelliJ, and more with our plugins."
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: "Secure Storage",
    description: "Your code is safe with end-to-end encryption and secure authentication."
  },
  {
    icon: <Search className="w-10 h-10" />,
    title: "Advanced Search",
    description: "Find any snippet instantly with our powerful full-text search and advanced filtering."
  },
  {
    icon: <Zap className="w-10 h-10" />,
    title: "Quick Access",
    description: "Access your frequently used snippets quickly with hotkeys and shortcuts."
  },
  {
    icon: <Laptop className="w-10 h-10" />,
    title: "Cross Platform",
    description: "Available on web, desktop, and mobile. Your snippets follow you everywhere."
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 px-4 bg-muted/50">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need to Manage Code
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help developers store, organize, and share code snippets efficiently
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative p-6 rounded-2xl border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="mb-4 text-primary">
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {feature.icon}
                </motion.div>
              </div>

              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              <p className="text-muted-foreground">
                {feature.description}
              </p>

              <div className="absolute inset-0 border border-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}