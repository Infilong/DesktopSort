import { ipcMain, shell, dialog, app, nativeImage } from 'electron'
import { scanDesktop, scanUnorganizedDesktopFiles, getFileStats } from '../services/fileScanner'
import { categorizeFiles, getCategories } from '../services/categoryEngine'
import { organizeFiles, moveFile, undoOperation, restoreDesktop } from '../services/fileOrganizer'
import { getHistory, clearHistory } from '../services/historyManager'
import { getSettings, updateSettings } from '../services/settingsManager'
import { buildSearchIndex, searchFiles } from '../services/searchIndex'
import path from 'path'
import fs from 'fs'

// Cache for file icons to avoid repeated lookups
const iconCache = new Map()

// Default fallback icon (generic file icon as base64 PNG)
const DEFAULT_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABjElEQVR4nO2WzUrDQBSFv6pQQVBw4UJw5UpXPoAP4FIXPoEP4NKlC1/Ahbj0BVy4cuVCEEFBRBBBRPwBf1AQxJ+4cCFSm5nJTJqkTdqFHriQJnPPuXfmziQQExMTExPzP5ICpoAl4Bw4A+6BV+ADeAZugQvgCNgEZoFRIBGVgElgG3gCvgEVsH2p7xXwAOwAE1EImAU6wDfwBRwA88BQwL5DwAKwD7wBn8AtsNwvAWlgE3gBPtU3WwLGQvYfBdaAa/VNt4HhMASkVKJPVbKdKOYeBFaBK+UjDUz3KmBMzfF7lfwmMNKj+AywpXy0gYleBAyrZF+AY2CyD+LTwIny1QLSYQSsqiTfgC1gIALxKWBb+WwBq2EErCkBbWCtz+JZ4FD5bgHrYQSklYB9YDAi8ayaB+W7DQyFEZBRAg4iFJ9Wc6F8Z8IIGFACTiMUn1JzUfveC5oTdSJeRCg+p+ZC+c6FmYvLKL+TlYjFl9RcXIaZi+so5yKteFFNxnWYuTiPci4uohaQjYmJiYmJIWJ+AEFSsJ/0rqxHAAAAAElFTkSuQmCC'

