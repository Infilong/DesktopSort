import { create } from 'zustand'

export const useSettingsStore = create((set, get) => ({
  // State
  settings: null,
  isLoading: false,
  
  // Actions
  loadSettings: async () => {
    set({ isLoading: true })
    
    try {
      const result = await window.electronAPI.settings.get()
      
      if (result.success) {
        set({ settings: result.data, isLoading: false })
        return result.data
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
    
    set({ isLoading: false })
  },
  
  updateSettings: async (newSettings) => {
    try {
      const result = await window.electronAPI.settings.update(newSettings)
      
      if (result.success) {
        set({ settings: result.data })
        return result.data
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  },
  
  getSetting: (key) => {
    const { settings } = get()
    return settings?.[key]
  }
}))
