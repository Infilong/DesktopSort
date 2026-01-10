import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
    Sparkles,
    RefreshCw,
    Image,
    FileText,
    Video,
    Music,
    Archive,
    Code,
    Package,
    File,
    AppWindow,
    Clock,
    CheckCircle,
    AlertCircle,
    FolderOpen,
    Monitor,
    Undo2,
    ArrowRight,
    Table,
    Presentation,
    FileType
} from 'lucide-react'
import { useFileStore } from '../stores/fileStore'
import { useHistoryStore } from '../stores/historyStore'
import { useSettingsStore } from '../stores/settingsStore'

// Icon mapping for categories
const iconMap = {
    Image, FileText, Video, Music, Archive, Code, Package, AppWindow, File, Table, Presentation, FileType
}

// Color class mapping for categories
const colorMap = {
    '#f472b6': { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-500', icon: 'text-pink-400' },
    '#3b82f6': { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', icon: 'text-blue-400' },
    '#f97316': { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500', icon: 'text-orange-400' },
    '#8b5cf6': { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500', icon: 'text-purple-400' },
    '#eab308': { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-500', icon: 'text-yellow-400' },
    '#10b981': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500', icon: 'text-emerald-400' },
    '#6366f1': { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-500', icon: 'text-indigo-400' },
    '#06b6d4': { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-500', icon: 'text-cyan-400' },
    '#64748b': { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-500', icon: 'text-slate-400' },
    // New office colors
    '#2b579a': { bg: 'bg-[#2b579a]/10', border: 'border-[#2b579a]/20', text: 'text-[#2b579a]', icon: 'text-[#2b579a]' },
    '#217346': { bg: 'bg-[#217346]/10', border: 'border-[#217346]/20', text: 'text-[#217346]', icon: 'text-[#217346]' },
    '#d24726': { bg: 'bg-[#d24726]/10', border: 'border-[#d24726]/20', text: 'text-[#d24726]', icon: 'text-[#d24726]' },
    '#f40f02': { bg: 'bg-[#f40f02]/10', border: 'border-[#f40f02]/20', text: 'text-[#f40f02]', icon: 'text-[#f40f02]' }
}

function DashboardPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { isLoading, scanFiles, getCategoryStats } = useFileStore()
    const { history, loadHistory } = useHistoryStore()
    const { settings, loadSettings } = useSettingsStore()
    const [isOrganizing, setIsOrganizing] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)
    const [actionResult, setActionResult] = useState(null)
    const [unorganizedCount, setUnorganizedCount] = useState(0)
    const [organizedCount, setOrganizedCount] = useState(0)

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = async () => {
        await scanFiles()
        await loadHistory()
        await loadSettings()
        await countFiles()
    }

    useEffect(() => {
        if (settings?.theme === 'light') {
            document.body.classList.add('light')
        } else {
            document.body.classList.remove('light')
        }
    }, [settings])

    const countFiles = async () => {
        try {
            const unorganizedResult = await window.electronAPI.files.scanUnorganized()
            if (unorganizedResult.success) {
                setUnorganizedCount(unorganizedResult.data.length)
            }

            const totalResult = await window.electronAPI.files.scan()
            if (totalResult.success && unorganizedResult.success) {
                setOrganizedCount(totalResult.data.length - unorganizedResult.data.length)
            }
        } catch (error) {
            console.error('Failed to count files:', error)
        }
    }

    const handleOrganize = async () => {
        const unorganizedResult = await window.electronAPI.files.scanUnorganized()
        if (!unorganizedResult.success || unorganizedResult.data.length === 0) {
            setActionResult({ type: 'info', message: t('messages.noUnorganized', 'No unorganized files on your desktop!') })
            return
        }

        const filesToOrganize = unorganizedResult.data

        setIsOrganizing(true)
        setActionResult(null)

        try {
            const result = await window.electronAPI.organize.execute({ files: filesToOrganize, mode: 'move' })

            if (result.success) {
                setActionResult({ type: 'success', message: t('messages.organizedSuccess', { count: result.data.totalMoved }) })
                await loadAllData()
            } else {
                setActionResult({ type: 'error', message: result.error || t('messages.organizeFailed', 'Failed to organize') })
            }
        } catch (error) {
            setActionResult({ type: 'error', message: error.message })
        } finally {
            setIsOrganizing(false)
        }
    }



    const handleRestore = async () => {
        if (organizedCount === 0) {
            setActionResult({ type: 'info', message: t('messages.noRestored', 'No files to restore!') })
            return
        }

        setIsRestoring(true)
        setActionResult(null)

        try {
            const result = await window.electronAPI.organize.restore()

            if (result.success) {
                setActionResult({ type: 'success', message: t('messages.restoredSuccess', { count: result.data.totalRestored }) })
                await loadAllData()
            } else {
                setActionResult({ type: 'error', message: result.error || t('messages.restoreFailed', 'Failed to restore') })
            }
        } catch (error) {
            setActionResult({ type: 'error', message: error.message })
        } finally {
            setIsRestoring(false)
        }
    }


    const categoryStats = getCategoryStats()

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">{t('nav.dashboard')}</h1>
                    <p className="text-sm text-text-muted mt-1">{t('dashboard.subtitle', 'Manage and organize your desktop files')}</p>
                </div>

                <button
                    onClick={loadAllData}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-glass hover:bg-glass-hover border border-glass-border text-text-secondary hover:text-blue-500 transition-colors font-semibold disabled:opacity-50"
                >
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    <span>{t('buttons.refresh', 'Refresh')}</span>
                </button>
            </header>

            {/* Stats & Actions */}
            <section className="grid grid-cols-12 gap-4">
                {/* Stats */}
                <div className="col-span-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-glass-border bg-glass/50 hover:-translate-y-0.5 transition-transform">
                        <p className="text-4xl font-bold text-text-primary">{unorganizedCount}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Monitor size={16} className="text-blue-500" />
                            <span className="text-xs uppercase font-bold text-text-muted">Desktop</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-glass-border bg-glass/50 hover:-translate-y-0.5 transition-transform">
                        <p className="text-4xl font-bold text-text-primary">{organizedCount}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <FolderOpen size={16} className="text-emerald-500" />
                            <span className="text-xs uppercase font-bold text-text-muted">{t('dashboard.sorted', 'Sorted')}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="col-span-8 grid grid-cols-2 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleOrganize}
                        disabled={isOrganizing || isRestoring || unorganizedCount === 0}
                        className="flex items-center gap-4 px-6 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    >
                        <div className="p-3 bg-white/15 rounded-lg shrink-0">
                            {isOrganizing ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} />}
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-base">{t('dashboard.organizeFiles')}</p>
                            <p className="text-sm opacity-80 mt-0.5">
                                {unorganizedCount === 0 ? t('dashboard.allTidy', 'All tidy!') : t('dashboard.itemsToSort', { count: unorganizedCount })}
                            </p>
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleRestore}
                        disabled={isOrganizing || isRestoring || organizedCount === 0}
                        className="flex items-center gap-4 px-6 py-4 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                        <div className="p-3 bg-white/15 rounded-lg shrink-0">
                            {isRestoring ? <RefreshCw size={20} className="animate-spin" /> : <Undo2 size={20} />}
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-base">{t('dashboard.restoreDesktop')}</p>
                            <p className="text-sm opacity-80 mt-0.5">
                                {organizedCount === 0 ? t('dashboard.nothingToRestore', 'Nothing to restore') : t('dashboard.restoreItemsCount', { count: organizedCount })}
                            </p>
                        </div>
                    </motion.button>
                </div>
            </section>

            {/* Result Message */}
            {actionResult && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold ${actionResult.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}
                >
                    {actionResult.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                    <span>{actionResult.message}</span>
                </motion.div>
            )}

            {/* Categories */}
            <section className="flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-text-secondary uppercase tracking-wide">{t('dashboard.categories')}</h2>
                    <button
                        onClick={() => navigate('/files')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-blue-500 hover:bg-blue-500/10 font-semibold transition-colors"
                    >
                        <span>{t('buttons.viewAll', 'View all')}</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categoryStats.filter(cat => cat.id !== 'others' || cat.count > 0).sort((a, b) => b.count - a.count).map((cat) => {
                            const IconComponent = iconMap[cat.icon] || File
                            const colors = colorMap[cat.color] || colorMap['#64748b']

                            return (
                                <motion.button
                                    key={cat.id}
                                    onClick={() => navigate(`/files/${cat.id}`)}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex flex-col items-center justify-center p-5 rounded-lg border ${colors.bg} ${colors.border} transition-all`}
                                >
                                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-2`}>
                                        <IconComponent size={22} className={colors.icon} />
                                    </div>
                                    <p className={`text-xl font-bold ${colors.text}`}>{cat.count}</p>
                                    <p className="text-xs text-text-muted font-bold uppercase mt-1.5 truncate w-full">{t(`categories.${cat.id.toLowerCase()}`, cat.name)}</p>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default DashboardPage
