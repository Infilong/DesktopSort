import Store from 'electron-store'

const settingsStore = new Store({
  name: 'settings',
  defaults: {
    // Destination folder (null = Desktop/DesktopSort)
    destinationPath: null,
    
    // Organization mode: 'move' or 'copy'
    defaultMode: 'move',
    
    // Show confirmation before organizing
    confirmBeforeOrganize: true,
    
    // Preview changes before executing
    showPreview: true,
    
    // Keep original files when organizing (acts like copy)
    keepOriginals: false,
    
    // Custom category rules
    customRules: [],
    
    // Scheduled organizing
    scheduleEnabled: false,
    scheduleInterval: 'daily', // 'hourly', 'daily', 'weekly'
    scheduleTime: '09:00',
    
    // UI preferences
    theme: 'dark',
    language: 'auto', // 'auto' or language code (en, zh, etc.)
    viewMode: 'grid', // 'grid' or 'list'
    sortBy: 'name', // 'name', 'date', 'size', 'type'
    sortOrder: 'asc',
    
    // Minimize to tray
    minimizeToTray: false,
    startMinimized: false,
    
    // First run flag
    isFirstRun: true
  }
})

/**
 * Get all settings
 */
export function getSettings() {
  return settingsStore.store
}

/**
 * Get a specific setting
 */
export function getSetting(key) {
  return settingsStore.get(key)
}

/**
 * Update settings
 */
export function updateSettings(newSettings) {
  for (const [key, value] of Object.entries(newSettings)) {
    settingsStore.set(key, value)
  }
  return settingsStore.store
}

/**
 * Reset settings to defaults
 */
export function resetSettings() {
  settingsStore.clear()
  return settingsStore.store
}

/**
 * Add a custom categorization rule
 */
export function addCustomRule(rule) {
  const rules = settingsStore.get('customRules', [])
  rules.push({
    id: Date.now().toString(),
    ...rule
  })
  settingsStore.set('customRules', rules)
  return rules
}

/**
 * Remove a custom rule
 */
export function removeCustomRule(ruleId) {
  const rules = settingsStore.get('customRules', [])
  const filtered = rules.filter(r => r.id !== ruleId)
  settingsStore.set('customRules', filtered)
  return filtered
}

/**
 * Mark first run as complete
 */
export function completeFirstRun() {
  settingsStore.set('isFirstRun', false)
}
