// app/landing/Testimonials.tsx
"use client"

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    content: "CodeStash has completely transformed how I manage my code snippets. The search functionality is incredible!",
    author: "Sarah Chen",
    role: "Senior Developer at TechCorp",
    avatar: "/avatars/sarah.jpg",
  },
  {
    content: "The IDE integration is seamless. I can't imagine going back to managing snippets manually.",
    author: "James Wilson",
    role: "Full Stack Developer",
    avatar: "/avatars/james.jpg",
  },
  {
    content: "Perfect for team collaboration. We use it daily for sharing code across our development team.",
    author: "Maria Garcia",
    role: "Tech Lead at StartupX",
    avatar: "/avatars/maria.jpg",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            Loved by Developers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who use CodeStash to manage their code snippets
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.author}
              variants={itemVariants}
            >
              <Card className="h-full bg-card/50 hover:bg-card/80 transition-colors">
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote className="w-10 h-10 text-primary mb-4" />
                  <p className="flex-grow text-lg mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}