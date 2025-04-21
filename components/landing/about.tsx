"use client"

import { motion } from "framer-motion"
import { Award, BarChart3, Globe, Users } from "lucide-react"
import Image from "next/image"

const stats = [
  {
    icon: <Users className="h-6 w-6 text-finance-500 dark:text-finance-400" />,
    value: "50,000+",
    label: "Active Users",
  },
  {
    icon: <Globe className="h-6 w-6 text-finance-500 dark:text-finance-400" />,
    value: "120+",
    label: "Countries",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-finance-500 dark:text-finance-400" />,
    value: "$2.5B+",
    label: "Assets Managed",
  },
  {
    icon: <Award className="h-6 w-6 text-finance-500 dark:text-finance-400" />,
    value: "15+",
    label: "Industry Awards",
  },
]

const team = [
  {
    name: "Alex Johnson",
    role: "CEO & Founder",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Sarah Chen",
    role: "CTO",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Michael Rodriguez",
    role: "Head of AI",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export function About() {
  return (
    <section id="about" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="text-gradient">Finara</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Founded in 2020, Finara was born from a simple observation: while AI was transforming industries
            everywhere, personal investing remained stuck in the past.
          </p>
          <p className="text-muted-foreground mb-4">
            Our team of financial experts and AI engineers came together with a shared vision: to build a platform
            that makes sophisticated investment strategies accessible to everyone, not just Wall Street professionals.
          </p>
          <p className="text-muted-foreground">
            Today, we're proud to serve investors in over 120 countries, helping them build wealth with the power of
            artificial intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="text-muted-foreground mb-4">
              Founded in 2020, FinanceAI was born from a simple observation: while AI was transforming industries
              everywhere, personal investing remained stuck in the past.
            </p>
            <p className="text-muted-foreground mb-4">
              Our team of financial experts and AI engineers came together with a shared vision: to build a platform
              that makes sophisticated investment strategies accessible to everyone, not just Wall Street professionals.
            </p>
            <p className="text-muted-foreground">
              Today, we're proud to serve investors in over 120 countries, helping them build wealth with the power of
              artificial intelligence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-finance-400/20 to-purple-400/20 rounded-xl blur-3xl" />
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
              {/* Company image would go here */}
              <div className="w-full h-full bg-gradient-to-br from-finance-900/10 to-purple-900/10 dark:from-finance-400/10 dark:to-purple-400/10 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-finance-500 dark:text-finance-400" />
                  <p className="text-xl font-semibold">Finara Headquarters</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
