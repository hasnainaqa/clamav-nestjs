"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import type { Block } from "@/types/blocks"

export function useBlocks(initialBlocks: Block[] = [], sourceKey?: string) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)

  // Only reset blocks when the sourceKey changes (e.g., pageId),
  // so in-progress edits are not overwritten by delayed saves.
  useEffect(() => {
    setBlocks(initialBlocks)
  }, [sourceKey])

  const generateUniqueId = useCallback(() => {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const addBlock = useCallback(
    (type: Block["type"], index?: number) => {
      const newBlock: Block = {
        id: generateUniqueId(),
        type,
        content: getDefaultContent(type),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Block

      setBlocks((prev) => {
        if (index !== undefined) {
          const newBlocks = [...prev]
          newBlocks.splice(index + 1, 0, newBlock)
          return newBlocks
        }
        return [...prev, newBlock]
      })

      return newBlock.id
    },
    [generateUniqueId],
  )

  const updateBlock = useCallback((id: string, content: any) => {
    if (!id) {
      console.warn("[v0] Attempted to update block with undefined ID")
      return
    }

    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, content, updatedAt: new Date() } : block)))
  }, [])

  const deleteBlock = useCallback((id: string) => {
    if (!id) {
      console.warn("[v0] Attempted to delete block with undefined ID")
      return
    }

    console.log("[v0] Deleting block:", id)
    setBlocks((prev) => prev.filter((block) => block.id !== id))
  }, [])

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) {
        return prev
      }

      const newBlocks = [...prev]
      const [movedBlock] = newBlocks.splice(fromIndex, 1)
      newBlocks.splice(toIndex, 0, movedBlock)
      return newBlocks
    })
  }, [])

  const duplicateBlock = useCallback(
    (id: string) => {
      if (!id) {
        console.warn("[v0] Attempted to duplicate block with undefined ID")
        return
      }

      setBlocks((prev) => {
        const blockIndex = prev.findIndex((b) => b.id === id)
        const block = prev[blockIndex]
        if (!block) {
          console.warn("[v0] Block not found for duplication:", id)
          return prev
        }

        const duplicatedBlock: Block = {
          ...block,
          id: generateUniqueId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const newBlocks = [...prev]
        newBlocks.splice(blockIndex + 1, 0, duplicatedBlock)
        return newBlocks
      })
    },
    [generateUniqueId],
  )

  const blockCount = useMemo(() => blocks.length, [blocks.length])

  return {
    blocks,
    blockCount,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    duplicateBlock,
    setBlocks,
  }
}

// Enhanced default content generator with better defaults
function getDefaultContent(type: Block["type"]): any {
  switch (type) {
    case "text":
      return { text: "" }
    case "heading":
      return { text: "Heading", level: 1 }
    case "todo":
      return { text: "New task", completed: false }
    case "form":
      return { title: "New Form", fields: [] }
    case "bullet-list":
      return { items: [""] }
    case "numbered-list":
      return { items: [""] }
    case "quote":
      return { text: "Quote text" }
    case "code":
      return { code: "", language: "javascript" }
    case "image":
      return { url: "", alt: "", caption: "" }
    case "divider":
      return {}
    default:
      return {}
  }
}
