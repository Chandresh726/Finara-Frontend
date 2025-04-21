"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    startTransition(() => {
      setTheme(theme === "dark" ? "light" : "dark")
    })
  }

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-9 h-9 opacity-0" />
  }

  return (
    <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="w-9 h-9 rounded-full"
        aria-label="Toggle theme"
        disabled={isPending}
      >
        {theme === "dark" ? <Moon className="h-5 w-5 text-yellow-300" /> : <Sun className="h-5 w-5 text-yellow-500" />}
      </Button>
    </motion.div>
  )
}
