"use client";

import type React from "react";
import { useState } from "react";
import type { Block } from "@/types/blocks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  Copy,
  Trash2,
  Minus,
  Type,
  Heading1,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  FileBox as FileForm,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockWrapperProps {
  block: Block;
  children: React.ReactNode;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddBlock: (type: Block["type"], index?: number) => void;
  index: number;
}

export function BlockWrapper({
  block,
  children,
  onDelete,
  onDuplicate,
  onAddBlock,
  index,
}: BlockWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!block || !block.id) {
    console.error("[notion] BlockWrapper received invalid block:", block);
    return <div className="p-2 text-red-500">Invalid block</div>;
  }

  const blockTypes = [
    { type: "text", label: "Text", icon: Type },
    { type: "heading", label: "Heading", icon: Heading1 },
    { type: "todo", label: "To-do", icon: CheckSquare },
    { type: "bullet-list", label: "Bullet List", icon: List },
    { type: "numbered-list", label: "Numbered List", icon: ListOrdered },
    { type: "quote", label: "Quote", icon: Quote },
    { type: "code", label: "Code", icon: Code },
    { type: "form", label: "Form", icon: FileForm },
    { type: "image", label: "Image", icon: ImageIcon },
    { type: "divider", label: "Divider", icon: Minus },
  ] as const;

  const handleDeleteBlock = () => {
    if (!block.id) {
      console.error("[notion] Delete button clicked with undefined block ID");
      return;
    }
    console.log("[notion] Delete button clicked for block:", block.id);
    onDelete(block.id);
  };

  const handleDuplicateBlock = () => {
    if (!block.id) {
      console.error("[notion] Duplicate button clicked with undefined block ID");
      return;
    }
    console.log("[notion] Duplicate button clicked for block:", block.id);
    onDuplicate(block.id);
  };

  const handleAddBlock = (blockType: Block["type"]) => {
    console.log(
      "[notion] Add block button clicked, type:",
      blockType,
      "after index:",
      index
    );
    onAddBlock(blockType, index + 1);
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg transition-all duration-200 hover:bg-muted/20",
        isHovered && "bg-muted/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isMenuOpen) setIsHovered(false);
      }}
      data-block-id={block.id}>
      <div className="flex items-start gap-2">
        {/* Main content area */}
        <div className="flex-1 py-2 px-3">{children}</div>

        {isHovered && (
          <div className="flex items-center gap-1 py-2 pr-2">
            {/* Button 1: Remove/Delete this specific block only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteBlock}
              className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:text-destructive"
              title="Delete this block">
              <Minus className="h-3 w-3" />
            </Button>

            {/* Button 2: Duplicate this specific block */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDuplicateBlock}
              className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:text-primary"
              title="Duplicate this block">
              <Plus className="h-3 w-3" />
            </Button>

            {/* Button 3: Three dots menu with all options */}
            <DropdownMenu
              open={isMenuOpen}
              onOpenChange={(open) => {
                setIsMenuOpen(open);
                if (open) setIsHovered(true);
              }}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                  title="More options">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* Block creation section */}
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  Add Block
                </div>
                <DropdownMenuSeparator />

                {/* All available block types */}
                {blockTypes.map(({ type, label, icon: Icon }) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => handleAddBlock(type)}
                    className="flex items-center gap-2 cursor-pointer">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                {/* Block actions section */}
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  Actions
                </div>
                <DropdownMenuItem
                  onClick={handleDuplicateBlock}
                  className="flex items-center gap-2 cursor-pointer">
                  <Copy className="h-4 w-4" />
                  Duplicate Block
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteBlock}
                  className="flex items-center gap-2 text-destructive cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                  Delete Block
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
