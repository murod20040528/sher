"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Poem {
  id: string
  prompt: string
  content: string
  createdAt: Date
  language: string
  liked: boolean
  image?: string
}

interface PoetryHistoryStore {
  poems: Poem[]
  addPoem: (poem: Omit<Poem, "id" | "createdAt" | "liked">) => void
  toggleLike: (id: string) => void
  deletePoem: (id: string) => void
  clearHistory: () => void
}

export const usePoetryHistory = create<PoetryHistoryStore>()(
  persist(
    (set, get) => ({
      poems: [],
      addPoem: (poem) => {
        const newPoem: Poem = {
          ...poem,
          id: Date.now().toString(),
          createdAt: new Date(),
          liked: false,
        }
        set((state) => ({
          poems: [newPoem, ...state.poems],
        }))
      },
      toggleLike: (id) => {
        set((state) => ({
          poems: state.poems.map((poem) => (poem.id === id ? { ...poem, liked: !poem.liked } : poem)),
        }))
      },
      deletePoem: (id) => {
        set((state) => ({
          poems: state.poems.filter((poem) => poem.id !== id),
        }))
      },
      clearHistory: () => {
        set({ poems: [] })
      },
    }),
    {
      name: "poetry-history",
    },
  ),
)
