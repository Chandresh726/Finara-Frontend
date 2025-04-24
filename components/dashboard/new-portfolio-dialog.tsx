"use client"

import { useState } from "react"
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

interface NewPortfolioDialogProps {
  onCreatePortfolio?: (title: string, description: string) => void
}

export function NewPortfolioDialog({ onCreatePortfolio }: NewPortfolioDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = () => {
    if (onCreatePortfolio) {
      onCreatePortfolio(title, description)
    }
    setIsOpen(false)
    setTitle("")
    setDescription("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center w-full px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          New Portfolio
        </div>
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
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            Create Portfolio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 