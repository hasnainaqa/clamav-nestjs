"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  Settings,
  Download,
  Plus,
  FileText,
  Pin,
  Home,
  CheckSquare,
  Grid3X3,
  Book,
  Cookie,
  BookTemplate as Template,
  Trash2,
  ChevronRight,
  ChevronDown,
  Star,
  Smile,
  Calendar,
} from "lucide-react";
import type { Page } from "@/types/blocks";
import { TemplatesModal } from "./templates-modal";
import { TrashModal } from "./trash-modal";
import { blockTemplates } from "@/types/templates";
import { useFavorites } from "@/hooks/use-favorites";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  className?: string;
  pages: Page[];
  currentPageId: string;
  onPageSelect: (pageId: string) => void;
  onPageCreate: (title?: string, parentId?: string) => void;
  onPageUpdate: (pageId: string, updates: Partial<Page>) => void;
  onPageDelete: (pageId: string) => void;
  onPageDuplicate: (pageId: string) => void;
  trashedPages: any[];
  onMoveToTrash: (page: Page) => void;
  onRestoreFromTrash: (pageId: string) => void;
  onPermanentDelete: (pageId: string) => void;
  onEmptyTrash: () => void;
  onCreateFromTemplate: (template: any) => void;
}

export function Sidebar({
  className,
  pages,
  currentPageId,
  onPageSelect,
  onPageCreate,
  onPageUpdate,
  onPageDelete,
  onPageDuplicate,
  trashedPages,
  onMoveToTrash,
  onRestoreFromTrash,
  onPermanentDelete,
  onEmptyTrash,
  onCreateFromTemplate,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>(
    {}
  );

  const { favorites } = useFavorites();

  // Compose favorite items from current pages or fallback to stored favorites (and templates)
  const favoriteItems = useMemo(() => {
    return favorites.map((fav) => {
      const p = pages.find((pg) => pg.id === fav.id);
      if (p) {
        return {
          id: p.id,
          title: p.title,
          icon: p.icon,
          iconLucide: p.iconLucide,
          iconImage: p.iconImage,
        };
      }
      const t = blockTemplates.find((bt) => bt.id === fav.id);
      if (t) {
        return { id: t.id, title: t.name, icon: t.icon };
      }
      return { id: fav.id, title: fav.title, icon: fav.icon };
    });
  }, [favorites, pages]);

  const templates = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: FileText,
      iconColor: "text-gray-500",
    },
    {
      id: "quick-note",
      title: "Quick Note",
      icon: Pin,
      iconColor: "text-red-500",
    },
    {
      id: "personal-home",
      title: "Personal Home",
      icon: Home,
      iconColor: "text-amber-600",
    },
    {
      id: "task-list",
      title: "Task List",
      icon: CheckSquare,
      iconColor: "text-gray-700",
    },
    {
      id: "journal",
      title: "Journal",
      icon: Grid3X3,
      iconColor: "text-gray-600",
    },
    {
      id: "reading-list",
      title: "Reading List",
      icon: Book,
      iconColor: "text-red-600",
    },
  ];

  const togglePageExpansion = (pageId: string) => {
    setExpandedPages((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }));
  };

  const handlePageClick = (pageId: string, blockId?: string) => {
    console.log(
      "[v0] Page clicked:",
      pageId,
      blockId ? `block: ${blockId}` : ""
    );
    onPageSelect(pageId);

    if (blockId) {
      setTimeout(() => {
        const blockElement = document.getElementById(`block-${blockId}`);
        if (blockElement) {
          blockElement.scrollIntoView({ behavior: "smooth", block: "center" });
          blockElement.classList.add(
            "ring-2",
            "ring-blue-500",
            "ring-opacity-50"
          );
          setTimeout(() => {
            blockElement.classList.remove(
              "ring-2",
              "ring-blue-500",
              "ring-opacity-50"
            );
          }, 2000);
        }
      }, 100);
    }
  };

  // Memoize preview blocks for each page to avoid recalculation on every render
  const pagePreviewMap = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const p of pages) {
      const preview = (p.blocks || [])
        .filter(
          (block) =>
            block.type === "heading" ||
            block.type === "todo" ||
            block.type === "bullet-list" ||
            (block.type === "text" &&
              typeof (block as any).content?.text === "string" &&
              (block as any).content.text.length > 0)
        )
        .slice(0, 5);
      map[p.id] = preview;
    }
    return map;
  }, [pages]);

  // Memoize preview blocks for templates as well (templates list is static, but keep behavior consistent)
  const templatePreviewMap = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const t of blockTemplates) {
      const preview = (t.blocks || [])
        .filter(
          (block) =>
            block.type === "heading" ||
            block.type === "todo" ||
            block.type === "bullet-list" ||
            (block.type === "text" &&
              typeof (block as any).content?.text === "string" &&
              (block as any).content.text.length > 0)
        )
        .slice(0, 5);
      map[t.id] = preview;
    }
    return map;
  }, []);

  const getPageBlocks = (pageId: string) => {
    if (templatePreviewMap[pageId]) return templatePreviewMap[pageId];
    return pagePreviewMap[pageId] || [];
  };

  const getFilteredTemplates = () => {
    if (!searchQuery) return templates;

    return templates.filter((template) => {
      const titleMatch = template.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const blocks = getPageBlocks(template.id);
      const blockMatch = blocks.some((block: any) => {
        if (typeof block?.content === "string") {
          return block.content
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        if (
          block?.type === "text" &&
          typeof block?.content?.text === "string"
        ) {
          return block.content.text
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return false;
      });
      return titleMatch || blockMatch;
    });
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <>
      <div
        className={cn(
          "flex h-screen w-64 flex-col bg-gray-50 border-r border-gray-200",
          className
        )}>
        <div className="flex items-center gap-3 p-3 border-b border-gray-200">
          <img
            src="https://ui-avatars.com/api/?name=H&background=F97316&color=fff"
            alt="Avatar"
            className="w-6 h-6 rounded object-cover"
          />

          <span className="text-sm font-medium text-gray-900 flex-1">
            Hasnain Afzal's Notion
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-7 text-sm bg-white border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="px-2 space-y-0.5">
          <Button
            variant="ghost"
            className="w-full justify-start h-7 px-2 text-sm text-gray-600 hover:bg-gray-100 font-normal">
            <Bell className="h-4 w-4 mr-2" />
            Updates
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start h-7 px-2 text-sm text-gray-600 hover:bg-gray-100 font-normal">
                <Star className="h-4 w-4 mr-2" />
                Favorites
                <span className="ml-auto text-xs bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {favoriteItems.length === 0 && (
                <div className="px-2 py-1.5 text-sm text-gray-500">
                  No favorites yet
                </div>
              )}
              {favoriteItems.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => onPageSelect(item.id)}
                  className="flex items-center gap-2">
                  {item.iconImage?.url ? (
                    <img
                      src={item.iconImage.url}
                      alt="icon"
                      style={{
                        width: item.iconImage.width ?? 16,
                        height: item.iconImage.height ?? 16,
                      }}
                    />
                  ) : item.iconLucide ? (
                    (() => {
                      const IconMap: Record<
                        string,
                        React.ComponentType<any>
                      > = {
                        Home,
                        Star,
                        FileText,
                        CheckSquare,
                        Book,
                        Settings,
                        Smile,
                        Plus,
                        Calendar,
                      };
                      const Cmp = IconMap[item.iconLucide];
                      return Cmp ? (
                        <Cmp className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-500" />
                      );
                    })()
                  ) : item.icon ? (
                    <span className="text-sm">{item.icon}</span>
                  ) : (
                    <FileText className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="truncate">{item.title}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            className="w-full justify-start h-7 px-2 text-sm text-gray-600 hover:bg-gray-100 font-normal">
            <Settings className="h-4 w-4 mr-2" />
            Settings & members
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-7 px-2 text-sm text-gray-600 hover:bg-gray-100 font-normal">
            <Download className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 mt-4">
          <div className="space-y-1">
            {filteredTemplates.map((template) => {
              const pageBlocks = getPageBlocks(template.id);
              const hasBlocks = pageBlocks.length > 0;
              const isExpanded = expandedPages[template.id];

              return (
                <div key={template.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-7 px-2 text-sm font-normal hover:bg-gray-100",
                      currentPageId === template.id
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                    )}
                    onClick={() => {
                      if (hasBlocks) {
                        togglePageExpansion(template.id);
                      }
                      handlePageClick(template.id);
                    }}>
                    {hasBlocks &&
                      (isExpanded ? (
                        <ChevronDown className="h-3 w-3 mr-1" />
                      ) : (
                        <ChevronRight className="h-3 w-3 mr-1" />
                      ))}
                    <template.icon
                      className={cn("h-4 w-4 mr-2", template.iconColor)}
                    />
                    <span className="truncate">{template.title}</span>
                  </Button>

                  {hasBlocks && isExpanded && (
                    <div className="ml-6 space-y-0.5">
                      {pageBlocks.map((block: any, index) => {
                        let blockTitle = `${block.type} ${index + 1}`;

                        if (block?.content) {
                          if (typeof block.content === "string") {
                            blockTitle =
                              block.content.length > 30
                                ? `${block.content.substring(0, 30)}...`
                                : block.content;
                          } else if (typeof block.content?.text === "string") {
                            blockTitle =
                              block.content.text.length > 30
                                ? `${block.content.text.substring(0, 30)}...`
                                : block.content.text;
                          } else if (Array.isArray(block.content)) {
                            const firstItem = block.content[0];
                            if (firstItem && typeof firstItem === "string") {
                              blockTitle =
                                firstItem.length > 30
                                  ? `${firstItem.substring(0, 30)}...`
                                  : firstItem;
                            }
                          }
                        }

                        return (
                          <Button
                            key={block.id ?? index}
                            variant="ghost"
                            className="w-full justify-start h-7 px-2 text-sm font-normal hover:bg-gray-100 text-gray-600"
                            onClick={() =>
                              handlePageClick(template.id, block.id)
                            }>
                            <FileText className="h-3 w-3 mr-2 text-gray-400" />
                            <span className="truncate text-xs">
                              {blockTitle}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {pages.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-medium text-gray-500 px-2 py-1">
                  Your Pages
                </div>
                {pages.map((page) => {
                  const pageBlocks = getPageBlocks(page.id);
                  const hasBlocks = pageBlocks.length > 0;
                  const isExpanded = expandedPages[page.id];

                  return (
                    <div key={page.id}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start h-7 px-2 text-sm font-normal hover:bg-gray-100",
                          currentPageId === page.id
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700"
                        )}
                        onClick={() => {
                          if (hasBlocks) {
                            togglePageExpansion(page.id);
                          }
                          handlePageClick(page.id);
                        }}>
                        {hasBlocks &&
                          (isExpanded ? (
                            <ChevronDown className="h-3 w-3 mr-1" />
                          ) : (
                            <ChevronRight className="h-3 w-3 mr-1" />
                          ))}
                        {page.iconImage?.url ? (
                          <img
                            src={page.iconImage.url}
                            alt="icon"
                            className="mr-2"
                            style={{
                              width: page.iconImage.width ?? 16,
                              height: page.iconImage.height ?? 16,
                            }}
                          />
                        ) : page.iconLucide ? (
                          (() => {
                            const IconMap: Record<
                              string,
                              React.ComponentType<any>
                            > = {
                              Home,
                              Star,
                              FileText,
                              CheckSquare,
                              Book,
                              Settings,
                              Smile,
                              Plus,
                              Calendar,
                            };
                            const Cmp = IconMap[page.iconLucide];
                            return Cmp ? (
                              <Cmp className="h-4 w-4 mr-2 text-gray-500" />
                            ) : (
                              <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            );
                          })()
                        ) : page.icon ? (
                          <span className="mr-2 text-sm">{page.icon}</span>
                        ) : (
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        )}
                        <span className="truncate">{page.title}</span>
                      </Button>

                      {hasBlocks && isExpanded && (
                        <div className="ml-6 space-y-0.5">
                          {pageBlocks.map((block: any, index) => {
                            let blockTitle = `${block.type} ${index + 1}`;

                            if (block?.content) {
                              if (typeof block.content === "string") {
                                blockTitle =
                                  block.content.length > 30
                                    ? `${block.content.substring(0, 30)}...`
                                    : block.content;
                              } else if (
                                typeof block.content?.text === "string"
                              ) {
                                blockTitle =
                                  block.content.text.length > 30
                                    ? `${block.content.text.substring(
                                        0,
                                        30
                                      )}...`
                                    : block.content.text;
                              } else if (Array.isArray(block.content)) {
                                const firstItem = block.content[0];
                                if (
                                  firstItem &&
                                  typeof firstItem === "string"
                                ) {
                                  blockTitle =
                                    firstItem.length > 30
                                      ? `${firstItem.substring(0, 30)}...`
                                      : firstItem;
                                }
                              }
                            }

                            return (
                              <Button
                                key={block.id}
                                variant="ghost"
                                className="w-full justify-start h-7 px-2 text-sm font-normal hover:bg-gray-100 text-gray-600"
                                onClick={() =>
                                  handlePageClick(page.id, block.id)
                                }>
                                <FileText className="h-3 w-3 mr-2 text-gray-400" />
                                <span className="truncate text-xs">
                                  {blockTitle}
                                </span>
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start h-7 px-2 text-sm text-gray-500 hover:bg-gray-100 font-normal mt-4"
            onClick={() => onPageCreate()}>
            <Plus className="h-4 w-4 mr-2" />
            Add a page
          </Button>

          <div className="mt-6 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start h-7 px-2 text-sm text-gray-600 hover:bg-gray-100 font-normal"
              onClick={() => setIsTemplatesModalOpen(true)}>
              <Template className="h-4 w-4 mr-2" />
              Templates
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start h-7 px-2 text-sm text-gray-600 hover:bg-gray-100 font-normal"
              onClick={() => setIsTrashModalOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Trash
              {trashedPages.length > 0 && (
                <span className="ml-auto text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                  {trashedPages.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={onCreateFromTemplate}
      />

      <TrashModal
        isOpen={isTrashModalOpen}
        onClose={() => setIsTrashModalOpen(false)}
        trashedPages={trashedPages}
        onRestore={onRestoreFromTrash}
        onPermanentDelete={onPermanentDelete}
        onEmptyTrash={onEmptyTrash}
      />
    </>
  );
}
