"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, FileText, Pin, Home, CheckSquare, Grid3X3, Book } from "lucide-react"
import type { Block } from "@/types/blocks"

interface Template {
  id: string
  title: string
  description: string
  category: string
  icon: any
  blocks: Block[]
}

const templates: Template[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "A comprehensive guide to help you get started with your workspace",
    category: "Documentation",
    icon: FileText,
    blocks: [
      {
        id: "1",
        type: "heading",
        content: { text: "Welcome to Your Workspace! 🎉", level: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        type: "text",
        content: { text: "This is your getting started guide. Here's what you can do:" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        type: "todo",
        content: { text: "Create your first page", completed: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        type: "todo",
        content: { text: "Add some content blocks", completed: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        type: "todo",
        content: { text: "Organize your workspace", completed: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "quick-note",
    title: "Quick Note",
    description: "A simple template for jotting down quick thoughts and ideas",
    category: "Notes",
    icon: Pin,
    blocks: [
      {
        id: "1",
        type: "heading",
        content: { text: "Quick Note", level: 2 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        type: "text",
        content: { text: "Date: " + new Date().toLocaleDateString() },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        type: "text",
        content: { text: "Start writing your thoughts here..." },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "personal-home",
    title: "Personal Home",
    description: "Your personal dashboard with goals, habits, and daily planning",
    category: "Personal",
    icon: Home,
    blocks: [
      {
        id: "1",
        type: "heading",
        content: { text: "Personal Dashboard", level: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        type: "heading",
        content: { text: "Today's Goals", level: 2 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        type: "todo",
        content: { text: "Morning workout", completed: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        type: "todo",
        content: { text: "Review project progress", completed: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        type: "heading",
        content: { text: "Notes", level: 2 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "6",
        type: "text",
        content: { text: "Add your daily reflections here..." },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "task-list",
    title: "Task List",
    description: "Organize and track your tasks with priorities and deadlines",
    category: "Productivity",
    icon: CheckSquare,
    blocks: [
      {
        id: "1",
        type: "heading",
        content: { text: "Task Management", level: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        type: "heading",
        content: { text: "High Priority", level: 2 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        type: "todo",
        content: { text: "Complete project proposal", completed: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        type: "heading",
        content: { text: "Medium Priority", level: 2 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        type: "todo",
        content: { text: "Review team feedback", completed: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "6",
        type: "heading",
        content: { text: "Low Priority", level: 2 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "7",
        type: "todo",
        content: { text: "Organize workspace", completed: false },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "journal",
    title: "Journal",
    description: "Daily journaling template with prompts and reflection questions",
    category: "Personal",
    icon: Grid3X3,
    blocks: [
      {
        id: "1",
        type: "heading",
        content: { text: "Daily Journal - " + new Date().toLocaleDateString(), level: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        type: "heading",
        content: { text: "How am I feeling today?", level: 3 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        type: "text",
        content: { text: "Write about your current mood and energy level..." },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        type: "heading",
        content: { text: "What am I grateful for?", level: 3 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        type: "text",
        content: { text: "List three things you're grateful for today..." },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "6",
        type: "heading",
        content: { text: "What did I learn today?", level: 3 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "7",
        type: "text",
        content: { text: "Reflect on new insights or lessons learned..." },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "reading-list",
    title: "Reading List",
    description: "Track books, articles, and other reading materials",
    category: "Learning",
    icon: Book,
    blocks: [
      {
        id: "1",
        type: "heading",
        content: { text: "My Reading List 📚", level: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        type: "heading",
        content: { text: "Currently Reading", level: 2 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        type: "text",
        content: { text: "• Book title - Author name (Progress: 0%)" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        type: "heading",
        content: { text: "Want to Read", level: 2 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        type: "text",
        content: { text: "• Add books you want to read here..." },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "6",
        type: "heading",
        content: { text: "Completed", level: 2 },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "7",
        type: "text",
        content: { text: "• Books you've finished will go here..." },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
]

interface TemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTemplate: (template: Template) => void
}

export function TemplatesModal({ isOpen, onClose, onSelectTemplate }: TemplatesModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(templates.map((t) => t.category)))

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredTemplates.map((template) => {
              const Icon = template.icon
              return (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    onSelectTemplate(template)
                    onClose()
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{template.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">{template.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
