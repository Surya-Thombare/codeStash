// app/landing/TypewriterEffect.tsx
"use client"

import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

interface TypewriterEffectProps {
  words: string
  className?: string
}

export function TypewriterEffect({ words, className = "" }: TypewriterEffectProps) {
  const controls = useAnimation()

  useEffect(() => {
    const sequence = async () => {
      await controls.start({
        opacity: 1,
        transition: { duration: 0.5 }
      })

      let delay = 0
      for (let i = 0; i <= words.length; i++) {
        await controls.start({
          width: `${i}ch`,
          transition: { duration: 0.05 }
        })
        delay += 0.05
      }
    }

    sequence()
  }, [controls, words])

  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={controls}
        className="overflow-hidden whitespace-nowrap border-r-2 border-primary"
      >
        {words}
      </motion.div>
    </div>
  )
}