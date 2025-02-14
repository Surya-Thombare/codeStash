// app/landing/page.tsx
"use client"

import { Features } from '@/components/landing/Features'
import { HeroSection } from '@/components/landing/HeroSection'
import { CodeDemo } from '@/components/landing/CodeDemo'
import { TypewriterEffect } from '@/components/landing/TypewriterEffect'
import { Testimonials } from '@/components/landing/Testimonials'
import { PricingSection } from '@/components/landing/PricingSection'
import { Footer } from '@/components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <HeroSection />
      <Features />
      <CodeDemo />
      <TypewriterEffect words="Your text here" />
      <Testimonials />
      <PricingSection />
      <Footer />
    </div>
  )
}