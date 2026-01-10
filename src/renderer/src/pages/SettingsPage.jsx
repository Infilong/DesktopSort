import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
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
    Undo2,
    Languages
} from 'lucide-react'
import { useSettingsStore } from '../stores/settingsStore'
import { useHistoryStore } from '../stores/historyStore'
import { useFileStore } from '../stores/fileStore'

const LANGUAGES = [
    { code: 'auto', name: 'Auto (System)' },
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文 (简体)' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ur', name: 'اردو' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'it', name: 'Italiano' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'mr', name: 'मराठी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' }
]

function SettingsPage() {
    const { t, i18n } = useTranslation()
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

    // Sync i18n when language setting changes
    useEffect(() => {
        if (localSettings.language) {
            if (localSettings.language === 'auto') {
                i18n.changeLanguage(navigator.language.split('-')[0])
            } else {
                i18n.changeLanguage(localSettings.language)
            }
        }
    }, [localSettings.language])

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
                    <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
                    <p className="text-text-secondary mt-1 font-medium">{t('settings.titleDescription', 'Configure your preferences')}</p>
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
                            <><CheckCircle size={18} /> {t('settings.saved', 'Saved')}</>
                        ) : (
                            <><Save size={18} /> {t('settings.saveChanges', 'Save Changes')}</>
                        )}
                    </motion.button>
                )}
            </div>

            {/* Language & Appearance Settings */}
            <div className="section-card p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Languages size={22} className="text-indigo-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{t('settings.general')}</h2>
                        <p className="text-text-muted text-sm">{t('settings.generalDescription', 'Language and visual preferences')}</p>
                    </div>
                </div>

                <div className="space-y-6 pl-2">
                    {/* Language Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-3">{t('settings.language')}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <select
                                    value={localSettings.language || 'auto'}
                                    onChange={(e) => setLocalSettings({ ...localSettings, language: e.target.value })}
                                    className="w-full bg-glass border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                                >
                                    {LANGUAGES.map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                            <p className="text-xs text-text-muted flex items-center">
                                {t('settings.languageDescription')}
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-glass-border w-full my-6" />

                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-3">{t('settings.theme')}</label>
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
                                    <p className={`font-bold ${localSettings.theme === 'dark' ? 'text-blue-500' : ''}`}>{t('settings.dark')}</p>
                                    <p className="text-xs text-text-muted">{t('settings.darkDescription', 'Dark background')}</p>
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
                                    <p className={`font-bold ${localSettings.theme === 'light' ? 'text-blue-500' : ''}`}>{t('settings.light')}</p>
                                    <p className="text-xs text-text-muted">{t('settings.lightDescription', 'Light background')}</p>
                                </div>
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
                            <h2 className="text-lg font-bold">{t('dashboard.recentActivity')}</h2>
                            <p className="text-text-muted text-sm">{history.length} {t('settings.operationsRecorded', 'operations recorded')}</p>
                        </div>
                    </div>

                    {history.length > 0 && (
                        <button
                            onClick={handleClearHistory}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                            {t('settings.clearAll', 'Clear All')}
                        </button>
                    )}
                </div>

                <div className="space-y-3 pl-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="text-center py-8 text-text-muted italic">{t('settings.noHistory', 'No history yet')}</div>
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
                                        {t('settings.undo', 'Undo')}
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
