import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

export function NewChatDialog({ open, onClose, onCreate }: NewChatDialogProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a chat title.");
      return;
    }
    onCreate(title.trim());
    setTitle("");
    setError("");
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-popover rounded-xl shadow-2xl p-6 w-[90%] max-w-xs flex flex-col gap-3 border">
        <div className="font-semibold text-lg mb-1">What is this chat about?</div>
        <Input
          autoFocus
          placeholder="Enter chat title..."
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            setError("");
          }}
          maxLength={60}
        />
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="finance">Create Chat</Button>
        </div>
      </form>
    </div>
  );
} 