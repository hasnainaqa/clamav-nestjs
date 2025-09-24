"use client"

import { useState } from "react"
import type { QuoteBlock } from "@/types/blocks"
import { BlockWrapper } from "./block-wrapper"
import { RichTextEditor } from "@/components/rich-text-editor"
import { RichTextDisplay } from "@/components/rich-text-display"

interface QuoteBlockProps {
  block: QuoteBlock
  onUpdate: (id: string, content: any) => void
  onDelete: (id: string) => void
  onAddBlock: (type: import("@/types/blocks").Block["type"], index?: number) => void
  onDuplicate: (id: string) => void
  index: number
}

export function QuoteBlockComponent({ block, onUpdate, onDelete, onAddBlock, onDuplicate, index }: QuoteBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(block?.content?.text)

  const handleSave = () => {
    onUpdate(block.id, { ...block.content, text })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setText(block.content.text)
    setIsEditing(false)
  }

  const handleAddNewBlock = () => {
    handleSave()
    onAddBlock("text", index)
  }

  return (
    <BlockWrapper block={block} onDelete={onDelete} onDuplicate={onDuplicate} onAddBlock={onAddBlock} index={index}>
      <div className="border-l-4 border-primary pl-4">
        {isEditing ? (
          <RichTextEditor
            content={text}
            onChange={setText}
            onSave={handleAddNewBlock}
            onCancel={handleCancel}
            placeholder="Quote..."
            className="italic"
          />
        ) : (
          <div className="italic">
            <RichTextDisplay content={text} onClick={() => setIsEditing(true)} />
          </div>
        )}
      </div>
    </BlockWrapper>
  )
}
