import { mkdir, rename, copyFile, access, readdir, stat } from 'fs/promises'
import { join, basename, extname } from 'path'
import { app } from 'electron'
import { getCategoryById, getCategoryForFile } from './categoryEngine'
import { addToHistory } from './historyManager'
import { getSettings } from './settingsManager'

/**
 * Get the destination folder for organized files
 */
export function getOrganizedPath() {
  const settings = getSettings()
  
  if (settings.destinationPath) {
    return settings.destinationPath
  }
  
  // Default: Create DesktopSort folder on Desktop
  return join(app.getPath('desktop'), 'DesktopSort')
}

/**
 * Get the desktop path
 */
export function getDesktopPath() {
  return app.getPath('desktop')
}

/**
 * Ensure a directory exists, create if not
 */
async function ensureDir(dirPath) {
  try {
    await access(dirPath)
  } catch {
    await mkdir(dirPath, { recursive: true })
  }
}

/**
 * Get a unique filename if file already exists
 */
async function getUniqueFilename(destDir, fileName) {
  const ext = extname(fileName)
  const base = basename(fileName, ext)
  let finalName = fileName
  let counter = 1
  
  while (true) {
    try {
      await access(join(destDir, finalName))
      // File exists, try next number
      finalName = `${base} (${counter})${ext}`
      counter++
    } catch {
      // File doesn't exist, we can use this name
      break
    }
  }
  
  return finalName
}

/**
 * Move a single file to a new location
 */
export async function moveFile(sourcePath, destPath) {
  const destDir = join(destPath, '..')
  await ensureDir(destDir)
  
  const finalName = await getUniqueFilename(destDir, basename(destPath))
  const finalPath = join(destDir, finalName)
  
  await rename(sourcePath, finalPath)
  
  return finalPath
}

/**
 * Copy a single file to a new location
 */
export async function copyFileToPath(sourcePath, destPath) {
  const destDir = join(destPath, '..')
  await ensureDir(destDir)
  
  const finalName = await getUniqueFilename(destDir, basename(destPath))
  const finalPath = join(destDir, finalName)
  
  await copyFile(sourcePath, finalPath)
  
  return finalPath
}

/**
 * Recursively get all files in a directory
 */
async function getAllFilesRecursive(dirPath) {
  const files = []
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)
      
      if (entry.isDirectory()) {
        const subFiles = await getAllFilesRecursive(fullPath)
        files.push(...subFiles)
      } else {
        const stats = await stat(fullPath)
        files.push({
          name: entry.name,
          path: fullPath,
          size: stats.size
        })
      }
    }
  } catch (error) {
    console.log(`Could not read directory: ${dirPath}`)
  }
  
  return files
}

/**
 * Organize files based on options
 * @param {Object} options
 * @param {Array} options.files - Files to organize
 * @param {string} options.mode - 'move' or 'copy'
 * @param {string} options.destination - Optional custom destination
 */
export async function organizeFiles(options) {
  const { files, mode = 'move', destination } = options
  
  const basePath = destination || getOrganizedPath()
  await ensureDir(basePath)
  
  const operations = []
  const results = {
    success: [],
    failed: [],
    totalMoved: 0,
    totalSize: 0
  }
  
  for (const file of files) {
    try {
      const categoryId = getCategoryForFile(file.name, file.extension)
      const category = getCategoryById(categoryId)
      
      // Debug logging
      console.log(`Organizing: ${file.name} (ext: ${file.extension}) -> Category: ${category.name}`)
      
      const categoryDir = join(basePath, category.name)
      await ensureDir(categoryDir)
      
      const destPath = join(categoryDir, file.name)
      let finalPath
      
      if (mode === 'copy') {
        finalPath = await copyFileToPath(file.path, destPath)
      } else {
        finalPath = await moveFile(file.path, destPath)
      }
      
      operations.push({
        type: mode,
        sourcePath: file.path,
        destPath: finalPath,
        fileName: file.name,
        category: category.name,
        timestamp: new Date().toISOString()
      })
      
      results.success.push({
        file: file.name,
        from: file.path,
        to: finalPath,
        category: category.name
      })
      
      results.totalMoved++
      results.totalSize += file.size || 0
      
    } catch (error) {
      results.failed.push({
        file: file.name,
        error: error.message
      })
    }
  }
  
  // Save to history for undo
  if (operations.length > 0) {
    const historyEntry = {
      id: Date.now().toString(),
      type: 'organize',
      mode,
      operations,
      timestamp: new Date().toISOString(),
      summary: `Organized ${operations.length} files`
    }
    
    addToHistory(historyEntry)
  }
  
  return results
}

/**
 * Restore all files from DesktopSort back to Desktop
 */
export async function restoreDesktop() {
  const desktopPath = getDesktopPath()
  const organizedPath = getOrganizedPath()
  
  const operations = []
  const results = {
    success: [],
    failed: [],
    totalRestored: 0
  }
  
  try {
    // Get all files from DesktopSort folder recursively
    const filesToRestore = await getAllFilesRecursive(organizedPath)
    
    for (const file of filesToRestore) {
      try {
        const destPath = join(desktopPath, file.name)
        const finalPath = await moveFile(file.path, destPath)
        
        operations.push({
          type: 'restore',
          sourcePath: file.path,
          destPath: finalPath,
          fileName: file.name,
          timestamp: new Date().toISOString()
        })
        
        results.success.push({
          file: file.name,
          from: file.path,
          to: finalPath
        })
        
        results.totalRestored++
        
      } catch (error) {
        results.failed.push({
          file: file.name,
          error: error.message
        })
      }
    }
    
    // Save to history
    if (operations.length > 0) {
      const historyEntry = {
        id: Date.now().toString(),
        type: 'restore',
        operations,
        timestamp: new Date().toISOString(),
        summary: `Restored ${operations.length} files to Desktop`
      }
      
      addToHistory(historyEntry)
    }
    
    // Try to clean up empty DesktopSort folder
    try {
      const { rmdir } = await import('fs/promises')
      // Remove empty subdirectories first
      const subDirs = await readdir(organizedPath, { withFileTypes: true })
      for (const dir of subDirs) {
        if (dir.isDirectory()) {
          try {
            await rmdir(join(organizedPath, dir.name))
          } catch {
            // Not empty, skip
          }
        }
      }
      // Try to remove main folder
      await rmdir(organizedPath)
    } catch {
      // Folder not empty or doesn't exist, that's fine
    }
    
  } catch (error) {
    console.error('Error restoring desktop:', error)
    results.failed.push({
      file: 'N/A',
      error: error.message
    })
  }
  
  return results
}

/**
 * Undo a previous organization operation
 */
export async function undoOperation(operationId) {
  const { getHistoryEntry, removeFromHistory } = await import('./historyManager')
  
  const entry = getHistoryEntry(operationId)
  if (!entry) {
    throw new Error('Operation not found in history')
  }
  
  const results = {
    success: [],
    failed: []
  }
  
  // Reverse operations (process in reverse order)
  for (const op of [...entry.operations].reverse()) {
    try {
      if (op.type === 'move' || op.type === 'restore') {
        // Move file back to original location
        await rename(op.destPath, op.sourcePath)
        results.success.push(op.fileName)
      }
      // For 'copy' mode, we could delete the copied files, but that's destructive
      // So we just remove from history without deleting
    } catch (error) {
      results.failed.push({
        file: op.fileName,
        error: error.message
      })
    }
  }
  
  // Remove from history after successful undo
  if (results.failed.length === 0) {
    removeFromHistory(operationId)
  }
  
  return results
}
