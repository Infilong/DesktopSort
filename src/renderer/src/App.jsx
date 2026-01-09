import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import FilesPage from './pages/FilesPage'
import SettingsPage from './pages/SettingsPage'

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="files" element={<FilesPage />} />
                    <Route path="files/:category" element={<FilesPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default App
