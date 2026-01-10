import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search, X, File, Image, FileText, Video, Music, Archive, Code, Package, AppWindow, Table, Presentation, FileType } from 'lucide-react'
import { useSearchStore } from '../stores/searchStore'

// Icon mapping for file categories
const categoryIcons = {
    images: Image,
    documents: FileText,
    videos: Video,
    audio: Music,
    archives: Archive,
    code: Code,
    installers: Package,
    apps: AppWindow,
    others: File,
    word: FileText,
    excel: Table,
    powerpoint: Presentation,
    pdf: FileType
}

function SearchBar() {
    const { t } = useTranslation()
    const inputRef = useRef(null)
    const { query, results, isSearching, isOpen, setQuery, clearSearch, setOpen } = useSearchStore()
    const [selectedIndex, setSelectedIndex] = useState(0)

    // Keyboard shortcut: Ctrl+K to open spotlight
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setOpen(true)
                setTimeout(() => inputRef.current?.focus(), 50)
            }
            if (e.key === 'Escape' && isOpen) {
                clearSearch()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [setOpen, clearSearch, isOpen])

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(0)
    }, [results])

    // Handle keyboard navigation in results
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            clearSearch()
            return
        }

        if (results.length === 0) return

        const maxIndex = Math.min(results.length, 10) - 1

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => Math.min(prev + 1, maxIndex))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => Math.max(prev - 1, 0))
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleResultClick(results[selectedIndex])
        }
    }

    // Handle result click - open the file/app
    const handleResultClick = async (file) => {
        clearSearch()
        try {
            await window.electronAPI.shell.openPath(file.path)
        } catch (error) {
            console.error('Failed to open file:', error)
        }
    }

    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value
        setQuery(value)
    }

    const IconComponent = (category) => {
        return categoryIcons[category?.toLowerCase()] || File
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            clearSearch()
        }
    }

    return (
        <>
            {/* Spotlight Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={handleBackdropClick}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="w-full max-w-2xl bg-bg-secondary rounded-2xl shadow-2xl border border-glass-border overflow-hidden"
                        >
                            {/* Search Input */}
                            <div className="flex items-center gap-4 px-6 py-5 border-b border-glass-border">
                                <Search size={24} className="text-blue-500 shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t('app.search')}
                                    className="flex-1 bg-transparent text-xl text-text-primary placeholder-text-muted focus:outline-none"
                                    autoFocus
                                />
                                {query && (
                                    <button
                                        onClick={clearSearch}
                                        className="p-1.5 rounded-lg hover:bg-glass-hover text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Results */}
                            <div className="max-h-[50vh] overflow-y-auto">
                                {query.length === 0 ? (
                                    <div className="p-8 text-center text-text-muted">
                                        <p className="text-sm">{t('messages.typeToSearch', 'Type to search files...')}</p>
                                    </div>
                                ) : isSearching ? (
                                    <div className="p-8 text-center text-text-muted">
                                        <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                                        <p className="text-sm">{t('messages.searching', 'Searching...')}</p>
                                    </div>
                                ) : results.length === 0 ? (
                                    <div className="p-8 text-center text-text-muted">
                                        <p className="text-sm">{t('messages.noResults', 'No results found')}</p>
                                    </div>
                                ) : (
                                    <div className="py-2">
                                        {results.slice(0, 10).map((file, index) => {
                                            const Icon = IconComponent(file.category)
                                            const isSelected = index === selectedIndex
                                            return (
                                                <button
                                                    key={file.path}
                                                    onClick={() => handleResultClick(file)}
                                                    className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-all ${isSelected
                                                        ? 'bg-blue-500/15'
                                                        : 'hover:bg-glass-hover'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500/20' : 'bg-glass'}`}>
                                                        <Icon size={20} className={isSelected ? 'text-blue-500' : 'text-text-muted'} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-base font-medium text-text-primary truncate">{file.name}</p>
                                                        <p className="text-xs text-text-muted truncate capitalize">{t(`categories.${(file.category || 'others').toLowerCase()}`, file.category || 'Others')}</p>
                                                    </div>
                                                    {isSelected && (
                                                        <span className="text-xs text-text-muted bg-glass px-2 py-1 rounded">↵ Open</span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                        {results.length > 10 && (
                                            <div className="px-6 py-3 text-xs text-text-muted text-center border-t border-glass-border">
                                                +{results.length - 10} {t('messages.moreResults', 'more results')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer hints */}
                            <div className="px-6 py-3 border-t border-glass-border flex items-center gap-6 text-xs text-text-muted">
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 bg-glass rounded text-[10px]">↑↓</kbd>
                                    Navigate
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 bg-glass rounded text-[10px]">↵</kbd>
                                    Open
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 bg-glass rounded text-[10px]">Esc</kbd>
                                    Close
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default SearchBar
