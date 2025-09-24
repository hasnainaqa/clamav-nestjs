"use client"

import type { DividerBlock } from "@/types/blocks"
import { BlockWrapper } from "./block-wrapper"

interface DividerBlockProps {
  block: DividerBlock
  onUpdate: (id: string, content: any) => void
  onDelete: (id: string) => void
  onAddBlock: (type: import("@/types/blocks").Block["type"], index?: number) => void
  onDuplicate: (id: string) => void
  index: number
}

export function DividerBlockComponent({
  block,
  onUpdate,
  onDelete,
  onAddBlock,
  onDuplicate,
  index,
}: DividerBlockProps) {
  return (
    <BlockWrapper block={block} onDelete={onDelete} onDuplicate={onDuplicate} onAddBlock={onAddBlock} index={index}>
      <hr className="border-border my-4" />
    </BlockWrapper>
  )
}
