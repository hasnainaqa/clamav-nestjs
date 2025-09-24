"use client"

import { cn } from "@/lib/utils"

interface RichTextDisplayProps {
  content: string
  className?: string
  onClick?: () => void
}

export function RichTextDisplay({ content, className, onClick }: RichTextDisplayProps) {
  const renderFormattedText = (text: string) => {
    if (!text) return ""

    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" class="text-primary underline hover:text-primary/80">$1</a>')
      .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
      .replace(/\n/g, "<br>")
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "min-h-[1.5rem] cursor-text text-foreground whitespace-pre-wrap leading-relaxed",
        onClick && "hover:bg-muted/30 rounded px-1 -mx-1",
        className,
      )}
      dangerouslySetInnerHTML={{
        __html: content ? renderFormattedText(content) : '<span class="text-muted-foreground">Type something...</span>',
      }}
    />
  )
}
