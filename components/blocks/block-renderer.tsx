"use client"

import type {
  Block,
  TextBlock,
  HeadingBlock,
  TodoBlock,
  FormBlock,
  BulletListBlock,
  NumberedListBlock,
  QuoteBlock,
  CodeBlock,
  DividerBlock,
  ImageBlock as ImageBlockType,
} from "@/types/blocks"
import { BlockWrapper } from "./block-wrapper"
import { TextBlockComponent } from "./text-block"
import { HeadingBlockComponent } from "./heading-block"
import { TodoBlockComponent } from "./todo-block"
import { FormBlockComponent } from "./form-block"
import { BulletListBlockComponent } from "./bullet-list-block"
import { NumberedListBlockComponent } from "./numbered-list-block"
import { QuoteBlockComponent } from "./quote-block"
import { CodeBlockComponent } from "./code-block"
import { DividerBlockComponent } from "./divider-block"
import { ImageBlock } from "./image-block"

interface BlockRendererProps {
  block: Block
  onUpdate: (id: string, content: any) => void
  onDelete: (id: string) => void
  onAddBlock: (type: Block["type"], index?: number) => void
  onDuplicate: (id: string) => void
  index: number
}

export function BlockRenderer({ block, onUpdate, onDelete, onAddBlock, onDuplicate, index }: BlockRendererProps) {
  if (!block || !block.id) {
    console.error("[v0] BlockRenderer received invalid block:", block)
    return null
  }

  const handleDelete = (id: string) => {
    if (!id) {
      console.error("[v0] Delete called with undefined ID")
      return
    }
    console.log("[v0] Deleting block:", id)
    onDelete(id)
  }

  const handleDuplicate = (id: string) => {
    if (!id) {
      console.error("[v0] Duplicate called with undefined ID")
      return
    }
    console.log("[v0] Duplicating block:", id)
    onDuplicate(id)
  }

  const handleAddBlock = (type: Block["type"], insertIndex?: number) => {
    const targetIndex = insertIndex !== undefined ? insertIndex : index + 1
    console.log("[v0] Adding block of type:", type, "at index:", targetIndex)
    onAddBlock(type, targetIndex)
  }

  const handleUpdate = (updates: Partial<Block>) => {
    if (!block.id) {
      console.error("[v0] Update called with undefined block ID")
      return
    }
    onUpdate(block.id, updates.content)
  }

  const renderBlockContent = () => {
    switch (block.type) {
      case "text":
        return (
          <TextBlockComponent
            block={block as TextBlock}
            onUpdate={onUpdate}
            onDelete={handleDelete}
            onAddBlock={handleAddBlock}
            onDuplicate={handleDuplicate}
            index={index}
          />
        )
      case "heading":
        return (
          <HeadingBlockComponent
            block={block as HeadingBlock}
            onUpdate={onUpdate}
            onDelete={handleDelete}
            onAddBlock={handleAddBlock}
            onDuplicate={handleDuplicate}
            index={index}
          />
        )
      case "todo":
        return (
          <TodoBlockComponent
            block={block as TodoBlock}
            onUpdate={onUpdate}
            onDelete={handleDelete}
            onAddBlock={handleAddBlock}
            onDuplicate={handleDuplicate}
            index={index}
          />
        )
      case "form":
        return (
          <FormBlockComponent
            block={block as FormBlock}
            onUpdate={onUpdate}
            onDelete={handleDelete}
            onAddBlock={handleAddBlock}
            onDuplicate={handleDuplicate}
            index={index}
          />
        )
      case "bullet-list":
        return (
          <BulletListBlockComponent
            block={block as BulletListBlock}
            onUpdate={onUpdate}
            onDelete={handleDelete}
            onAddBlock={handleAddBlock}
            onDuplicate={handleDuplicate}
            index={index}
          />
        )
      case "numbered-list":
        return (
          <NumberedListBlockComponent
            block={block as NumberedListBlock}
            onUpdate={onUpdate}
            onDelete={handleDelete}
            onAddBlock={handleAddBlock}
            onDuplicate={handleDuplicate}
            index={index}
          />
        )
      case "quote":
        return (
          <QuoteBlockComponent
            block={block as QuoteBlock}
            onUpdate={onUpdate}
            onDelete={handleDelete}
            onAddBlock={handleAddBlock}
            onDuplicate={handleDuplicate}
            index={index}
          />
        )
      case "code":
        return (
          <CodeBlockComponent
            block={block as CodeBlock}
            onUpdate={onUpdate}
            onDelete={handleDelete}
            onAddBlock={handleAddBlock}
            onDuplicate={handleDuplicate}
            index={index}
          />
        )
      case "divider":
        return (
          <DividerBlockComponent
            block={block as DividerBlock}
            onUpdate={onUpdate}
            onDelete={handleDelete}
            onAddBlock={handleAddBlock}
            onDuplicate={handleDuplicate}
            index={index}
          />
        )
      case "image":
        return (
          <ImageBlock
            block={block as ImageBlockType}
            onUpdate={handleUpdate}
            onDelete={() => handleDelete(block.id)}
            isEditing={true}
          />
        )
      default:
        return <div>Unknown block type</div>
    }
  }

  return (
    <div id={`block-${block.id}`} className="scroll-mt-4">
      <BlockWrapper
        block={block}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onAddBlock={handleAddBlock}
        index={index}
      >
        {renderBlockContent()}
      </BlockWrapper>
    </div>
  )
}
