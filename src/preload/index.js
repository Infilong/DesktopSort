import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    onMaximizedChange: (callback) => {
      ipcRenderer.on('window:maximized', (_, isMaximized) => callback(isMaximized))
    }
  },
  
  // File operations
  files: {
    scan: () => ipcRenderer.invoke('files:scan'),
    scanUnorganized: () => ipcRenderer.invoke('files:scanUnorganized'),
    getStats: (filePath) => ipcRenderer.invoke('files:getStats', filePath),
    getIcon: (filePath) => ipcRenderer.invoke('files:getIcon', filePath),
    getIcons: (filePaths) => ipcRenderer.invoke('files:getIcons', filePaths)
  },
  
  // Categories
  categories: {
    get: () => ipcRenderer.invoke('categories:get'),
    categorize: (files) => ipcRenderer.invoke('categories:categorize', files)
  },
  
  // Organization
  organize: {
    execute: (options) => ipcRenderer.invoke('organize:execute', options),
    restore: () => ipcRenderer.invoke('organize:restore'),
    moveFile: (source, dest) => ipcRenderer.invoke('organize:moveFile', source, dest),
    undo: (operationId) => ipcRenderer.invoke('organize:undo', operationId)
  },
  
  // Dialogs
  dialog: {
    confirm: (options) => ipcRenderer.invoke('dialog:confirm', options)
  },
  
  // History
  history: {
    get: () => ipcRenderer.invoke('history:get'),
    clear: () => ipcRenderer.invoke('history:clear')
  },
  
  // Settings
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    update: (newSettings) => ipcRenderer.invoke('settings:update', newSettings)
  },
  
  // Shell utilities
  shell: {
    openPath: (path) => ipcRenderer.invoke('shell:openPath', path),
    showInFolder: (path) => ipcRenderer.invoke('shell:showItemInFolder', path)
  }
})
