import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, File, Image, FileText, Video, Music, Archive, Code, Package, AppWindow } from 'lucide-react'
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
    others: File
}

function SearchBar() {
    const navigate = useNavigate()
    const inputRef = useRef(null)
    const { query, results, isSearching, isOpen, setQuery, clearSearch, setOpen } = useSearchStore()
    const [selectedIndex, setSelectedIndex] = useState(0)

    // Keyboard shortcut: Ctrl+K to focus
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault()
                setOpen(true)
                setTimeout(() => inputRef.current?.focus(), 50)
            }
            if (e.key === 'Escape') {
                clearSearch()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [setOpen, clearSearch])

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(0)
    }, [results])

    // Handle keyboard navigation in results
    const handleKeyDown = (e) => {
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

    // Handle input change with debounce
    const handleInputChange = (e) => {
        const value = e.target.value
        setQuery(value)
    }

    const IconComponent = (category) => {
        return categoryIcons[category] || File
    }

    return (
        <div className="relative">
            {/* Search Input */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setOpen(true)}
                    placeholder="Search files..."
                    className="w-64 pl-11 pr-16 py-2.5 rounded-lg bg-glass border border-glass-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted bg-glass-hover px-1.5 py-0.5 rounded border border-glass-border">
                    ⌘K
                </span>
            </div>

            {/* Results Dropdown */}
            <AnimatePresence>
                {isOpen && query.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-glass-border rounded-lg shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
                    >
                        {isSearching ? (
                            <div className="p-4 text-center text-text-muted text-sm">
                                Searching...
                            </div>
                        ) : results.length === 0 ? (
                            <div className="p-4 text-center text-text-muted text-sm">
                                No results found
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
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isSelected
                                                ? 'bg-blue-500/20 border-l-2 border-blue-500'
                                                : 'hover:bg-glass-hover border-l-2 border-transparent'
                                                }`}
                                        >
                                            <Icon size={18} className="text-text-muted shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
                                                <p className="text-xs text-text-muted truncate capitalize">{file.category}</p>
                                            </div>
                                        </button>
                                    )
                                })}
                                {results.length > 10 && (
                                    <div className="px-4 py-2 text-xs text-text-muted text-center border-t border-glass-border">
                                        +{results.length - 10} more results
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SearchBar
