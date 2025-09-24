"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DashboardHeaderProps {
  onAddCard?: () => void
}

export function DashboardHeader({ onAddCard }: DashboardHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="w-64 pl-9" />
          </div>

          {/* Add Card Button */}
          <Button onClick={onAddCard} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Card
          </Button>
        </div>
      </div>
    </header>
  )
}
