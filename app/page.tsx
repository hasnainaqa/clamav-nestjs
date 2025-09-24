"use client"

import { usePages } from "@/hooks/use-pages"
import { useTrash } from "@/hooks/use-trash"
import { useBlocks } from "@/hooks/use-blocks"
import { BlockRenderer } from "@/components/blocks/block-renderer"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { TemplatesGallery } from "@/components/templates-gallery"
import { TemplatesModal } from "@/components/templates-modal"
import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
import { useEffect, useCallback, useState, useMemo } from "react"
import { blockTemplates } from "@/types/templates"
import type { Block } from "@/types/blocks"

const PREDEFINED_PAGES = [
  "getting-started",
  "quick-note",
  "personal-home",
  "task-list",
  "journal",
  "reading-list",
  "kevin-cookie",
] as const

export default function NotionDashboard() {
  const {
    pages,
    currentPageId,
    setCurrentPageId,
    createPage,
    updatePage,
    deletePage,
    updatePageBlocks,
    duplicatePage,
  } = usePages()

  const { trashedPages, moveToTrash, restoreFromTrash, permanentlyDelete, emptyTrash } = useTrash()
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false)

  const currentPage = useMemo(() => {
    // Check regular pages first
    const regularPage = pages.find((page) => page.id === currentPageId)
    if (regularPage) {
      return regularPage
    }

    // Check predefined template pages
    if (PREDEFINED_PAGES.includes(currentPageId as any)) {
      const template = blockTemplates.find((t) => t.id === currentPageId)
      if (template) {
        const templateBlocks: Block[] = template.blocks.map((block, index) => ({
          ...block,
          id: `${template.id}-${index}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        })) as Block[]

        return {
          id: currentPageId,
          title: template.name,
          blocks: templateBlocks,
          icon: template.icon || "📄",
          coverPhoto: template.coverPhoto,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
    }

    return null
  }, [pages, currentPageId])

  const { blocks, addBlock, updateBlock, deleteBlock, duplicateBlock, setBlocks } = useBlocks(
    currentPage?.blocks || [],
    currentPage?.id,
  )


  const debouncedSave = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (pageId: string, newBlocks: Block[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        updatePageBlocks(pageId, newBlocks)
      }, 300)
    }
  }, [updatePageBlocks])

  useEffect(() => {
    if (currentPage && blocks.length > 0 && !PREDEFINED_PAGES.includes(currentPageId as any)) {
      const blocksChanged = JSON.stringify(blocks) !== JSON.stringify(currentPage.blocks)
      if (blocksChanged) {
        debouncedSave(currentPageId, blocks)
      }
    }
  }, [blocks, currentPage, currentPageId, debouncedSave])

  const handleInsertTemplate = useCallback(
    (templateBlocks: Block[]) => {
      setBlocks((prevBlocks) => [...prevBlocks, ...templateBlocks])
    },
    [setBlocks],
  )

  const handleCreatePage = useCallback(() => {
    const newPageId = createPage("Untitled")
    if (newPageId) {
      setCurrentPageId(newPageId)
    }
  }, [createPage, setCurrentPageId])

  const handleCreateFromTemplate = useCallback(
    (template: any) => {
      const newPageId = createPage(template.title)
      if (newPageId) {
        updatePageBlocks(newPageId, template.blocks)
        setCurrentPageId(newPageId)
      }
    },
    [createPage, updatePageBlocks, setCurrentPageId],
  )

  const handleDeletePage = useCallback(
    (pageId: string) => {
      const pageToDelete = pages.find((p) => p.id === pageId)
      if (pageToDelete) {
        moveToTrash(pageToDelete)
        deletePage(pageId)
      }
    },
    [pages, moveToTrash, deletePage],
  )

  const handleRestoreFromTrash = useCallback(
    (pageId: string) => {
      const restoredPage = restoreFromTrash(pageId)
      if (restoredPage) {
        const newPageId = createPage(restoredPage.title)
        if (newPageId) {
          updatePageBlocks(newPageId, restoredPage.blocks)
          setCurrentPageId(newPageId)
        }
      }
    },
    [restoreFromTrash, createPage, updatePageBlocks, setCurrentPageId],
  )

  const handlePageSelect = useCallback(
    (pageId: string) => {
      setCurrentPageId(pageId)
    },
    [setCurrentPageId],
  )

  if (!currentPage) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar
          pages={pages}
          currentPageId={currentPageId}
          onPageSelect={handlePageSelect}
          onPageCreate={handleCreatePage}
          onPageUpdate={updatePage}
          onPageDelete={handleDeletePage}
          onPageDuplicate={duplicatePage}
          trashedPages={trashedPages}
          onMoveToTrash={moveToTrash}
          onRestoreFromTrash={handleRestoreFromTrash}
          onPermanentDelete={permanentlyDelete}
          onEmptyTrash={emptyTrash}
          onCreateFromTemplate={handleCreateFromTemplate}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">No page selected</h2>
            <Button onClick={() => setIsTemplatesModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first page
            </Button>
          </div>
        </div>
        <TemplatesModal
          isOpen={isTemplatesModalOpen}
          onClose={() => setIsTemplatesModalOpen(false)}
          onSelectTemplate={handleCreateFromTemplate}
        />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        pages={pages}
        currentPageId={currentPageId}
        onPageSelect={handlePageSelect}
        onPageCreate={handleCreatePage}
        onPageUpdate={updatePage}
        onPageDelete={handleDeletePage}
        onPageDuplicate={duplicatePage}
        trashedPages={trashedPages}
        onMoveToTrash={moveToTrash}
        onRestoreFromTrash={handleRestoreFromTrash}
        onPermanentDelete={permanentlyDelete}
        onEmptyTrash={emptyTrash}
        onCreateFromTemplate={handleCreateFromTemplate}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader
          page={currentPage}
          onUpdatePage={updatePage}
          onDeletePage={handleDeletePage}
          onDuplicatePage={duplicatePage}
        />

        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-8 px-6">
            <div className="space-y-1">
              {blocks.map((block, index) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  onUpdate={updateBlock}
                  onDelete={deleteBlock}
                  onAddBlock={addBlock}
                  onDuplicate={duplicateBlock}
                  index={index}
                />
              ))}

              {blocks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Start writing or add a block to get started</p>
                  <div className="flex items-center justify-center gap-2">
                    <Button onClick={() => addBlock("text")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Add your first block
                    </Button>
                    <TemplatesGallery onInsertTemplate={handleInsertTemplate} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={handleCreateFromTemplate}
      />
    </div>
  )
}
