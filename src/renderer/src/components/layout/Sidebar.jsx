import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, FolderOpen, Settings, Lightbulb, X, PanelLeft, PanelLeftClose } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'

function Sidebar({ isCollapsed, onToggle }) {
    const { t } = useTranslation()
    const { settings, updateSettings } = useSettingsStore()

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
        { path: '/files', icon: FolderOpen, label: t('nav.files') },
        { path: '/settings', icon: Settings, label: t('nav.settings') },
    ]

    const handleDismissTip = () => {
        updateSettings({ isFirstRun: false })
    }

    return (
        <aside className={`bg-bg-secondary border-r border-glass-border flex flex-col shrink-0 transition-all duration-300 ${isCollapsed ? 'w-20 p-4' : 'w-72 p-6'}`}>
            {/* Brand & Toggle */}
            <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <h2 className="text-xl font-bold text-text-primary">DesktopSort</h2>
                )}
                <button
                    onClick={onToggle}
                    className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-glass-hover transition-colors"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1">
                <div className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            title={isCollapsed ? item.label : undefined}
                            className={({ isActive }) =>
                                `flex items-center rounded-lg text-sm font-semibold transition-colors ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} ${isActive
                                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                    : 'text-text-secondary hover:bg-glass-hover hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={20} className="shrink-0" />
                            {!isCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Quick Tip - Only show on first run and when not collapsed */}
            {settings?.isFirstRun && !isCollapsed && (
                <div className="mt-auto">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 relative">
                        <button
                            onClick={handleDismissTip}
                            className="absolute top-2 right-2 p-1 rounded-md text-amber-500/60 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                            aria-label="Dismiss tip"
                        >
                            <X size={14} />
                        </button>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-amber-500/20 rounded-lg shrink-0">
                                <Lightbulb size={16} className="text-amber-500" />
                            </div>
                            <p className="text-xs font-bold text-text-primary uppercase">{t('sidebar.quickTip', 'Quick Tip')}</p>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            {t('sidebar.tipDescription', 'Click "Organize Files" to sort your desktop!')}
                        </p>
                    </div>
                </div>
            )}
        </aside>
    )
}

export default Sidebar
