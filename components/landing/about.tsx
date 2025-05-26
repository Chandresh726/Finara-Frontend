"use client"

import { motion } from "framer-motion"
import Lottie from "lottie-react"
import aiAnimation from "@/public/animation/ai-animation.json"

export function About() {
  return (
    <section id="about" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-7 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              About <span className="text-gradient">Finara</span>
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Founded in 2025, Finara was born from a simple observation: while AI was transforming industries
                everywhere, personal investing remained stuck in the past.
              </p>
              <p className="text-lg text-muted-foreground">
                Our team of financial experts and AI engineers came together with a shared vision: to build a platform
                that makes sophisticated investment strategies accessible to everyone, not just Wall Street professionals.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, we're proud to serve investors in over 120 countries, helping them build wealth with the power of
                artificial intelligence and global diversification strategies.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex col-span-1 md:col-span-5 relative items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-finance-400/20 to-purple-400/20 rounded-xl blur-3xl" />
            <Lottie
              animationData={aiAnimation}
              loop={true}
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
