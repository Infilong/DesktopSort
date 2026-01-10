# DesktopSort

A premium, high-performance desktop file organizer built with Electron, React, and Tailwind CSS. Streamline your workspace with intelligent categorization, instant search, and multi-language support.

<div align="center">
  <img src="assets/demo.gif" width="800" alt="DesktopSort Demo" />
</div>

## ✨ Key Features

### 🔍 Spotlight-Style Search
Experience lightning-fast file searching with a beautiful macOS Spotlight-inspired interface.
- **Instant Results**: Powered by a **Trie (Prefix Tree)** data structure for O(1) prefix matching.
- **Global Shortcut**: Press `Ctrl + K` from anywhere to open the search modal.
- **Keyboard Navigation**: Use arrow keys to navigate and Enter to instantly open files.
- **Elegant UI**: Centered modal with backdrop blur and smooth animations.

### 🗂️ Smart File Organization
- **13 Categories**: Word, Excel, PowerPoint, PDF, Images, Videos, Audio, Archives, Code, Apps, Installers, Documents, and Others.
- **Auto-Categorize**: Sort your messy desktop with a single click.
- **One-Click Restore**: Move everything back to your desktop instantly.
- **Smart Sorting**: Categories automatically sort by file count (most files first).

### 🌍 Multi-Language Support
- **20 Languages**: English, Chinese, Spanish, French, German, Japanese, Korean, and more.
- **Auto-Detection**: Automatically uses your system language on first launch.
- **Easy Switching**: Change language anytime from Settings.

### 🎨 Premium Design
- **Collapsible Sidebar**: Toggle between full and icon-only sidebar modes.
- **Glassmorphism**: Subtle blur effects and rich gradients.
- **Frameless Window**: Custom window controls with smooth dragging and resizing.
- **Auto-Dismiss Notifications**: Action feedback fades elegantly after 3 seconds.

## 🚀 How to Use

1. **Search & Launch**: Press `Ctrl + K` to open Spotlight search. Find and open any file instantly.
2. **Organize**: Click **"Organize Files"** on the Dashboard to auto-categorize your desktop.
3. **Browse**: Navigate categories from the sidebar. Click any category to view its files.
4. **Restore**: Use **"Restore Desktop"** to move all organized files back.
5. **Customize**: Visit Settings to change language, theme, and organization preferences.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Electron** | Cross-platform desktop runtime |
| **React** | UI components and state |
| **Tailwind CSS** | Utility-first styling |
| **Zustand** | Lightweight state management |
| **Trie Algorithm** | O(1) search indexing |
| **Framer Motion** | Smooth animations |
| **i18next** | Internationalization |

## 📦 Installation & Development

```bash
# Clone the repository
git clone https://github.com/Infilong/DesktopSort.git

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build:win
```

## 📄 License

MIT © [Infilong](https://github.com/Infilong)
