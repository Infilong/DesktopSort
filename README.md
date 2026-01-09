# DesktopSort

A premium, high-performance desktop file organizer built with Electron, React, and Tailwind CSS. Streamline your workspace with intelligent categorization and instant search.

<div align="center">
  <img src="assets/demo.gif" width="800" alt="DesktopSort Demo" />
</div>

## ✨ Key Features

### 🔍 O(1) Instant Search
Experience lightning-fast file searching powered by a **Trie (Prefix Tree)** data structure.
- **Instant Results**: Results appear as you type with zero lag.
- **Global Access**: Search is available on all pages (except Settings).
- **Keyboard Friendly**: Press `Ctrl + K` to focus the search bar from anywhere.
- **Smart Navigation**: Use arrow keys and Enter to instantly open files or applications directly from the search results.

### 🗂️ Smart File Organization
- **Auto-Categorize**: Sort your messy desktop files into tidy folders like Images, Documents, Videos, Code, and more with a single click.
- **One-Click Restore**: Changed your mind? Use the Restore function to move everything back to exactly where it was on your desktop.
- **Native Experience**: High-resolution file icons and direct "Open in Folder" support.

### 🎨 Premium Design
- **Modern UI**: A clean, spacious, and responsive interface inspired by modern design aesthetics.
- **Glassmorphism**: Subtle blur effects and rich gradients for a state-of-the-art feel.
- **Frameless Window**: Custom window controls and draggable header for a seamless desktop experience.

## 🚀 How to Use

1.  **Search & Launch**: Press `Ctrl + K` at any time to find any file or app on your desktop. It's the fastest way to get to your work.
2.  **Organize**: From the Dashboard, click **"Organize Files"**. Your desktop files will be instantly categorized and moved to the `Desktop/DesktopSort` folder.
3.  **Browse**: Use the Sidebar to navigate through different categories and manage your files.
4.  **Restore**: If you need to revert the organization, use the **"Restore Desktop"** button in the dashboard or settings to move files back to their original locations.
5.  **Window Management**: Drag the empty space in the header to move the window, or use the corners to resize.

## 🛠️ Tech Stack

- **Electron**: Cross-platform runtime
- **React**: UI logic and components
- **Tailwind CSS**: Modern styling system
- **Zustand**: Lightweight state management
- **Trie Algorithm**: O(1) search indexing
- **Framer Motion**: Smooth micro-animations

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
