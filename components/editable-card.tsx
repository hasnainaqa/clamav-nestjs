"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EditableCardProps {
  id: string
  initialTitle?: string
  initialDescription?: string
  onDelete?: (id: string) => void
  onUpdate?: (id: string, title: string, description: string) => void
}

export function EditableCard({
  id,
  initialTitle = "Untitled",
  initialDescription = "Click to add description...",
  onDelete,
  onUpdate,
}: EditableCardProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditingTitle && titleRef.current) {
      titleRef.current.focus()
      titleRef.current.select()
    }
  }, [isEditingTitle])

  useEffect(() => {
    if (isEditingDescription && descriptionRef.current) {
      descriptionRef.current.focus()
      descriptionRef.current.select()
    }
  }, [isEditingDescription])

  const handleTitleSubmit = () => {
    setIsEditingTitle(false)
    onUpdate?.(id, title, description)
  }

  const handleDescriptionSubmit = () => {
    setIsEditingDescription(false)
    onUpdate?.(id, title, description)
  }

  const handleKeyDown = (e: React.KeyboardEvent, type: "title" | "description") => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (type === "title") {
        handleTitleSubmit()
      } else {
        handleDescriptionSubmit()
      }
    }
    if (e.key === "Escape") {
      if (type === "title") {
        setTitle(initialTitle)
        setIsEditingTitle(false)
      } else {
        setDescription(initialDescription)
        setIsEditingDescription(false)
      }
    }
  }

  return (
    <Card className="group relative transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        {/* Card Actions */}
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete?.(id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <div className="mb-3">
          {isEditingTitle ? (
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => handleKeyDown(e, "title")}
              className="w-full border-none bg-transparent text-xl font-semibold text-card-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Untitled"
            />
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className="cursor-text text-xl font-semibold text-card-foreground hover:bg-muted/50 rounded px-1 py-0.5 -mx-1 transition-colors"
            >
              {title}
            </h3>
          )}
        </div>

        {/* Description */}
        <div>
          {isEditingDescription ? (
            <textarea
              ref={descriptionRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionSubmit}
              onKeyDown={(e) => handleKeyDown(e, "description")}
              className="w-full min-h-[80px] resize-none border-none bg-transparent text-muted-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Click to add description..."
            />
          ) : (
            <p
              onClick={() => setIsEditingDescription(true)}
              className="cursor-text text-muted-foreground hover:bg-muted/50 rounded px-1 py-0.5 -mx-1 transition-colors min-h-[80px] whitespace-pre-wrap"
            >
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
