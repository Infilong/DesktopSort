import { create } from 'zustand'

export const useHistoryStore = create((set, get) => ({
  // State
  history: [],
  isLoading: false,
  
  // Actions
  loadHistory: async () => {
    set({ isLoading: true })
    
    try {
      const result = await window.electronAPI.history.get()
      
      if (result.success) {
        set({ history: result.data, isLoading: false })
        return result.data
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    }
    
    set({ isLoading: false })
  },
  
  undoOperation: async (operationId) => {
    try {
      const result = await window.electronAPI.organize.undo(operationId)
      
      if (result.success) {
        // Reload history after undo
        await get().loadHistory()
        return true
      }
    } catch (error) {
      console.error('Failed to undo operation:', error)
    }
    
    return false
  },
  
  clearHistory: async () => {
    try {
      const result = await window.electronAPI.history.clear()
      
      if (result.success) {
        set({ history: [] })
        return true
      }
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
    
    return false
  },
  
  getLatestOperations: (count = 5) => {
    const { history } = get()
    return history.slice(0, count)
  }
}))
