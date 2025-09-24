"use client"

import { useState, useCallback } from "react"
import type { Page, Block } from "@/types/blocks"

export function usePages() {
  const [pages, setPages] = useState<Page[]>([
    {
      id: "1",
      title: "Getting Started",
      blocks: [
        {
          id: "1",
          type: "heading",
          content: { text: "Welcome to Your Notion-Style Workspace", level: 1 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          type: "text",
          content: {
            text: "This is a fully functional Notion-like editor with block-based editing. Click on any text to edit it, or use the + button to add new blocks.",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
  const [currentPageId, setCurrentPageId] = useState<string>("1")

  const currentPage = pages.find((page) => page.id === currentPageId)

  const createPage = useCallback((title = "Untitled", parentId?: string) => {
    const newPage: Page = {
      id: Date.now().toString(),
      title,
      blocks: [
        {
          id: Date.now().toString() + "-1",
          type: "text",
          content: { text: "" },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      parentId,
    }

    setPages((prev) => [...prev, newPage])
    setCurrentPageId(newPage.id)
    return newPage.id
  }, [])

  const updatePage = useCallback((pageId: string, updates: Partial<Page>) => {
    setPages((prev) => prev.map((page) => (page.id === pageId ? { ...page, ...updates, updatedAt: new Date() } : page)))
  }, [])

  const deletePage = useCallback(
    (pageId: string) => {
      setPages((prev) => {
        const remainingPages = prev.filter((page) => page.id !== pageId)
        if (currentPageId === pageId && remainingPages.length > 0) {
          setCurrentPageId(remainingPages[0].id)
        }
        return remainingPages
      })
    },
    [currentPageId], // Keep only currentPageId dependency
  )

  const updatePageBlocks = useCallback((pageId: string, blocks: Block[]) => {
    setPages((prev) => prev.map((page) => (page.id === pageId ? { ...page, blocks, updatedAt: new Date() } : page)))
  }, [])

  const duplicatePage = useCallback(
    (pageId: string) => {
      setPages((prev) => {
        const page = prev.find((p) => p.id === pageId)
        if (!page) return prev

        const duplicatedPage: Page = {
          ...page,
          id: Date.now().toString(),
          title: `${page.title} (Copy)`,
          blocks: page.blocks.map((block) => ({
            ...block,
            id: Date.now().toString() + Math.random().toString(),
          })),
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        return [...prev, duplicatedPage]
      })
      return Date.now().toString()
    },
    [], // Remove pages dependency to prevent infinite re-renders
  )

  const getPagesByParent = useCallback(
    (parentId?: string) => {
      return pages.filter((page) => page.parentId === parentId)
    },
    [pages],
  )

  return {
    pages,
    currentPage,
    currentPageId,
    setCurrentPageId,
    createPage,
    updatePage,
    deletePage,
    updatePageBlocks,
    duplicatePage,
    getPagesByParent,
  }
}
