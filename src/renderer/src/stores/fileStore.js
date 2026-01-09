import { create } from 'zustand'

export const useFileStore = create((set, get) => ({
  // State
  files: [],
  categorizedFiles: null,
  isLoading: false,
  error: null,
  lastScanTime: null,
  
  // Actions
  scanFiles: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const result = await window.electronAPI.files.scan()
      
      if (result.success) {
        const files = result.data
        
        // Categorize files
        const catResult = await window.electronAPI.categories.categorize(files)
        
        set({
          files,
          categorizedFiles: catResult.success ? catResult.data : null,
          isLoading: false,
          lastScanTime: new Date().toISOString()
        })
        
        return files
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      set({ isLoading: false, error: error.message })
      throw error
    }
  },
  
  // Get files by category
  getFilesByCategory: (categoryId) => {
    const { categorizedFiles } = get()
    if (!categorizedFiles) return []
    return categorizedFiles[categoryId]?.files || []
  },
  
  // Get category stats
  getCategoryStats: () => {
    const { categorizedFiles } = get()
    if (!categorizedFiles) return []
    
    return Object.values(categorizedFiles).map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      count: cat.files.length,
      totalSize: cat.totalSize
    }))
  },
  
  // Get total file count
  getTotalFileCount: () => {
    const { files } = get()
    return files.length
  },
  
  // Clear files
  clearFiles: () => {
    set({ files: [], categorizedFiles: null })
  }
}))
