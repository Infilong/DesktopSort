import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Settings,
    Monitor,
    Moon,
    Sun,
    LayoutGrid,
    List,
    FolderOpen,
    Save,
    CheckCircle,
    History,
    Trash2,
    Undo2
} from 'lucide-react'
import { useSettingsStore } from '../stores/settingsStore'
import { useHistoryStore } from '../stores/historyStore'
import { useFileStore } from '../stores/fileStore'

function SettingsPage() {
    const { settings, updateSettings, loadSettings, isLoading } = useSettingsStore()
    const { history, clearHistory, loadHistory } = useHistoryStore()
    const { scanFiles } = useFileStore()

    const [localSettings, setLocalSettings] = useState(settings || {})
    const [hasChanges, setHasChanges] = useState(false)
    const [saveStatus, setSaveStatus] = useState(null)

    useEffect(() => {
        loadSettings()
        loadHistory()
    }, [])

    useEffect(() => {
        if (settings) {
            setLocalSettings(settings)
        }
    }, [settings])

    useEffect(() => {
        // Check if current settings differ from saved settings
        if (settings && localSettings) {
            const isDifferent = JSON.stringify(settings) !== JSON.stringify(localSettings)
            setHasChanges(isDifferent)
        }
    }, [localSettings, settings])

    // Apply theme preview
    useEffect(() => {
        if (localSettings.theme === 'light') {
            document.body.classList.add('light')
        } else {
            document.body.classList.remove('light')
        }
    }, [localSettings.theme])

    const handleSave = async () => {
        try {
            setSaveStatus('saving')
            const result = await window.electronAPI.settings.update(localSettings)
            if (result.success) {
                updateSettings(result.data)
                setSaveStatus('saved')
                setTimeout(() => setSaveStatus(null), 2000)
            } else {
                setSaveStatus('error')
            }
        } catch (error) {
            setSaveStatus('error')
        }
    }

    const handleUndo = async (operationId) => {
        try {
            await window.electronAPI.organize.undo(operationId)
            await loadHistory()
            await scanFiles()
        } catch (error) {
            console.error('Undo failed:', error)
        }
    }

    const handleClearHistory = async () => {
        const confirm = await window.electronAPI.dialog.confirm({
            title: 'Clear History',
            message: 'Are you sure you want to clear the activity history?',
            confirmText: 'Clear History',
            cancelText: 'Cancel'
        })

        if (confirm.confirmed) {
            await window.electronAPI.history.clear()
            await loadHistory()
        }
    }

    if (!localSettings) return null

    return (
        <div className="space-y-8 pb-10 max-w-4xl mx-auto px-6 pt-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-text-secondary mt-1 font-medium">Configure your preferences</p>
                </div>

                {hasChanges && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all shadow-lg shadow-blue-500/20"
                    >
                        {saveStatus === 'saving' ? (
                            <>Saving...</>
                        ) : saveStatus === 'saved' ? (
                            <><CheckCircle size={18} /> Saved</>
                        ) : (
                            <><Save size={18} /> Save Changes</>
                        )}
                    </motion.button>
                )}
            </div>

            {/* Organization Settings */}
            <div className="section-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <FolderOpen size={22} className="text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Organization</h2>
                        <p className="text-text-muted text-sm">How files are organized</p>
                    </div>
                </div>

                <div className="space-y-6 pl-2">
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-3">Default Mode</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, organizeMode: 'move' })}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${localSettings.organizeMode === 'move'
                                        ? 'border-blue-500 bg-blue-500/5'
                                        : 'border-glass-border hover:border-text-secondary/30'
                                    }`}
                            >
                                <p className={`font-bold ${localSettings.organizeMode === 'move' ? 'text-blue-500' : ''}`}>Move to Dashboard</p>
                                <p className="text-xs text-text-muted mt-1">Move files to organized folders</p>
                            </button>

                            <button
                                onClick={() => setLocalSettings({ ...localSettings, organizeMode: 'copy' })}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${localSettings.organizeMode === 'copy'
                                        ? 'border-blue-500 bg-blue-500/5'
                                        : 'border-glass-border hover:border-text-secondary/30'
                                    }`}
                            >
                                <p className={`font-bold ${localSettings.organizeMode === 'copy' ? 'text-blue-500' : ''}`}>Copy</p>
                                <p className="text-xs text-text-muted mt-1">Copy files, keep originals</p>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Confirm before organizing</p>
                                <p className="text-xs text-text-muted">Show confirmation dialog before organizing files</p>
                            </div>
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, confirmBeforeOrganize: !localSettings.confirmBeforeOrganize })}
                                className={`w-12 h-7 rounded-full transition-colors relative ${localSettings.confirmBeforeOrganize ? 'bg-blue-500' : 'bg-glass-border'
                                    }`}
                            >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${localSettings.confirmBeforeOrganize ? 'left-6' : 'left-1'
                                    }`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Show preview</p>
                                <p className="text-xs text-text-muted">Preview changes before executing</p>
                            </div>
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, showPreview: !localSettings.showPreview })}
                                className={`w-12 h-7 rounded-full transition-colors relative ${localSettings.showPreview ? 'bg-blue-500' : 'bg-glass-border'
                                    }`}
                            >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${localSettings.showPreview ? 'left-6' : 'left-1'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appearance Settings */}
            <div className="section-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <Monitor size={22} className="text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Appearance</h2>
                        <p className="text-text-muted text-sm">Customize the look and feel</p>
                    </div>
                </div>

                <div className="space-y-6 pl-2">
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-3">Theme</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${localSettings.theme === 'dark'
                                        ? 'border-blue-500 bg-blue-500/5'
                                        : 'border-glass-border hover:border-text-secondary/30'
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-white">
                                    <Moon size={16} />
                                </div>
                                <div className="text-left">
                                    <p className={`font-bold ${localSettings.theme === 'dark' ? 'text-blue-500' : ''}`}>Dark</p>
                                    <p className="text-xs text-text-muted">Dark background</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${localSettings.theme === 'light'
                                        ? 'border-blue-500 bg-blue-500/5'
                                        : 'border-glass-border hover:border-text-secondary/30'
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-orange-500">
                                    <Sun size={16} />
                                </div>
                                <div className="text-left">
                                    <p className={`font-bold ${localSettings.theme === 'light' ? 'text-blue-500' : ''}`}>Light</p>
                                    <p className="text-xs text-text-muted">Light background</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-3">Default View</label>
                        <div className="grid grid-cols-2 gap-4 bg-glass p-1.5 rounded-xl border border-glass-border">
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, defaultView: 'grid' })}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${localSettings.defaultView === 'grid'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'text-text-secondary hover:text-white'
                                    }`}
                            >
                                <LayoutGrid size={16} />
                                Grid View
                            </button>
                            <button
                                onClick={() => setLocalSettings({ ...localSettings, defaultView: 'list' })}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${localSettings.defaultView === 'list'
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'text-text-secondary hover:text-white'
                                    }`}
                            >
                                <List size={16} />
                                List View
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="section-card p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <History size={22} className="text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">History</h2>
                            <p className="text-text-muted text-sm">{history.length} operations recorded</p>
                        </div>
                    </div>

                    {history.length > 0 && (
                        <button
                            onClick={handleClearHistory}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                            Clear All
                        </button>
                    )}
                </div>

                <div className="space-y-3 pl-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="text-center py-8 text-text-muted italic">No history yet</div>
                    ) : (
                        history.map((entry) => (
                            <div key={entry.id} className="flex items-start gap-4 p-4 rounded-xl bg-glass border border-glass-border/50">
                                <div className="mt-1">
                                    {entry.type === 'restore' ? (
                                        <Undo2 size={18} className="text-amber-500" />
                                    ) : (
                                        <CheckCircle size={18} className="text-emerald-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm">{entry.summary}</p>
                                    <p className="text-xs text-text-muted mt-0.5">
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                {entry.canUndo && (
                                    <button
                                        onClick={() => handleUndo(entry.id)}
                                        className="text-xs text-blue-500 hover:text-blue-400 font-medium underline"
                                    >
                                        Undo
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
