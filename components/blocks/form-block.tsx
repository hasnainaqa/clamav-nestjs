"use client"
import type { FormBlock } from "@/types/blocks"
import { BlockWrapper } from "./block-wrapper"
import { AdvancedFormBuilder } from "../advanced-form-builder"

interface FormBlockProps {
  block: FormBlock
  onUpdate: (id: string, content: any) => void
  onDelete: (id: string) => void
  onAddBlock: (type: import("@/types/blocks").Block["type"], index?: number) => void
  onDuplicate: (id: string) => void
  index: number
}

export function FormBlockComponent({ block, onUpdate, onDelete, onAddBlock, onDuplicate, index }: FormBlockProps) {
  const handleFormUpdate = (fields: any[], title: string) => {
    onUpdate(block.id, {
      ...block.content,
      title,
      fields,
    })
  }

  return (
    <BlockWrapper block={block} onDelete={onDelete} onDuplicate={onDuplicate} onAddBlock={onAddBlock} index={index}>
      <AdvancedFormBuilder
        title={block.content.title}
        fields={block.content.fields || []}
        onUpdate={handleFormUpdate}
        submissions={block.content.submissions || []}
      />
    </BlockWrapper>
  )
}
