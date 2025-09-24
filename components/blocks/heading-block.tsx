"use client"

import { useState } from "react"
import type { HeadingBlock } from "@/types/blocks"
import { BlockWrapper } from "./block-wrapper"
import { RichTextEditor } from "@/components/rich-text-editor"
import { RichTextDisplay } from "@/components/rich-text-display"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime"

interface HeadingBlockProps {
  block: HeadingBlock
  onUpdate: (id: string, content: any) => void
  onDelete: (id: string) => void
  onAddBlock: (type: import("@/types/blocks").Block["type"], index?: number) => void
  onDuplicate: (id: string) => void
  index: number
}

export function HeadingBlockComponent({
  block,
  onUpdate,
  onDelete,
  onAddBlock,
  onDuplicate,
  index,
}: HeadingBlockProps) {
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

  const headingClasses = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold",
    3: "text-xl font-medium",
  }

  const HeadingTag = `h${block.content.level}` as keyof JSX.IntrinsicElements

  return (
    <BlockWrapper block={block} onDelete={onDelete} onDuplicate={onDuplicate} onAddBlock={onAddBlock} index={index}>
      {isEditing ? (
        <RichTextEditor
          content={text}
          onChange={setText}
          onSave={handleAddNewBlock}
          onCancel={handleCancel}
          placeholder={`Heading ${block.content.level}`}
          className={headingClasses[block.content.level]}
        />
      ) : (
        <HeadingTag className={cn("cursor-text text-foreground", headingClasses[block.content.level])}>
          <RichTextDisplay
            content={text}
            onClick={() => setIsEditing(true)}
            className={text ? "" : "text-muted-foreground"}
          />
        </HeadingTag>
      )}
    </BlockWrapper>
  )
}
