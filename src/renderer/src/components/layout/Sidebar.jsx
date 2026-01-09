import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, FolderOpen, Settings, Lightbulb } from 'lucide-react'

function Sidebar() {
    const { t } = useTranslation()

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
        { path: '/files', icon: FolderOpen, label: t('nav.files') },
        { path: '/settings', icon: Settings, label: t('nav.settings') },
    ]

    return (
        <aside className="w-72 bg-bg-secondary border-r border-glass-border p-6 flex flex-col shrink-0">
            {/* Brand */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-text-primary">DesktopSort</h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1">
                <div className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive
                                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                    : 'text-text-secondary hover:bg-glass-hover hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={20} className="shrink-0" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Quick Tip */}
            <div className="mt-auto">
                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
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
        </aside>
    )
}

export default Sidebar
