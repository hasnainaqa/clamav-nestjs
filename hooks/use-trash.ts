"use client"

import { useState, useCallback } from "react"
import type { Page } from "@/types/blocks"

interface TrashItem extends Page {
  deletedAt: Date
}

export function useTrash() {
  const [trashedPages, setTrashedPages] = useState<TrashItem[]>([])

  const moveToTrash = useCallback((page: Page) => {
    const trashedPage: TrashItem = {
      ...page,
      deletedAt: new Date(),
    }
    setTrashedPages((prev) => [...prev, trashedPage])
  }, [])

  const restoreFromTrash = useCallback(
    (pageId: string) => {
      const page = trashedPages.find((p) => p.id === pageId)
      if (page) {
        setTrashedPages((prev) => prev.filter((p) => p.id !== pageId))
        return page
      }
      return null
    },
    [trashedPages],
  )

  const permanentlyDelete = useCallback((pageId: string) => {
    setTrashedPages((prev) => prev.filter((p) => p.id !== pageId))
  }, [])

  const emptyTrash = useCallback(() => {
    setTrashedPages([])
  }, [])

  return {
    trashedPages,
    moveToTrash,
    restoreFromTrash,
    permanentlyDelete,
    emptyTrash,
  }
}
