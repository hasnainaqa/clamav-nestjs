"use client"

import { useEffect, useState } from "react"

export interface FavoritePage {
  id: string
  title: string
  icon?: string
  addedAt: Date
}

// Simple in-module store to keep favorites in sync across hook instances
let favoritesStore: FavoritePage[] | null = null
const subscribers = new Set<(favs: FavoritePage[]) => void>()

function loadFromStorage(): FavoritePage[] {
  try {
    const stored = localStorage.getItem("notion-favorites")
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return parsed.map((fav: any) => ({ ...fav, addedAt: new Date(fav.addedAt) }))
  } catch (e) {
    console.error("Failed to parse favorites from localStorage:", e)
    return []
  }
}

function saveToStorage(favs: FavoritePage[]) {
  localStorage.setItem(
    "notion-favorites",
    JSON.stringify(
      favs.map((f) => ({
        ...f,
        addedAt: f.addedAt.toISOString(),
      })),
    ),
  )
}

function initStoreIfNeeded() {
  if (favoritesStore === null) {
    favoritesStore = loadFromStorage()
  }
}

function setStore(next: FavoritePage[]) {
  favoritesStore = next
  saveToStorage(next)
  subscribers.forEach((cb) => cb(next))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePage[]>([])

  // Initialize from shared store
  useEffect(() => {
    initStoreIfNeeded()
    setFavorites(favoritesStore!)

    const cb = (favs: FavoritePage[]) => setFavorites(favs)
    subscribers.add(cb)
    return () => {
      subscribers.delete(cb)
    }
  }, [])

  const addToFavorites = (page: { id: string; title: string; icon?: string }) => {
    initStoreIfNeeded()
    const prev = favoritesStore!
    if (prev.some((fav) => fav.id === page.id)) return
    const next = [
      ...prev,
      { id: page.id, title: page.title, icon: page.icon, addedAt: new Date() },
    ]
    setStore(next)
  }

  const removeFromFavorites = (pageId: string) => {
    initStoreIfNeeded()
    const prev = favoritesStore!
    const next = prev.filter((fav) => fav.id !== pageId)
    setStore(next)
  }

  const isFavorite = (pageId: string) => {
    return favorites.some((fav) => fav.id === pageId)
  }

  const toggleFavorite = (page: { id: string; title: string; icon?: string }) => {
    if (isFavorite(page.id)) {
      removeFromFavorites(page.id)
    } else {
      addToFavorites(page)
    }
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  }
}
