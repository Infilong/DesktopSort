import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
    Grid,
    List,
    Search,
    ArrowLeft,
    File,
    Image,
    FileText,
    Video,
    Music,
    Archive,
    Code,
    Package,
    AppWindow,
    FolderOpen,
    ExternalLink
} from 'lucide-react'
import { useFileStore } from '../stores/fileStore'
import { useSettingsStore } from '../stores/settingsStore'

// Category icon mapping (fallback)
const categoryIconMap = {
    Image: Image,
    FileText: FileText,
    Video: Video,
    Music: Music,
    Archive: Archive,
    Code: Code,
    Package: Package,
    AppWindow: AppWindow,
    File: File
}

// Format file size
function formatSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Get fallback icon based on file extension
function getFallbackIcon(file) {
    const ext = file.extension?.toLowerCase()

    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext)) {
        return { Icon: Image, color: 'text-pink-400', bg: 'bg-pink-500/10' }
    }
    // Documents
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext)) {
        return { Icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' }
    }
    // Videos
    if (['mp4', 'avi', 'mov', 'mkv', 'wmv', 'webm'].includes(ext)) {
        return { Icon: Video, color: 'text-orange-400', bg: 'bg-orange-500/10' }
    }
    // Audio
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(ext)) {
        return { Icon: Music, color: 'text-purple-400', bg: 'bg-purple-500/10' }
    }
    // Archives
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
        return { Icon: Archive, color: 'text-yellow-400', bg: 'bg-yellow-500/10' }
    }
    // Code
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'html', 'css'].includes(ext)) {
        return { Icon: Code, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
    }
    // Apps/Shortcuts
    if (['lnk', 'exe', 'url'].includes(ext)) {
        return { Icon: AppWindow, color: 'text-cyan-400', bg: 'bg-cyan-500/10' }
    }
    // Default
    return { Icon: File, color: 'text-slate-400', bg: 'bg-slate-500/10' }
}

// Component for displaying file icon (native or fallback)
function FileIcon({ file, size = 'large' }) {
    const [iconUrl, setIconUrl] = useState(null)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        let mounted = true
        setHasError(false)
        setIconUrl(null)

        async function loadIcon() {
            try {
                const result = await window.electronAPI.files.getIcon(file.path)
                if (mounted && result.success && result.data) {
                    setIconUrl(result.data)
                }
            } catch (error) {
                console.error('Failed to load icon:', error)
                if (mounted) setHasError(true)
            }
        }

        loadIcon()

        return () => { mounted = false }
    }, [file.path])

    const sizeClass = size === 'large' ? 'w-12 h-12' : 'w-10 h-10'
    const iconSize = size === 'large' ? 24 : 20

    // Show native icon if available and no error
    if (iconUrl && !hasError) {
        return (
            <img
                src={iconUrl}
                alt=""
                className={`${sizeClass} object-contain`}
                draggable={false}
                onError={() => setHasError(true)}
            />
        )
    }

    // Fallback to styled icon
    const { Icon, color, bg } = getFallbackIcon(file)
    return (
        <div className={`${sizeClass} rounded-xl ${bg} flex items-center justify-center`}>
            <Icon size={iconSize} className={color} />
        </div>
    )
}

