"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  FileText,
  ImageIcon,
  FormInput,
  Search,
} from "lucide-react"
import type { Block } from "@/types/blocks"

interface BlockMenuProps {
  onSelectBlock: (type: Block["type"]) => void
  onClose: () => void
  position: { x: number; y: number }
}

const blockTypes = [
  {
    category: "BASIC BLOCKS",
    blocks: [
      { type: "text" as const, icon: Type, label: "Text", description: "Just start writing with plain text." },
      { type: "heading" as const, icon: Heading1, label: "Heading 1", description: "Big section heading." },
      { type: "heading" as const, icon: Heading2, label: "Heading 2", description: "Medium section heading." },
      { type: "heading" as const, icon: Heading3, label: "Heading 3", description: "Small section heading." },
      {
        type: "bullet-list" as const,
        icon: List,
        label: "Bulleted list",
        description: "Create a simple bulleted list.",
      },
      {
        type: "numbered-list" as const,
        icon: ListOrdered,
        label: "Numbered list",
        description: "Create a list with numbering.",
      },
      { type: "todo" as const, icon: CheckSquare, label: "To-do list", description: "Track tasks with a to-do list." },
    ],
  },
  {
    category: "MEDIA",
    blocks: [{ type: "image" as const, icon: ImageIcon, label: "Image", description: "Upload or embed with a link." }],
  },
  {
    category: "ADVANCED BLOCKS",
    blocks: [
      { type: "quote" as const, icon: Quote, label: "Quote", description: "Capture a quote." },
      { type: "code" as const, icon: Code, label: "Code", description: "Capture a code snippet." },
      { type: "divider" as const, icon: Minus, label: "Divider", description: "Visually divide blocks." },
      { type: "form" as const, icon: FormInput, label: "Form", description: "Create interactive forms." },
    ],
  },
]

export function BlockMenu({ onSelectBlock, onClose, position }: BlockMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBlocks = blockTypes
    .map((category) => ({
      ...category,
      blocks: category.blocks.filter(
        (block) =>
          block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          block.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.blocks.length > 0)

  const handleBlockSelect = (type: Block["type"], level?: number) => {
    if (type === "heading" && level) {
      // For headings, we need to pass the level in the content
      onSelectBlock(type)
    } else {
      onSelectBlock(type)
    }
    onClose()
  }

  return (
    <Card
      className="absolute z-50 w-80 max-h-96 overflow-y-auto shadow-lg border"
      style={{
        left: position.x,
        top: position.y,
        transform: "translateY(-100%)",
      }}
    >
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Type to filter"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="space-y-4">
          {filteredBlocks.map((category) => (
            <div key={category.category}>
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">{category.category}</div>
              <div className="space-y-1">
                {category.blocks.map((block) => {
                  const Icon = block.icon
                  return (
                    <Button
                      key={`${block.type}-${block.label}`}
                      variant="ghost"
                      className="w-full justify-start h-auto p-2 text-left"
                      onClick={() => {
                        if (block.type === "heading") {
                          const level = block.label.includes("1") ? 1 : block.label.includes("2") ? 2 : 3
                          handleBlockSelect(block.type, level)
                        } else {
                          handleBlockSelect(block.type)
                        }
                      }}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{block.label}</div>
                          <div className="text-xs text-muted-foreground">{block.description}</div>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredBlocks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No blocks found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
