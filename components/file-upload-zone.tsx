"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, ImageIcon, FileText, FileVideo, FileAudio, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadProgress?: number
}

interface FileUploadZoneProps {
  onFilesUploaded: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

export function FileUploadZone({
  onFilesUploaded,
  maxFiles = 10,
  maxSize = 5,
  acceptedTypes = ["*/*"],
  className,
}: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [embedUrl, setEmbedUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return FileVideo
    if (type.startsWith("audio/")) return FileAudio
    if (type.includes("pdf") || type.includes("document")) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: UploadedFile[] = []

      Array.from(fileList).forEach((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
          return
        }

        if (files.length + newFiles.length >= maxFiles) {
          alert(`Maximum ${maxFiles} files allowed.`)
          return
        }

        const fileUrl = URL.createObjectURL(file)
        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          url: fileUrl,
          uploadProgress: 0,
        }

        newFiles.push(uploadedFile)

        // Simulate upload progress
        const interval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id ? { ...f, uploadProgress: Math.min((f.uploadProgress || 0) + 10, 100) } : f,
            ),
          )
        }, 100)

        setTimeout(() => {
          clearInterval(interval)
          setFiles((prev) => prev.map((f) => (f.id === uploadedFile.id ? { ...f, uploadProgress: 100 } : f)))
        }, 1000)
      })

      setFiles((prev) => [...prev, ...newFiles])
      onFilesUploaded([...files, ...newFiles])
    },
    [files, maxFiles, maxSize, onFilesUploaded],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles)
      }
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesUploaded(updatedFiles)
  }

  const handleEmbedUrl = () => {
    if (!embedUrl) return

    const embeddedFile: UploadedFile = {
      id: Date.now().toString(),
      name: embedUrl.split("/").pop() || "Embedded Link",
      size: 0,
      type: "link",
      url: embedUrl,
      uploadProgress: 100,
    }

    const updatedFiles = [...files, embeddedFile]
    setFiles(updatedFiles)
    onFilesUploaded(updatedFiles)
    setEmbedUrl("")
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="embed">Embed link</TabsTrigger>
            <TabsTrigger value="unsplash">
              <ImageIcon className="h-4 w-4 mr-1" />
              Unsplash
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                "hover:border-primary hover:bg-primary/5 cursor-pointer",
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Upload file</h3>
              <p className="text-sm text-muted-foreground mb-4">Maximum size per file is {maxSize} MB.</p>
              <Button variant="outline">Choose files</Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept={acceptedTypes.join(",")}
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="embed-url">Paste the image link...</Label>
              <div className="flex gap-2">
                <Input
                  id="embed-url"
                  placeholder="https://example.com/image.jpg"
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                />
                <Button onClick={handleEmbedUrl} disabled={!embedUrl}>
                  Embed
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="unsplash" className="space-y-4">
            <div className="text-center py-8">
              <ImageIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Unsplash integration would go here</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-sm">Uploaded Files</h4>
            {files.map((file) => {
              const FileIcon = getFileIcon(file.type)
              return (
                <Card key={file.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        {file.type !== "link" && (
                          <Badge variant="secondary" className="text-xs">
                            {file.type.split("/")[0]}
                          </Badge>
                        )}
                      </div>

                      {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                        <Progress value={file.uploadProgress} className="h-1 mt-2" />
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {file.type.startsWith("image/") && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
