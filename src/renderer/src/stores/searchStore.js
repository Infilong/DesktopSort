import { create } from 'zustand'

export const useSearchStore = create((set, get) => ({
  query: '',
  results: [],
  isSearching: false,
  isOpen: false,

  // Set the search query and trigger search
  setQuery: async (query) => {
    set({ query, isSearching: true })
    
    if (!query || query.trim() === '') {
      set({ results: [], isSearching: false })
      return
    }

    try {
      const result = await window.electronAPI.search.query(query, 50)
      if (result.success) {
        set({ results: result.data, isSearching: false })
      } else {
        set({ results: [], isSearching: false })
      }
    } catch (error) {
      console.error('Search error:', error)
      set({ results: [], isSearching: false })
    }
  },

  // Clear search
  clearSearch: () => {
    set({ query: '', results: [], isSearching: false, isOpen: false })
  },

  // Toggle search panel
  setOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set(state => ({ isOpen: !state.isOpen }))
}))
