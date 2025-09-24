"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FileUploadZone } from "../file-upload-zone"
import { Settings, Trash2, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ImageBlock as ImageBlockType } from "@/types/blocks"

interface ImageBlockProps {
  block: ImageBlockType
  onUpdate: (updates: Partial<ImageBlockType>) => void
  onDelete: () => void
  isEditing?: boolean
}

export function ImageBlock({ block, onUpdate, onDelete, isEditing = false }: ImageBlockProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [caption, setCaption] = useState(block.content.caption || "")
  const [altText, setAltText] = useState(block.content.altText || "")

  const handleImageUpload = (files: any[]) => {
    if (files.length > 0) {
      const file = files[0]
      onUpdate({
        content: {
          ...block.content,
          url: file.url,
          filename: file.name,
          size: file.size,
          type: file.type,
        },
      })
    }
  }

  const handleCaptionChange = (newCaption: string) => {
    setCaption(newCaption)
    onUpdate({
      content: {
        ...block.content,
        caption: newCaption,
      },
    })
  }

  const handleAltTextChange = (newAltText: string) => {
    setAltText(newAltText)
    onUpdate({
      content: {
        ...block.content,
        altText: newAltText,
      },
    })
  }

  if (!block.content.url) {
    return (
      <div className="w-full">
        <FileUploadZone
          onFilesUploaded={handleImageUpload}
          maxFiles={1}
          maxSize={10}
          acceptedTypes={["image/*"]}
          className="border-dashed border-2 border-gray-300 hover:border-gray-400"
        />
        {isEditing && (
          <div className="flex justify-end mt-2">
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Card className={cn("overflow-hidden", isHovered && "shadow-md")}>
        <CardContent className="p-0 relative">
          <img
            src={block.content.url || "/placeholder.svg"}
            alt={block.content.altText || block.content.caption || "Uploaded image"}
            className="w-full h-auto object-cover"
            style={{ maxHeight: "500px" }}
          />

          {/* Hover Controls */}
          {(isHovered || showSettings) && isEditing && (
            <div className="absolute top-2 right-2 flex gap-1 bg-white/90 backdrop-blur-sm rounded-md p-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Caption */}
      {(block.content.caption || isEditing) && (
        <div className="mt-2">
          {isEditing ? (
            <Input
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              className="text-sm text-center border-none focus-visible:ring-0 bg-transparent"
            />
          ) : (
            block.content.caption && <p className="text-sm text-gray-600 text-center italic">{block.content.caption}</p>
          )}
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && isEditing && (
        <Card className="mt-2 p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Caption</label>
              <Input
                placeholder="Image caption"
                value={caption}
                onChange={(e) => handleCaptionChange(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Alt Text (for accessibility)</label>
              <Input
                placeholder="Describe the image for screen readers"
                value={altText}
                onChange={(e) => handleAltTextChange(e.target.value)}
                className="mt-1"
              />
            </div>
            {block.content.filename && (
              <div className="text-xs text-gray-500">
                <p>
                  <strong>Filename:</strong> {block.content.filename}
                </p>
                {block.content.size && (
                  <p>
                    <strong>Size:</strong> {(block.content.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