function FilesPage() {
    const { t, i18n } = useTranslation()
    const { category } = useParams()
    const navigate = useNavigate()
    const { files, categorizedFiles, isLoading, scanFiles, getCategoryStats } = useFileStore()
    const { settings, loadSettings } = useSettingsStore()

    const [viewMode, setViewMode] = useState('grid')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (!categorizedFiles) {
            scanFiles()
        }
        loadSettings()
    }, [])

    // Apply theme
    useEffect(() => {
        if (settings?.theme === 'light') {
            document.body.classList.add('light')
        } else {
            document.body.classList.remove('light')
        }
    }, [settings])

    // Format date based on locale
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(i18n.language, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    // Get files to display
    const displayFiles = category && categorizedFiles
        ? categorizedFiles[category]?.files || []
        : files

    // Filter by search
    const filteredFiles = displayFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Get category info
    const categoryInfo = category && categorizedFiles
        ? categorizedFiles[category]
        : null

    const handleOpenFile = async (file) => {
        await window.electronAPI.shell.openPath(file.path)
    }

    const handleShowInFolder = async (file) => {
        await window.electronAPI.shell.showInFolder(file.path)
    }

    return (
        <div className="space-y-6 pb-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {category && (
                        <button
                            onClick={() => navigate('/files')}
                            className="w-10 h-10 rounded-xl bg-glass hover:bg-glass-hover border border-glass-border flex items-center justify-center text-text-secondary hover:text-blue-500 transition-all"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">
                            {categoryInfo ? t(`categories.${category.toLowerCase()}`, categoryInfo.name) : t('nav.allFiles', 'All Files')}
                        </h1>
                        <p className="text-text-secondary text-sm mt-1">
                            {filteredFiles.length} {t('files.count', 'files')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder={t('app.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-56 pl-10 pr-4 py-2.5 rounded-xl bg-glass border border-glass-border placeholder:text-text-muted focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                        />
                    </div>

                    {/* View Toggle */}
                    <div className="flex rounded-xl bg-glass border border-glass-border overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-text-secondary hover:text-white'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-text-secondary hover:text-white'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Pills (when viewing all files) */}
            {!category && (
                <div className="flex flex-wrap gap-2">
                    {getCategoryStats().filter(cat => cat.count > 0).map(cat => {
                        const IconComponent = categoryIconMap[cat.icon] || File
                        return (
                            <button
                                key={cat.id}
                                onClick={() => navigate(`/files/${cat.id}`)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-glass hover:bg-glass-hover border border-glass-border text-sm font-medium text-text-secondary hover:text-white transition-all"
                            >
                                <IconComponent size={14} style={{ color: cat.color }} />
                                <span>{t(`categories.${cat.id.toLowerCase()}`, cat.name)}</span>
                                <span className="text-text-muted text-xs">({cat.count})</span>
                            </button>
                        )
                    })}
                </div>
            )}

            {/* Files Grid/List */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="section-card flex flex-col items-center justify-center py-16">
                    <FolderOpen size={48} className="mb-4 opacity-20" />
                    <p className="text-text-muted font-medium">{t('messages.noResults', 'No results found')}</p>
                    <p className="text-sm text-text-muted mt-1">{t('messages.searchOrCategory', 'Try a different search or category')}</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {filteredFiles.map((file, index) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
                            className="section-card !p-4 hover:bg-glass-hover cursor-pointer group transition-all relative text-center"
                            onClick={() => handleOpenFile(file)}
                        >
                            <div className="flex justify-center mb-3">
                                <FileIcon file={file} size="large" />
                            </div>
                            <p className="text-sm font-medium truncate mb-1" title={file.name}>
                                {file.name}
                            </p>
                            <p className="text-xs text-text-muted">
                                {formatSize(file.size)}
                            </p>

                            {/* Hover Actions */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleShowInFolder(file)
                                }}
                                className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 text-white/80 hover:text-white hover:bg-black/50 transition-all"
                                title={t('buttons.showInFolder', 'Show in folder')}
                            >
                                <ExternalLink size={14} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="section-card !p-0 divide-y divide-glass-border overflow-hidden">
                    {filteredFiles.map((file, index) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
                            className="flex items-center gap-4 p-4 hover:bg-glass-hover cursor-pointer group"
                            onClick={() => handleOpenFile(file)}
                        >
                            <FileIcon file={file} size="small" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-sm" title={file.name}>
                                    {file.name}
                                </p>
                                <p className="text-xs text-text-muted truncate mt-0.5">
                                    {file.folder}
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0 mr-2">
                                <p className="text-sm text-text-secondary">{formatSize(file.size)}</p>
                                <p className="text-xs text-text-muted mt-0.5">{formatDate(file.modifiedAt)}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleShowInFolder(file)
                                }}
                                className="w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 bg-glass hover:bg-glass-hover border border-glass-border flex items-center justify-center text-text-secondary hover:text-blue-500 transition-all"
                                title={t('buttons.showInFolder', 'Show in folder')}
                            >
                                <ExternalLink size={14} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FilesPage