export function setupIpcHandlers() {
  // File scanning - scans both desktop and organized folder
  ipcMain.handle('files:scan', async () => {
    try {
      const files = await scanDesktop()
      // Build search index for instant search
      buildSearchIndex(files)
      return { success: true, data: files }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
  
  // Scan only unorganized files (for organize preview)
  ipcMain.handle('files:scanUnorganized', async () => {
    try {
      const files = await scanUnorganizedDesktopFiles()
      return { success: true, data: files }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('files:getStats', async (_, filePath) => {
    try {
      const stats = await getFileStats(filePath)
      return { success: true, data: stats }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
  
  // Get native file icon - simplified with fallback
  ipcMain.handle('files:getIcon', async (_, filePath) => {
    try {
      // Check cache first
      if (iconCache.has(filePath)) {
        return { success: true, data: iconCache.get(filePath) }
      }

      let iconDataUrl = null
      
      // Method 1: Try shortcut target if it's a .lnk file
      if (process.platform === 'win32' && filePath.toLowerCase().endsWith('.lnk')) {
        try {
          const shortcut = shell.readShortcutLink(filePath)
          
          // Try target path first
          if (shortcut.target) {
            try {
              const icon = await app.getFileIcon(shortcut.target, { size: 'large' })
              iconDataUrl = icon.toDataURL()
              if (iconDataUrl && iconDataUrl.length > 100) {
                iconCache.set(filePath, iconDataUrl)
                return { success: true, data: iconDataUrl }
              }
            } catch (e) {
              // Target failed, continue
            }
          }
        } catch (e) {
          // Shortcut reading failed, continue
        }
      }
      
      // Method 2: Try the file itself
      try {
        const icon = await app.getFileIcon(filePath, { size: 'large' })
        iconDataUrl = icon.toDataURL()
        if (iconDataUrl && iconDataUrl.length > 100) {
          iconCache.set(filePath, iconDataUrl)
          return { success: true, data: iconDataUrl }
        }
      } catch (e) {
        // Direct file failed
      }
      
      // Method 3: Return default icon
      iconCache.set(filePath, DEFAULT_ICON)
      return { success: true, data: DEFAULT_ICON }

    } catch (error) {
      // On any error, return default icon
      return { success: true, data: DEFAULT_ICON }
    }
  })
  
  // Get multiple file icons at once (batch)
  ipcMain.handle('files:getIcons', async (_, filePaths) => {
    try {
      const icons = {}
      
      for (const filePath of filePaths) {
        try {
          if (iconCache.has(filePath)) {
            icons[filePath] = iconCache.get(filePath)
            continue
          }
          
          let iconDataUrl = null
          
          // Try shortcut target
          if (process.platform === 'win32' && filePath.toLowerCase().endsWith('.lnk')) {
            try {
              const shortcut = shell.readShortcutLink(filePath)
              if (shortcut.target) {
                const icon = await app.getFileIcon(shortcut.target, { size: 'large' })
                iconDataUrl = icon.toDataURL()
              }
            } catch (e) {}
          }
          
          // Try file itself if shortcut failed
          if (!iconDataUrl || iconDataUrl.length < 100) {
            try {
              const icon = await app.getFileIcon(filePath, { size: 'large' })
              iconDataUrl = icon.toDataURL()
            } catch (e) {}
          }
          
          // Use default if all failed
          if (!iconDataUrl || iconDataUrl.length < 100) {
            iconDataUrl = DEFAULT_ICON
          }
          
          iconCache.set(filePath, iconDataUrl)
          icons[filePath] = iconDataUrl
        } catch (e) {
          icons[filePath] = DEFAULT_ICON
        }
      }
      
      return { success: true, data: icons }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Categorization
  ipcMain.handle('categories:get', async () => {
    try {
      const categories = getCategories()
      return { success: true, data: categories }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('categories:categorize', async (_, files) => {
    try {
      const categorized = categorizeFiles(files)
      return { success: true, data: categorized }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // File organization
  ipcMain.handle('organize:execute', async (_, options) => {
    try {
      const result = await organizeFiles(options)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
  
  // Restore desktop - move all files from DesktopSort back to Desktop
  ipcMain.handle('organize:restore', async () => {
    try {
      const result = await restoreDesktop()
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('organize:moveFile', async (_, sourcePath, destPath) => {
    try {
      await moveFile(sourcePath, destPath)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('organize:undo', async (_, operationId) => {
    try {
      await undoOperation(operationId)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
  
  // Show confirmation dialog
  ipcMain.handle('dialog:confirm', async (event, options) => {
    const { title, message, detail, confirmText, cancelText } = options
    const result = await dialog.showMessageBox({
      type: 'question',
      buttons: [cancelText || 'Cancel', confirmText || 'Yes'],
      defaultId: 1,
      cancelId: 0,
      title: title || 'Confirm Action',
      message: message || 'Are you sure?',
      detail: detail || ''
    })
    return { confirmed: result.response === 1 }
  })

  // History
  ipcMain.handle('history:get', async () => {
    try {
      const history = getHistory()
      return { success: true, data: history }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('history:clear', async () => {
    try {
      clearHistory()
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Settings
  ipcMain.handle('settings:get', async () => {
    try {
      const settings = getSettings()
      return { success: true, data: settings }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('settings:update', async (_, newSettings) => {
    try {
      const settings = updateSettings(newSettings)
      return { success: true, data: settings }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Shell utilities
  ipcMain.handle('shell:openPath', async (_, path) => {
    try {
      await shell.openPath(path)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('shell:showItemInFolder', async (_, path) => {
    try {
      shell.showItemInFolder(path)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  // Search
  ipcMain.handle('search:query', async (_, query, limit = 50) => {
    try {
      const results = searchFiles(query, limit)
      return { success: true, data: results }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}
