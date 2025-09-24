"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Page } from "@/types/blocks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoreHorizontal, Star, Share, Copy, Trash2, Smile, ImageIcon, X, Home, FileText as LucideFileText, CheckSquare, Book, Settings, Plus, Calendar } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"

interface PageHeaderProps {
  page: Page
  onUpdatePage: (pageId: string, updates: Partial<Page>) => void
  onDeletePage: (pageId: string) => void
  onDuplicatePage: (pageId: string) => void
}

const commonEmojis = [
  "📄",
  "📝",
  "📋",
  "📊",
  "📈",
  "📉",
  "📌",
  "📍",
  "🏠",
  "🏢",
  "💼",
  "📚",
  "📖",
  "📓",
  "📔",
  "📕",
  "📗",
  "📘",
  "📙",
  "📒",
  "✅",
  "❌",
  "⭐",
  "🎯",
  "🚀",
  "💡",
  "🔥",
  "⚡",
  "🌟",
  "🎉",
  "📅",
  "⏰",
  "🔔",
  "📞",
  "💬",
  "📧",
  "🌐",
  "🔗",
  "🔍",
  "⚙️",
]

export function PageHeader({ page, onUpdatePage, onDeletePage, onDuplicatePage }: PageHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(page.title)
  const [showCoverUpload, setShowCoverUpload] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingTitle])

  const handleSaveTitle = () => {
    if (title.trim() && title !== page.title) {
      onUpdatePage(page.id, { title: title.trim() })
    } else {
      setTitle(page.title)
    }
    setIsEditingTitle(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle()
    } else if (e.key === "Escape") {
      setTitle(page.title)
      setIsEditingTitle(false)
    }
  }

  const handleIconSelect = (emoji: string) => {
    onUpdatePage(page.id, { icon: emoji, iconLucide: undefined, iconImage: undefined })
  }

  const handleRemoveIcon = () => {
    onUpdatePage(page.id, { icon: undefined, iconLucide: undefined, iconImage: undefined })
  }

  const handleLucideIconSelect = (name: string) => {
    onUpdatePage(page.id, { iconLucide: name, icon: undefined, iconImage: undefined })
  }

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const url = String(reader.result)
      onUpdatePage(page.id, { iconImage: { url, width: 20, height: 20 }, icon: undefined, iconLucide: undefined })
    }
    reader.readAsDataURL(file)
  }

  const updateIconSize = (dimension: "width" | "height", value: number) => {
    const current = page.iconImage || { url: "" }
    if (!current.url) return
    onUpdatePage(page.id, { iconImage: { ...current, [dimension]: value } })
  }

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const url = String(reader.result)
        onUpdatePage(page.id, { coverPhoto: url })
        setShowCoverUpload(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveCover = () => {
    onUpdatePage(page.id, { coverPhoto: undefined })
  }

  return (
    <div className="relative">
      {page.coverPhoto && (
        <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url(${page.coverPhoto})` }}>
          <div className="absolute inset-0 bg-black/20" />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black"
            onClick={handleRemoveCover}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <header className="border-b border-border px-6 py-4">
        {!page.coverPhoto && (
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Add cover
            </Button>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onUpdatePage(page.id, {
                    coverPhoto: `/placeholder.svg?height=300&width=800&query=minimalist workspace with clean desk and plants`,
                  })
                }
              >
                🌿 Workspace
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onUpdatePage(page.id, {
                    coverPhoto: `/placeholder.svg?height=300&width=800&query=abstract geometric pattern in blue and purple`,
                  })
                }
              >
                🎨 Abstract
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onUpdatePage(page.id, {
                    coverPhoto: `/placeholder.svg?height=300&width=800&query=peaceful nature landscape with mountains and sky`,
                  })
                }
              >
                🏔️ Nature
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onUpdatePage(page.id, {
                    coverPhoto: `/placeholder.svg?height=300&width=800&query=modern city skyline at sunset with warm colors`,
                  })
                }
              >
                🏙️ City
              </Button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {(page.iconImage?.url || page.iconLucide || page.icon) ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="text-2xl p-1 h-auto hover:bg-muted/50">
                      {page.iconImage?.url ? (
                        <img
                          src={page.iconImage.url}
                          alt="icon"
                          style={{ width: page.iconImage.width ?? 20, height: page.iconImage.height ?? 20 }}
                        />
                      ) : page.iconLucide ? (
                        (() => {
                          const IconMap: Record<string, React.ComponentType<any>> = {
                            Home,
                            Star,
                            FileText: LucideFileText,
                            CheckSquare,
                            Book,
                            Settings,
                            Smile,
                            Plus,
                            Calendar,
                          }
                          const IconComp = IconMap[page.iconLucide]
                          return IconComp ? <IconComp className="h-5 w-5" /> : <Smile className="h-5 w-5" />
                        })()
                      ) : (
                        <span>{page.icon}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Icon</h4>
                        <Button variant="ghost" size="sm" onClick={handleRemoveIcon}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <div className="text-xs font-medium mb-1">Emojis</div>
                        <div className="grid grid-cols-8 gap-2">
                          {commonEmojis.map((emoji) => (
                            <Button
                              key={emoji}
                              variant="ghost"
                              className="text-xl p-2 h-auto hover:bg-muted"
                              onClick={() => handleIconSelect(emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium mb-1">Lucide Icons</div>
                        <div className="grid grid-cols-8 gap-2">
                          {[
                            "Home",
                            "Star",
                            "FileText",
                            "CheckSquare",
                            "Book",
                            "Settings",
                            "Smile",
                            "Plus",
                            "Calendar",
                          ].map((name) => {
                            const IconMap: Record<string, React.ComponentType<any>> = {
                              Home,
                              Star,
                              FileText: LucideFileText,
                              CheckSquare,
                              Book,
                              Settings,
                              Smile,
                              Plus,
                              Calendar,
                            }
                            const Cmp = IconMap[name]
                            return (
                              <Button key={name} variant="ghost" className="p-2 h-auto" onClick={() => handleLucideIconSelect(name)}>
                                {Cmp ? <Cmp className="h-5 w-5" /> : <Smile className="h-5 w-5" />}
                              </Button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium mb-1">Upload Icon</div>
                        <input type="file" accept="image/*" onChange={handleIconUpload} className="text-xs" />
                        {page.iconImage?.url && (
                          <div className="mt-2 flex items-center gap-2">
                            <label className="text-xs">W</label>
                            <input
                              type="number"
                              className="w-16 border rounded px-1 py-0.5 text-xs"
                              value={page.iconImage.width ?? 20}
                              onChange={(e) => updateIconSize("width", Number(e.target.value) || 20)}
                            />
                            <label className="text-xs">H</label>
                            <input
                              type="number"
                              className="w-16 border rounded px-1 py-0.5 text-xs"
                              value={page.iconImage.height ?? 20}
                              onChange={(e) => updateIconSize("height", Number(e.target.value) || 20)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Smile className="h-4 w-4 mr-2" />
                      Add icon
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-medium mb-1">Emojis</div>
                        <div className="grid grid-cols-8 gap-2">
                          {commonEmojis.map((emoji) => (
                            <Button
                              key={emoji}
                              variant="ghost"
                              className="text-xl p-2 h-auto hover:bg-muted"
                              onClick={() => handleIconSelect(emoji)}
                            >
                              {emoji}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium mb-1">Lucide Icons</div>
                        <div className="grid grid-cols-8 gap-2">
                          {[
                            "Home",
                            "Star",
                            "FileText",
                            "CheckSquare",
                            "Book",
                            "Settings",
                            "Smile",
                            "Plus",
                            "Calendar",
                          ].map((name) => {
                            const IconMap: Record<string, React.ComponentType<any>> = {
                              Home,
                              Star,
                              FileText: LucideFileText,
                              CheckSquare,
                              Book,
                              Settings,
                              Smile,
                              Plus,
                              Calendar,
                            }
                            const Cmp = IconMap[name]
                            return (
                              <Button key={name} variant="ghost" className="p-2 h-auto" onClick={() => handleLucideIconSelect(name)}>
                                {Cmp ? <Cmp className="h-5 w-5" /> : <Smile className="h-5 w-5" />}
                              </Button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium mb-1">Upload Icon</div>
                        <input type="file" accept="image/*" onChange={handleIconUpload} className="text-xs" />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {isEditingTitle ? (
              <Input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyDown}
                className="text-2xl font-semibold border-none shadow-none p-0 h-auto bg-transparent"
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-2xl font-semibold text-foreground cursor-pointer hover:bg-muted/50 px-2 py-1 rounded -mx-2 -my-1 truncate"
              >
                {page.title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite({ id: page.id, title: page.title, icon: page.icon })}
              className={isFavorite(page.id) ? "text-yellow-500 hover:text-yellow-600" : ""}
            >
              <Star className={`h-4 w-4 ${isFavorite(page.id) ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDuplicatePage(page.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDeletePage(page.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-2 text-sm text-muted-foreground">
          Last edited{' '}
          <time suppressHydrationWarning dateTime={page.updatedAt.toISOString()}>
            {page.updatedAt.toLocaleDateString()}
          </time>{' '}
          at{' '}
          <time suppressHydrationWarning dateTime={page.updatedAt.toISOString()}>
            {page.updatedAt.toLocaleTimeString()}
          </time>
        </div>
      </header>
    </div>
  )
}
