import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

function Layout() {
    const [isMaximized, setIsMaximized] = useState(false)

    useEffect(() => {
        window.electronAPI.window.onMaximizedChange(setIsMaximized)
    }, [])

    return (
        <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
            <Header isMaximized={isMaximized} />
            <div className="flex flex-1 min-h-0">
                <Sidebar />
                {/* Main content with proper padding */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="h-full max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout
