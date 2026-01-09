/**
 * Default file categories with their extensions
 */
const DEFAULT_CATEGORIES = {
  images: {
    id: 'images',
    name: 'Images',
    icon: 'Image',
    color: '#f472b6',
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'tiff', 'heic']
  },
  documents: {
    id: 'documents',
    name: 'Documents',
    icon: 'FileText',
    color: '#3b82f6',
    extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp', 'csv']
  },
  videos: {
    id: 'videos',
    name: 'Videos',
    icon: 'Video',
    color: '#f97316',
    extensions: ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', 'm4v', '3gp']
  },
  audio: {
    id: 'audio',
    name: 'Audio',
    icon: 'Music',
    color: '#8b5cf6',
    extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'aiff']
  },
  archives: {
    id: 'archives',
    name: 'Archives',
    icon: 'Archive',
    color: '#eab308',
    extensions: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso']
  },
  code: {
    id: 'code',
    name: 'Code',
    icon: 'Code',
    color: '#10b981',
    extensions: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'html', 'css', 'scss', 'json', 'xml', 'yaml', 'yml', 'md', 'sql']
  },
  apps: {
    id: 'apps',
    name: 'Apps',
    icon: 'AppWindow',
    color: '#06b6d4',
    // Include shortcuts AND executables
    extensions: ['lnk', 'exe', 'appx', 'appxbundle', 'msix', 'msixbundle', 'url']
  },
  installers: {
    id: 'installers',
    name: 'Installers',
    icon: 'Package',
    color: '#6366f1',
    // Only actual installer packages, not exe (exe goes to apps)
    extensions: ['msi', 'dmg', 'pkg', 'deb', 'rpm', 'appimage']
  },
  others: {
    id: 'others',
    name: 'Others',
    icon: 'File',
    color: '#64748b',
    extensions: []
  }
}

// Installer keywords - if an exe has these in the name, it's an installer
const INSTALLER_KEYWORDS = ['setup', 'install', 'installer', 'uninstall', 'update']

// Build extension to category lookup map
let extensionMap = null

function buildExtensionMap() {
  if (extensionMap) return extensionMap
  
  extensionMap = new Map()
  
  for (const [categoryId, category] of Object.entries(DEFAULT_CATEGORIES)) {
    for (const ext of category.extensions) {
      extensionMap.set(ext.toLowerCase(), categoryId)
    }
  }
  
  return extensionMap
}

/**
 * Get all available categories
 */
export function getCategories() {
  return Object.values(DEFAULT_CATEGORIES)
}

/**
 * Check if a file looks like an installer based on its name
 */
function isInstallerByName(fileName) {
  const lowerName = fileName.toLowerCase()
  return INSTALLER_KEYWORDS.some(keyword => lowerName.includes(keyword))
}

/**
 * Get category for a file (considers both extension and name)
 */
export function getCategoryForFile(fileName, extension) {
  const ext = extension?.toLowerCase().replace(/^\./, '') || ''
  
  // Special handling for exe files - check if it's an installer
  if (ext === 'exe') {
    if (isInstallerByName(fileName)) {
      return 'installers'
    }
    return 'apps' // Regular exe goes to Apps
  }
  
  // For other extensions, use the map
  const map = buildExtensionMap()
  return map.get(ext) || 'others'
}

/**
 * Get category for a single file extension (for backwards compatibility)
 */
export function getCategoryForExtension(extension) {
  const map = buildExtensionMap()
  const ext = extension?.toLowerCase().replace(/^\./, '') || ''
  return map.get(ext) || 'others'
}

/**
 * Categorize an array of files
 */
export function categorizeFiles(files) {
  const categorized = {}
  
  // Initialize all categories with empty arrays
  for (const categoryId of Object.keys(DEFAULT_CATEGORIES)) {
    categorized[categoryId] = {
      ...DEFAULT_CATEGORIES[categoryId],
      files: [],
      totalSize: 0
    }
  }
  
  // Categorize each file
  for (const file of files) {
    // Use the smarter categorization that considers file name
    const categoryId = getCategoryForFile(file.name, file.extension)
    categorized[categoryId].files.push(file)
    categorized[categoryId].totalSize += file.size || 0
  }
  
  return categorized
}

/**
 * Get category details by ID
 */
export function getCategoryById(categoryId) {
  return DEFAULT_CATEGORIES[categoryId] || DEFAULT_CATEGORIES.others
}
