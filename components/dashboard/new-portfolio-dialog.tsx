"use client"

import { useState, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface NewPortfolioDialogProps {
  onCreatePortfolio?: (title: string, description: string) => Promise<void>
  children?: ReactNode
}

export function NewPortfolioDialog({ onCreatePortfolio, children }: NewPortfolioDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!onCreatePortfolio) return

    try {
      setIsSubmitting(true)
      await onCreatePortfolio(title, description)
      setIsOpen(false)
      setTitle("")
      setDescription("")
    } catch (error) {
      // Error is already handled by the context
      console.error('Failed to create portfolio:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <div className="flex items-center justify-center w-full px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            New Portfolio
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Portfolio</DialogTitle>
          <DialogDescription>
            Create a new portfolio to track a different set of investments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Portfolio Title
            </label>
            <Input
              id="title"
              placeholder="Enter portfolio title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Enter portfolio description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 h-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false)
              setTitle("")
              setDescription("")
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Portfolio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 