import { Minus, Square, X, Copy } from 'lucide-react'

function Header({ isMaximized }) {
    const handleMinimize = () => window.electronAPI.window.minimize()
    const handleMaximize = () => window.electronAPI.window.maximize()
    const handleClose = () => window.electronAPI.window.close()

    return (
        <header className="flex items-center justify-between h-11 bg-bg-secondary border-b border-glass-border drag-region">
            {/* App Title */}
            <div className="flex items-center gap-2.5 px-4">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-[10px] font-bold text-white">DS</span>
                </div>
                <span className="text-sm font-semibold text-text-secondary">DesktopSort</span>
            </div>

            {/* Spacer for drag region */}
            <div className="flex-1" />

            {/* Window Controls */}
            <div className="flex items-center no-drag">
                <button
                    onClick={handleMinimize}
                    className="w-12 h-11 flex items-center justify-center text-text-secondary hover:bg-glass-hover transition-colors"
                    aria-label="Minimize"
                >
                    <Minus size={16} />
                </button>
                <button
                    onClick={handleMaximize}
                    className="w-12 h-11 flex items-center justify-center text-text-secondary hover:bg-glass-hover transition-colors"
                    aria-label={isMaximized ? 'Restore' : 'Maximize'}
                >
                    {isMaximized ? <Copy size={14} /> : <Square size={14} />}
                </button>
                <button
                    onClick={handleClose}
                    className="w-12 h-11 flex items-center justify-center text-text-secondary hover:bg-red-500 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <X size={16} />
                </button>
            </div>
        </header>
    )
}

export default Header
