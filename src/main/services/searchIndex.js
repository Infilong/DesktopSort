/**
 * Search Index using Trie (Prefix Tree) for O(m) search
 * where m is the query length (effectively O(1) for short queries)
 */

class TrieNode {
  constructor() {
    this.children = new Map()  // char -> TrieNode
    this.files = []            // Files that match at this prefix level
  }
}

class SearchIndex {
  constructor() {
    this.root = new TrieNode()
    this.pathMap = new Map()   // path -> file for O(1) exact lookup
    this.totalFiles = 0
  }

  /**
   * Build index from array of files
   * @param {Array} files - Array of file objects with name, path, etc.
   */
  buildIndex(files) {
    // Clear existing index
    this.root = new TrieNode()
    this.pathMap.clear()
    this.totalFiles = 0

    // Insert each file
    for (const file of files) {
      this.insert(file)
    }

    console.log(`[SearchIndex] Built index for ${this.totalFiles} files`)
  }

  /**
   * Insert a single file into the index
   * @param {Object} file - File object with name, path, category, etc.
   */
  insert(file) {
    if (!file || !file.name) return

    const name = file.name.toLowerCase()
    let node = this.root

    // Insert into trie - store file reference at each prefix level
    for (const char of name) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode())
      }
      node = node.children.get(char)
      node.files.push(file)
    }

    // Store in path map for O(1) exact lookup
    this.pathMap.set(file.path, file)
    this.totalFiles++
  }

  /**
   * Remove a file from the index
   * @param {string} filePath - Path of file to remove
   */
  remove(filePath) {
    const file = this.pathMap.get(filePath)
    if (!file) return

    const name = file.name.toLowerCase()
    let node = this.root

    // Traverse and remove from each level
    for (const char of name) {
      if (!node.children.has(char)) break
      node = node.children.get(char)
      node.files = node.files.filter(f => f.path !== filePath)
    }

    this.pathMap.delete(filePath)
    this.totalFiles--
  }

  /**
   * Search by prefix - O(m) where m is query length
   * @param {string} query - Search query
   * @param {number} limit - Maximum results to return
   * @returns {Array} Matching files
   */
  search(query, limit = 50) {
    if (!query || query.trim() === '') {
      return []
    }

    const q = query.toLowerCase().trim()
    let node = this.root

    // Traverse trie to find prefix node
    for (const char of q) {
      if (!node.children.has(char)) {
        return [] // No matches
      }
      node = node.children.get(char)
    }

    // Return files at this prefix level (already collected during insert)
    // Sort by relevance: exact matches first, then by name length
    const results = [...node.files]
    results.sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      
      // Exact match first
      if (aName === q && bName !== q) return -1
      if (bName === q && aName !== q) return 1
      
      // Then by name length (shorter = more relevant)
      return aName.length - bName.length
    })

    return results.slice(0, limit)
  }

  /**
   * Get exact file by path - O(1)
   * @param {string} path - File path
   * @returns {Object|null} File object or null
   */
  getByPath(path) {
    return this.pathMap.get(path) || null
  }

  /**
   * Get index statistics
   */
  getStats() {
    return {
      totalFiles: this.totalFiles,
      uniquePaths: this.pathMap.size
    }
  }
}

// Singleton instance
let searchIndex = null

/**
 * Get or create the search index instance
 */
function getSearchIndex() {
  if (!searchIndex) {
    searchIndex = new SearchIndex()
  }
  return searchIndex
}

/**
 * Build the search index from files
 * @param {Array} files - Array of file objects
 */
function buildSearchIndex(files) {
  const index = getSearchIndex()
  const start = performance.now()
  index.buildIndex(files)
  const elapsed = performance.now() - start
  console.log(`[SearchIndex] Index built in ${elapsed.toFixed(2)}ms`)
  return index.getStats()
}

/**
 * Search the index
 * @param {string} query - Search query
 * @param {number} limit - Max results
 * @returns {Array} Matching files
 */
function searchFiles(query, limit = 50) {
  const index = getSearchIndex()
  const start = performance.now()
  const results = index.search(query, limit)
  const elapsed = performance.now() - start
  console.log(`[SearchIndex] Search "${query}" found ${results.length} results in ${elapsed.toFixed(2)}ms`)
  return results
}

/**
 * Add a file to the index
 * @param {Object} file - File object
 */
function addToIndex(file) {
  const index = getSearchIndex()
  index.insert(file)
}

/**
 * Remove a file from the index
 * @param {string} filePath - File path
 */
function removeFromIndex(filePath) {
  const index = getSearchIndex()
  index.remove(filePath)
}

export {
  getSearchIndex,
  buildSearchIndex,
  searchFiles,
  addToIndex,
  removeFromIndex
}
