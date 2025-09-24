"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, RotateCcw, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TrashItem {
  id: string
  title: string
  deletedAt: Date
  blocks: any[]
}

interface TrashModalProps {
  isOpen: boolean
  onClose: () => void
  trashedPages: TrashItem[]
  onRestore: (pageId: string) => void
  onPermanentDelete: (pageId: string) => void
  onEmptyTrash: () => void
}

export function TrashModal({
  isOpen,
  onClose,
  trashedPages,
  onRestore,
  onPermanentDelete,
  onEmptyTrash,
}: TrashModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span>Trash</span>
          </DialogTitle>
          {trashedPages.length > 0 && (
            <Button variant="destructive" size="sm" onClick={onEmptyTrash}>
              Empty Trash
            </Button>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {trashedPages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Trash2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Trash is empty</p>
              <p className="text-sm">Deleted pages will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {trashedPages.map((page) => (
                <Card key={page.id} className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <CardTitle className="text-sm">{page.title}</CardTitle>
                          <p className="text-xs text-gray-500">
                            Deleted {formatDistanceToNow(page.deletedAt, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {page.blocks.length} blocks
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRestore(page.id)}
                        className="flex items-center space-x-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Restore</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onPermanentDelete(page.id)}
                        className="flex items-center space-x-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete Forever</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
