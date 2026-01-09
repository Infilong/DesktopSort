import { app } from 'electron'
import { readdir, stat, lstat } from 'fs/promises'
import { join, extname, basename } from 'path'

/**
 * Get the user's desktop path
 */
export function getDesktopPath() {
  return app.getPath('desktop')
}

/**
 * Get the public desktop path (shared across all users)
 */
export function getPublicDesktopPath() {
  return 'C:\\Users\\Public\\Desktop'
}

/**
 * Get the DesktopSort organized folder path
 */
export function getOrganizedFolderPath() {
  return join(app.getPath('desktop'), 'DesktopSort')
}

/**
 * Check if a file is a Windows shortcut (by extension or content)
 */
function isShortcut(fileName) {
  const ext = extname(fileName).toLowerCase()
  return ext === '.lnk' || ext === '.url'
}

/**
 * Get file extension, handling special cases
 */
function getFileExtension(fileName) {
  const ext = extname(fileName).toLowerCase().slice(1)
  return ext
}

/**
 * Scan a single desktop directory and return all files
 */
async function scanDesktopDirectory(dirPath, source = 'Desktop') {
  const files = []
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      // Skip hidden files (like desktop.ini)
      if (entry.name.startsWith('.') || entry.name === 'desktop.ini') continue
      // Skip the DesktopSort folder
      if (entry.name === 'DesktopSort') continue
      
      if (entry.isDirectory()) continue
      
      const filePath = join(dirPath, entry.name)
      
      try {
        const stats = await lstat(filePath)
        const ext = getFileExtension(entry.name)
        const isLnk = isShortcut(entry.name)
        
        // Log shortcut/exe files for debugging
        if (isLnk || ext === 'exe') {
          console.log(`Found ${isLnk ? 'shortcut' : 'exe'}: ${entry.name} (ext: ${ext}) in ${source}`)
        }
        
        files.push({
          id: Buffer.from(filePath).toString('base64'),
          name: entry.name,
          path: filePath,
          extension: ext,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
          modifiedAt: stats.mtime.toISOString(),
          isFile: true,
          isShortcut: isLnk,
          folder: source,
          isOrganized: false
        })
      } catch (error) {
        console.error(`Error reading file ${entry.name}:`, error.message)
      }
    }
  } catch (error) {
    console.log(`Directory not found or not accessible: ${dirPath}`)
  }
  
  return files
}

/**
 * Scan a directory recursively (for DesktopSort folder)
 */
async function scanDirectoryRecursive(dirPath) {
  const files = []
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const filePath = join(dirPath, entry.name)
      
      // Skip hidden files
      if (entry.name.startsWith('.')) continue
      
      if (entry.isDirectory()) {
        const subFiles = await scanDirectoryRecursive(filePath)
        files.push(...subFiles)
        continue
      }
      
      try {
        const stats = await lstat(filePath)
        const ext = getFileExtension(entry.name)
        
        files.push({
          id: Buffer.from(filePath).toString('base64'),
          name: entry.name,
          path: filePath,
          extension: ext,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
          modifiedAt: stats.mtime.toISOString(),
          isFile: true,
          isShortcut: isShortcut(entry.name),
          folder: basename(dirPath),
          isOrganized: true
        })
      } catch (error) {
        console.error(`Error reading file ${entry.name}:`, error.message)
      }
    }
  } catch (error) {
    console.log(`Directory not found or not accessible: ${dirPath}`)
  }
  
  return files
}

/**
 * Scan all desktop directories and return all files
 * Scans: User Desktop, Public Desktop, and DesktopSort folder
 */
export async function scanDesktop() {
  const desktopPath = getDesktopPath()
  const publicDesktopPath = getPublicDesktopPath()
  const organizedPath = getOrganizedFolderPath()
  
  // Scan user's desktop
  const userDesktopFiles = await scanDesktopDirectory(desktopPath, 'Desktop')
  
  // Scan public desktop (contains shared shortcuts)
  const publicDesktopFiles = await scanDesktopDirectory(publicDesktopPath, 'Public Desktop')
  
  // Scan DesktopSort folder (organized files)
  const organizedFiles = await scanDirectoryRecursive(organizedPath)
  
  // Combine all
  return [...userDesktopFiles, ...publicDesktopFiles, ...organizedFiles]
}

/**
 * Scan only unorganized desktop files (for the organize feature)
 * Includes both user desktop and public desktop
 */
export async function scanUnorganizedDesktopFiles() {
  const desktopPath = getDesktopPath()
  const publicDesktopPath = getPublicDesktopPath()
  
  // Scan user's desktop
  const userDesktopFiles = await scanDesktopDirectory(desktopPath, 'Desktop')
  
  // Scan public desktop
  const publicDesktopFiles = await scanDesktopDirectory(publicDesktopPath, 'Public Desktop')
  
  // Combine
  return [...userDesktopFiles, ...publicDesktopFiles]
}

/**
 * Get detailed stats for a specific file
 */
export async function getFileStats(filePath) {
  const stats = await lstat(filePath)
  
  return {
    name: basename(filePath),
    path: filePath,
    extension: getFileExtension(basename(filePath)),
    size: stats.size,
    createdAt: stats.birthtime.toISOString(),
    modifiedAt: stats.mtime.toISOString(),
    accessedAt: stats.atime.toISOString(),
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    isShortcut: isShortcut(basename(filePath))
  }
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
