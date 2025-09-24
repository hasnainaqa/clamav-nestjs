"use client"

import type React from "react"
import type { BulletListBlock } from "@/types/blocks"
import { BlockWrapper } from "./block-wrapper"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

interface BulletListBlockProps {
  block: BulletListBlock
  onUpdate: (id: string, content: any) => void
  onDelete: (id: string) => void
  onAddBlock: (type: import("@/types/blocks").Block["type"], index?: number) => void
  onDuplicate: (id: string) => void
  index: number
}

export function BulletListBlockComponent({
  block,
  onUpdate,
  onDelete,
  onAddBlock,
  onDuplicate,
  index,
}: BulletListBlockProps) {
  const updateItem = (itemIndex: number, value: string) => {
    const newItems = [...block.content.items]
    newItems[itemIndex] = value
    onUpdate(block.id, { ...block.content, items: newItems })
  }

  const addItem = () => {
    const newItems = [...block.content.items, ""]
    onUpdate(block.id, { ...block.content, items: newItems })
  }

  const removeItem = (itemIndex: number) => {
    if (block.content.items.length > 1) {
      const newItems = block.content.items.filter((_, i) => i !== itemIndex)
      onUpdate(block.id, { ...block.content, items: newItems })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, itemIndex: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addItem()
    } else if (e.key === "Backspace" && block.content.items[itemIndex] === "" && block.content.items.length > 1) {
      e.preventDefault()
      removeItem(itemIndex)
    }
  }

  return (
    <BlockWrapper block={block} onDelete={onDelete} onDuplicate={onDuplicate} onAddBlock={onAddBlock} index={index}>
      <div className="space-y-2">
        {block.content.items.map((item, itemIndex) => (
          <div key={itemIndex} className="flex items-center gap-3">
            <span className="text-muted-foreground">•</span>
            <input
              value={item}
              onChange={(e) => updateItem(itemIndex, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, itemIndex)}
              className="flex-1 border-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
              placeholder="List item"
            />
            {block.content.items.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(itemIndex)}
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
              >
                <Minus className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={addItem} className="h-6 w-6 p-0 opacity-60 hover:opacity-100">
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </BlockWrapper>
  )
}
