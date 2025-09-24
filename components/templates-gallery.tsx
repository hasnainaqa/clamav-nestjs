"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Eye } from "lucide-react"
import { blockTemplates, type BlockTemplate } from "@/types/templates"
import type { Block } from "@/types/blocks"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface TemplatesGalleryProps {
  onInsertTemplate: (blocks: Block[]) => void
}

export function TemplatesGallery({ onInsertTemplate }: TemplatesGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [previewTemplate, setPreviewTemplate] = useState<BlockTemplate | null>(null)

  const categories = ["all", ...Array.from(new Set(blockTemplates.map((t) => t.category)))]

  const filteredTemplates = blockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleInsertTemplate = (template: BlockTemplate) => {
    const blocks = template.blocks.map((block, index) => ({
      ...block,
      id: `${Date.now()}-${index}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) as unknown as Block[]
    onInsertTemplate(blocks)
  }

  const renderBlockPreview = (block: Omit<Block, "id" | "createdAt" | "updatedAt">) => {
    switch (block.type) {
      case "heading": {
        const b = block as any
        const HeadingTag = `h${b.content.level}` as keyof JSX.IntrinsicElements
        const headingClasses = {
          1: "text-lg font-bold",
          2: "text-base font-semibold",
          3: "text-sm font-medium",
        }
        return (
          <HeadingTag className={headingClasses[b.content.level as keyof typeof headingClasses]}>
            {b.content.text}
          </HeadingTag>
        )
      }
      case "text": {
        const b = block as any
        return <p className="text-sm text-muted-foreground">{b.content.text}</p>
      }
      case "bullet-list": {
        const b = block as any
        return (
          <ul className="text-sm text-muted-foreground list-disc list-inside">
            {b.content.items.slice(0, 3).map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
      }
      case "numbered-list": {
        const b = block as any
        return (
          <ol className="text-sm text-muted-foreground list-decimal list-inside">
            {b.content.items.slice(0, 3).map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        )
      }
      case "todo": {
        const b = block as any
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={b.content.completed} readOnly className="rounded" />
            {b.content.text}
          </div>
        )
      }
      case "quote": {
        const b = block as any
        return (
          <blockquote className="border-l-4 border-primary pl-4 text-sm text-muted-foreground italic">
            {b.content.text}
          </blockquote>
        )
      }
      case "code": {
        const b = block as any
        return (
          <pre className="bg-muted p-2 rounded text-xs font-mono text-muted-foreground">
            {b.content.code.slice(0, 100)}...
          </pre>
        )
      }
      case "form": {
        const b = block as any
        return (
          <div className="border rounded p-3 bg-muted/50">
            <h4 className="font-medium text-sm mb-2">{b.content.title}</h4>
            <div className="space-y-1">
              {b.content.fields.slice(0, 3).map((field: any, i: number) => (
                <div key={i} className="text-xs text-muted-foreground">
                  {field.label} ({field.type})
                </div>
              ))}
            </div>
          </div>
        )
      }
      case "divider":
        return <hr className="border-border" />
      case "image": {
        const b = block as any
        return (
          <div className="border rounded overflow-hidden bg-muted/50">
            <img
              src={b.content.url || "/placeholder.svg"}
              alt={b.content.altText || "Template image"}
              className="w-full h-20 object-cover"
            />
            {b.content.caption && <div className="p-2 text-xs text-muted-foreground">{b.content.caption}</div>}
          </div>
        )
      }
      default:
        return <div className="text-xs text-muted-foreground">Unknown block type</div>
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Block Templates</DialogTitle>
          <DialogDescription>
            Choose from pre-made templates to quickly add structured content to your page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category === "all" ? "All" : category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{template.icon}</span>
                            <div>
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              <Badge variant="secondary" className="text-xs mt-1">
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setPreviewTemplate(template)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleInsertTemplate(template)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-xs mb-3">{template.description}</CardDescription>
                        <div className="space-y-2 max-h-32 overflow-hidden">
                          {template.blocks.slice(0, 3).map((block, index) => (
                            <div key={index}>{renderBlockPreview(block)}</div>
                          ))}
                          {template.blocks.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{template.blocks.length - 3} more blocks...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Dialog */}
        {previewTemplate && (
          <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{previewTemplate.icon}</span>
                  {previewTemplate.name}
                </DialogTitle>
                <DialogDescription>{previewTemplate.description}</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4 pr-4">
                  {previewTemplate.blocks.map((block, index) => (
                    <div key={index} className="border-l-2 border-muted pl-4">
                      {renderBlockPreview(block)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleInsertTemplate(previewTemplate)
                    setPreviewTemplate(null)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Insert Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
