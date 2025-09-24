"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Bold, Italic, Underline, Strikethrough, Code, Link, Palette } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  onSave: () => void
  onCancel: () => void
  placeholder?: string
  className?: string
}

const colors = [
  { name: "Default", value: "" },
  { name: "Gray", value: "#6b7280" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
]

export function RichTextEditor({
  content,
  onChange,
  onSave,
  onCancel,
  placeholder = "Type something...",
  className,
}: RichTextEditorProps) {
  const [showToolbar, setShowToolbar] = useState(false)
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [formattedContent, setFormattedContent] = useState(content)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(content.length, content.length)
    }
  }, [content])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case "b":
          e.preventDefault()
          applyFormat("bold")
          break
        case "i":
          e.preventDefault()
          applyFormat("italic")
          break
        case "u":
          e.preventDefault()
          applyFormat("underline")
          break
        case "`":
          e.preventDefault()
          applyFormat("code")
          break
        case "Enter":
          e.preventDefault()
          onSave()
          break
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSave()
    } else if (e.key === "Escape") {
      onCancel()
    }
  }

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      setSelection({ start, end })
      setShowToolbar(start !== end)
    }
  }

  const applyFormat = useCallback(
    (format: string, value?: string) => {
      if (!textareaRef.current || !selection) return

      const textarea = textareaRef.current
      const start = selection.start
      const end = selection.end
      const selectedText = formattedContent.substring(start, end)

      let formattedText = ""
      let newCursorPos = end

      switch (format) {
        case "bold":
          if (selectedText.startsWith("**") && selectedText.endsWith("**")) {
            formattedText = selectedText.slice(2, -2)
            newCursorPos = start + formattedText.length
          } else {
            formattedText = `**${selectedText}**`
            newCursorPos = start + formattedText.length
          }
          break
        case "italic":
          if (selectedText.startsWith("*") && selectedText.endsWith("*") && !selectedText.startsWith("**")) {
            formattedText = selectedText.slice(1, -1)
            newCursorPos = start + formattedText.length
          } else {
            formattedText = `*${selectedText}*`
            newCursorPos = start + formattedText.length
          }
          break
        case "underline":
          if (selectedText.startsWith("<u>") && selectedText.endsWith("</u>")) {
            formattedText = selectedText.slice(3, -4)
            newCursorPos = start + formattedText.length
          } else {
            formattedText = `<u>${selectedText}</u>`
            newCursorPos = start + formattedText.length
          }
          break
        case "strikethrough":
          if (selectedText.startsWith("~~") && selectedText.endsWith("~~")) {
            formattedText = selectedText.slice(2, -2)
            newCursorPos = start + formattedText.length
          } else {
            formattedText = `~~${selectedText}~~`
            newCursorPos = start + formattedText.length
          }
          break
        case "code":
          if (selectedText.startsWith("`") && selectedText.endsWith("`")) {
            formattedText = selectedText.slice(1, -1)
            newCursorPos = start + formattedText.length
          } else {
            formattedText = `\`${selectedText}\``
            newCursorPos = start + formattedText.length
          }
          break
        case "link":
          formattedText = `[${selectedText}](url)`
          newCursorPos = start + formattedText.length - 4
          break
        case "color":
          if (value) {
            formattedText = `<span style="color: ${value}">${selectedText}</span>`
            newCursorPos = start + formattedText.length
          }
          break
        default:
          return
      }

      const newContent = formattedContent.substring(0, start) + formattedText + formattedContent.substring(end)
      setFormattedContent(newContent)
      onChange(newContent)

      // Update cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
          textareaRef.current.focus()
        }
      }, 0)
    },
    [formattedContent, selection, onChange],
  )

  const renderFormattedText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" class="text-primary underline">$1</a>')
  }

  return (
    <div className={cn("relative", className)}>
      {showToolbar && selection && selection.start !== selection.end && (
        <div className="absolute -top-12 left-0 z-10 flex items-center gap-1 bg-popover border border-border rounded-lg shadow-lg p-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyFormat("bold")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyFormat("italic")}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyFormat("underline")}>
            <Underline className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyFormat("strikethrough")}>
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyFormat("code")}>
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => applyFormat("link")}>
            <Link className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {colors.map((color) => (
                <DropdownMenuItem key={color.name} onClick={() => applyFormat("color", color.value)}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border" style={{ backgroundColor: color.value || "#000000" }} />
                    {color.name}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={formattedContent}
        onChange={(e) => {
          setFormattedContent(e.target.value)
          onChange(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        onSelect={handleSelectionChange}
        onMouseUp={handleSelectionChange}
        placeholder={placeholder}
        className="w-full resize-none border-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground font-sans leading-relaxed"
        rows={Math.max(1, formattedContent.split("\n").length)}
      />

      <div className="mt-2 text-xs text-muted-foreground">
        <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Cmd/Ctrl</kbd> + <kbd>B</kbd> Bold,{" "}
        <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Cmd/Ctrl</kbd> + <kbd>I</kbd> Italic,{" "}
        <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Enter</kbd> Save
      </div>
    </div>
  )
}
