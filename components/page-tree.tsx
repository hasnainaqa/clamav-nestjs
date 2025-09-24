"use client"

import { useState } from "react"
import type { Page } from "@/types/blocks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { FileText, ChevronRight, ChevronDown, MoreHorizontal, Plus, Copy, Trash2, Edit } from "lucide-react"

interface PageTreeProps {
  pages: Page[]
  currentPageId: string
  onPageSelect: (pageId: string) => void
  onPageCreate: (title?: string, parentId?: string) => void
  onPageUpdate: (pageId: string, updates: Partial<Page>) => void
  onPageDelete: (pageId: string) => void
  onPageDuplicate: (pageId: string) => void
  isCollapsed?: boolean
  parentId?: string
  level?: number
}

export function PageTree({
  pages,
  currentPageId,
  onPageSelect,
  onPageCreate,
  onPageUpdate,
  onPageDelete,
  onPageDuplicate,
  isCollapsed = false,
  parentId,
  level = 0,
}: PageTreeProps) {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(["root"]))
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  const filteredPages = pages.filter((page) => page.parentId === parentId)

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages)
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId)
    } else {
      newExpanded.add(pageId)
    }
    setExpandedPages(newExpanded)
  }

  const startEditing = (page: Page) => {
    setEditingPageId(page.id)
    setEditingTitle(page.title)
  }

  const saveEdit = (pageId: string) => {
    if (editingTitle.trim()) {
      onPageUpdate(pageId, { title: editingTitle.trim() })
    }
    setEditingPageId(null)
    setEditingTitle("")
  }

  const cancelEdit = () => {
    setEditingPageId(null)
    setEditingTitle("")
  }

  if (isCollapsed) {
    return (
      <div className="space-y-1">
        {filteredPages.map((page) => (
          <Button
            key={page.id}
            variant={currentPageId === page.id ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-center p-2"
            onClick={() => onPageSelect(page.id)}
          >
            <FileText className="h-4 w-4" />
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {filteredPages.map((page) => {
        const hasChildren = pages.some((p) => p.parentId === page.id)
        const isExpanded = expandedPages.has(page.id)
        const isEditing = editingPageId === page.id

        return (
          <div key={page.id}>
            <div
              className={cn(
                "group flex items-center gap-1 rounded-md hover:bg-sidebar-accent",
                currentPageId === page.id && "bg-sidebar-accent",
              )}
              style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
              {hasChildren ? (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleExpanded(page.id)}>
                  {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </Button>
              ) : (
                <div className="w-6" />
              )}

              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />

              {isEditing ? (
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => saveEdit(page.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveEdit(page.id)
                    } else if (e.key === "Escape") {
                      cancelEdit()
                    }
                  }}
                  className="h-6 text-sm flex-1 min-w-0"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => onPageSelect(page.id)}
                  className="flex-1 text-left text-sm truncate hover:text-foreground text-sidebar-foreground"
                >
                  {page.title}
                </button>
              )}

              <div className="opacity-0 group-hover:opacity-100 flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onPageCreate("Untitled", page.id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => startEditing(page)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPageDuplicate(page.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPageDelete(page.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {hasChildren && isExpanded && (
              <PageTree
                pages={pages}
                currentPageId={currentPageId}
                onPageSelect={onPageSelect}
                onPageCreate={onPageCreate}
                onPageUpdate={onPageUpdate}
                onPageDelete={onPageDelete}
                onPageDuplicate={onPageDuplicate}
                parentId={page.id}
                level={level + 1}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
