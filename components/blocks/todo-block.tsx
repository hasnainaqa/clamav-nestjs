"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { TodoBlock } from "@/types/blocks"
import { BlockWrapper } from "./block-wrapper"
import { Checkbox } from "@/components/ui/checkbox"

interface TodoBlockProps {
  block: TodoBlock
  onUpdate: (id: string, content: any) => void
  onDelete: (id: string) => void
  onAddBlock: (type: import("@/types/blocks").Block["type"], index?: number) => void
  onDuplicate: (id: string) => void
  index: number
}

export function TodoBlockComponent({ block, onUpdate, onDelete, onAddBlock, onDuplicate, index }: TodoBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(block?.content?.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(text.length, text.length)
    }
  }, [isEditing, text])

  const handleSave = () => {
    onUpdate(block.id, { ...block.content, text })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
      onAddBlock("todo", index)
    } else if (e.key === "Escape") {
      setText(block.content.text)
      setIsEditing(false)
    }
  }

  const toggleCompleted = (checked: boolean) => {
    onUpdate(block.id, { ...block.content, completed: checked })
  }

  return (
    <BlockWrapper block={block} onDelete={onDelete} onDuplicate={onDuplicate} onAddBlock={onAddBlock} index={index}>
      <div className="flex items-center gap-3">
        <Checkbox checked={block.content.completed} onCheckedChange={toggleCompleted} />
        {isEditing ? (
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="flex-1 border-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
            placeholder="To-do"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={`flex-1 cursor-text ${
              block.content.completed ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {text || <span className="text-muted-foreground">To-do</span>}
          </div>
        )}
      </div>
    </BlockWrapper>
  )
}
