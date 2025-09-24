"use client"

import { useState, useRef, useEffect } from "react"
import type { CodeBlock } from "@/types/blocks"
import { BlockWrapper } from "./block-wrapper"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CodeBlockProps {
  block: CodeBlock
  onUpdate: (id: string, content: any) => void
  onDelete: (id: string) => void
  onAddBlock: (type: import("@/types/blocks").Block["type"], index?: number) => void
  onDuplicate: (id: string) => void
  index: number
}

const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "c",
  "csharp",
  "php",
  "ruby",
  "go",
  "rust",
  "swift",
  "kotlin",
  "html",
  "css",
  "sql",
]

export function CodeBlockComponent({ block, onUpdate, onDelete, onAddBlock, onDuplicate, index }: CodeBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [code, setCode] = useState(block.content.code)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    onUpdate(block.id, { ...block.content, code })
    setIsEditing(false)
  }

  const handleLanguageChange = (language: string) => {
    onUpdate(block.id, { ...block.content, language })
  }

  return (
    <BlockWrapper block={block} onDelete={onDelete} onDuplicate={onDuplicate} onAddBlock={onAddBlock} index={index}>
      <div className="bg-muted rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <Select value={block.content.language || "javascript"} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32 h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onBlur={handleSave}
            className="w-full resize-none border-none outline-none bg-transparent text-foreground font-mono text-sm p-3 min-h-[100px]"
            placeholder="Enter your code..."
          />
        ) : (
          <pre
            onClick={() => setIsEditing(true)}
            className="cursor-text text-foreground font-mono text-sm p-3 whitespace-pre-wrap min-h-[100px]"
          >
            {code || <span className="text-muted-foreground">Enter your code...</span>}
          </pre>
        )}
      </div>
    </BlockWrapper>
  )
}
