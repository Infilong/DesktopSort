import Store from 'electron-store'

const historyStore = new Store({
  name: 'history',
  defaults: {
    operations: []
  }
})

const MAX_HISTORY_ENTRIES = 50

/**
 * Add an operation to history
 */
export function addToHistory(entry) {
  const operations = historyStore.get('operations', [])
  
  // Add new entry at the beginning
  operations.unshift(entry)
  
  // Limit history size
  if (operations.length > MAX_HISTORY_ENTRIES) {
    operations.pop()
  }
  
  historyStore.set('operations', operations)
  
  return entry
}

/**
 * Get all history entries
 */
export function getHistory() {
  return historyStore.get('operations', [])
}

/**
 * Get a specific history entry by ID
 */
export function getHistoryEntry(id) {
  const operations = historyStore.get('operations', [])
  return operations.find(op => op.id === id)
}

/**
 * Remove an entry from history
 */
export function removeFromHistory(id) {
  const operations = historyStore.get('operations', [])
  const filtered = operations.filter(op => op.id !== id)
  historyStore.set('operations', filtered)
}

/**
 * Clear all history
 */
export function clearHistory() {
  historyStore.set('operations', [])
}

/**
 * Get history statistics
 */
export function getHistoryStats() {
  const operations = historyStore.get('operations', [])
  
  let totalFilesMoved = 0
  let totalSize = 0
  
  for (const op of operations) {
    totalFilesMoved += op.operations?.length || 0
  }
  
  return {
    totalOperations: operations.length,
    totalFilesMoved,
    oldestEntry: operations.length > 0 ? operations[operations.length - 1].timestamp : null,
    newestEntry: operations.length > 0 ? operations[0].timestamp : null
  }
}
