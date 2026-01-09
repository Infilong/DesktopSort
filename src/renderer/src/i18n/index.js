import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      "app": { "title": "DesktopSort", "search": "Search files..." },
      "nav": { "dashboard": "Dashboard", "files": "Files", "settings": "Settings" },
      "dashboard": {
        "subtitle": "Manage and organize your desktop files",
        "organizeFiles": "Organize Files",
        "restoreDesktop": "Restore Desktop",
        "sorted": "Sorted",
        "categories": "Categories",
        "recentActivity": "Recent Activity",
        "allTidy": "All tidy!",
        "itemsToSort": "{{count}} items to sort",
        "nothingToRestore": "Nothing to restore",
        "restoreItemsCount": "Restore {{count}} items"
      },
      "categories": {
        "images": "Images", "documents": "Documents", "videos": "Videos", "audio": "Audio",
        "archives": "Archives", "code": "Code", "installers": "Installers", "apps": "Apps", "others": "Others"
      },
      "settings": {
        "title": "Settings", "titleDescription": "Configure your preferences",
        "general": "General", "generalDescription": "Language and visual preferences",
        "language": "Language", "languageDescription": "Choose your preferred language",
        "theme": "Theme", "dark": "Dark", "light": "Light",
        "darkDescription": "Dark background", "lightDescription": "Light background",
        "organization": "Organization", "organizationDescription": "How files are organized",
        "defaultMode": "Default Mode", "move": "Move", "copy": "Copy",
        "moveDescription": "Move files to organized folders", "copyDescription": "Copy files, keep originals",
        "confirmBeforeOrganize": "Confirm before organizing", "confirmDescription": "Show confirmation dialog before organizing files",
        "showPreview": "Show preview", "previewDescription": "Preview changes before executing",
        "clearAll": "Clear All", "noHistory": "No history yet", "undo": "Undo", "saved": "Saved", "saveChanges": "Save Changes",
        "operationsRecorded": "operations recorded"
      },
      "buttons": { "refresh": "Refresh", "viewAll": "View all", "yesOrganize": "Yes, Organize", "yesRestore": "Yes, Restore" },
      "messages": {
        "noUnorganized": "No unorganized files on your desktop!",
        "confirmOrganize": "Organize {{count}} files?",
        "organizeDetail": "Files will be moved to categorized folders inside \"DesktopSort\".\n\nYou can restore them anytime.",
        "organizedSuccess": "Organized {{count}} files!",
        "organizeFailed": "Failed to organize",
        "noRestored": "No files to restore!",
        "confirmRestore": "Restore {{count}} files to Desktop?",
        "restoreDetail": "All files will be moved back to your Desktop.",
        "restoredSuccess": "Restored {{count}} files!",
        "restoreFailed": "Failed to restore"
      }
    }
  },
  zh: {
    translation: {
      "app": { "title": "DesktopSort", "search": "搜索文件..." },
      "nav": { "dashboard": "仪表板", "files": "文件", "settings": "设置" },
      "dashboard": {
        "subtitle": "管理并整理您的桌面文件",
        "organizeFiles": "整理文件",
        "restoreDesktop": "恢复桌面",
        "sorted": "已分类",
        "categories": "分类",
        "recentActivity": "最近活动",
        "allTidy": "非常整洁！",
        "itemsToSort": "{{count}} 个待处理项目",
        "nothingToRestore": "没有可恢复的内容",
        "restoreItemsCount": "恢复 {{count}} 个项目"
      },
      "categories": {
        "images": "图片", "documents": "文档", "videos": "视频", "audio": "音频",
        "archives": "压缩包", "code": "代码", "installers": "安装包", "apps": "应用", "others": "其他"
      },
      "settings": {
        "title": "设置", "titleDescription": "配置您的偏好设置",
        "general": "常规", "generalDescription": "语言和视觉偏好",
        "language": "语言", "languageDescription": "选择您的首选语言",
        "theme": "主题", "dark": "深色", "light": "浅色",
        "darkDescription": "深色背景", "lightDescription": "浅色背景",
        "organization": "组织", "organizationDescription": "文件如何组织",
        "defaultMode": "默认模式", "move": "移动", "copy": "复制",
        "moveDescription": "将文件移动到组织好的文件夹中", "copyDescription": "复制文件，保留原件",
        "confirmBeforeOrganize": "整理前确认", "confirmDescription": "在整理文件前显示确认对话框",
        "showPreview": "显示预览", "previewDescription": "在执行前预览更改",
        "clearAll": "全部清除", "noHistory": "暂无记录", "undo": "撤销", "saved": "已保存", "saveChanges": "保存更改",
        "operationsRecorded": "条操作记录"
      },
      "buttons": { "refresh": "刷新", "viewAll": "查看全部", "yesOrganize": "是的，整理", "yesRestore": "是的，恢复" },
      "messages": {
        "noUnorganized": "您的桌面上没有未整理的文件！",
        "confirmOrganize": "确认整理 {{count}} 个文件吗？",
        "organizeDetail": "文件将被移动到 \"DesktopSort\" 内的分类文件夹中。\n\n您可以随时恢复它们。",
        "organizedSuccess": "成功整理了 {{count}} 个文件！",
        "organizeFailed": "整理失败",
        "noRestored": "没有可恢复的文件！",
        "confirmRestore": "将 {{count}} 个文件恢复到桌面吗？",
        "restoreDetail": "所有文件将移回您的桌面。",
        "restoredSuccess": "成功恢复了 {{count}} 个文件！",
        "restoreFailed": "恢复失败"
      }
    }
  },
  es: {
    translation: {
      "app": { "title": "DesktopSort", "search": "Buscar archivos..." },
      "nav": { "dashboard": "Tablero", "files": "Archivos", "settings": "Ajustes" },
      "dashboard": { "subtitle": "Administra y organiza tus archivos", "organizeFiles": "Organizar", "restoreDesktop": "Restaurar", "sorted": "Ordenados", "categories": "Categorías" },
      "settings": { "title": "Ajustes", "language": "Idioma", "dark": "Oscuro", "light": "Claro", "general": "General", "organization": "Organización" },
      "buttons": { "refresh": "Refrescar", "viewAll": "Ver todo" }
    }
  },
  hi: {
    translation: {
      "app": { "title": "DesktopSort", "search": "फ़ाइलें खोजें..." },
      "nav": { "dashboard": "डैशबोर्ड", "files": "फ़ाइलें", "settings": "सेटिंग्स" },
      "dashboard": { "subtitle": "फ़ाइलें व्यवस्थित करें", "organizeFiles": "व्यवस्थित करें", "restoreDesktop": "पुनर्स्थापित करें", "sorted": "क्रमबद्ध", "categories": "श्रेणियाँ" },
      "settings": { "title": "सेटिंग्स", "language": "भाषा", "dark": "डार्क", "light": "लाइट", "general": "सामान्य", "organization": "संगठन" },
      "buttons": { "refresh": "ताज़ा करें", "viewAll": "सभी देखें" }
    }
  },
  fr: {
    translation: {
      "app": { "title": "DesktopSort", "search": "Rechercher..." },
      "nav": { "dashboard": "Tableau de bord", "files": "Fichiers", "settings": "Paramètres" },
      "dashboard": { "subtitle": "Gérez vos fichiers", "organizeFiles": "Organiser", "restoreDesktop": "Restaurer", "sorted": "Triés", "categories": "Catégories" },
      "settings": { "title": "Paramètres", "language": "Langue", "dark": "Sombre", "light": "Clair", "general": "Général", "organization": "Organisation" },
      "buttons": { "refresh": "Actualiser", "viewAll": "Tout voir" }
    }
  },
  ar: {
    translation: {
      "app": { "title": "DesktopSort", "search": "بحث عن الملفات..." },
      "nav": { "dashboard": "لوحة القيادة", "files": "الملفات", "settings": "الإعدادات" },
      "dashboard": { "subtitle": "إدارة وتنظيم ملفاتك", "organizeFiles": "تنظيم الملفات", "restoreDesktop": "استعادة", "sorted": "مرتبة", "categories": "الفئات" },
      "settings": { "title": "الإعدادات", "language": "اللغة", "dark": "داكن", "light": "فاتح", "general": "عام", "organization": "تنظيم" },
      "buttons": { "refresh": "تحديث", "viewAll": "مشاهدة الكل" }
    }
  },
  ru: {
    translation: {
      "app": { "title": "DesktopSort", "search": "Поиск файлов..." },
      "nav": { "dashboard": "Панель", "files": "Файлы", "settings": "Настройки" },
      "dashboard": { "subtitle": "Управление файлами", "organizeFiles": "Организовать", "restoreDesktop": "Восстановить", "sorted": "Сортировано", "categories": "Категории" },
      "settings": { "title": "Настройки", "language": "Язык", "dark": "Темная", "light": "Светлая", "general": "Общие", "organization": "Организация" },
      "buttons": { "refresh": "Обновить", "viewAll": "Показать все" }
    }
  },
  ja: {
    translation: {
      "app": { "title": "DesktopSort", "search": "ファイルを検索..." },
      "nav": { "dashboard": "ダッシュボード", "files": "ファイル", "settings": "設定" },
      "dashboard": { "subtitle": "ファイルを管理および整理", "organizeFiles": "整理する", "restoreDesktop": "復元する", "sorted": "整理済み", "categories": "カテゴリー" },
      "settings": { "title": "設定", "language": "言語", "dark": "ダーク", "light": "ライト", "general": "一般", "organization": "整理" },
      "buttons": { "refresh": "更新", "viewAll": "すべて表示" }
    }
  },
  ko: {
    translation: {
      "app": { "title": "DesktopSort", "search": "파일 검색..." },
      "nav": { "dashboard": "대시보드", "files": "파일", "settings": "설정" },
      "dashboard": { "subtitle": "파일 관리 및 정리", "organizeFiles": "파일 정리", "restoreDesktop": "바탕화면 복원", "sorted": "정리됨", "categories": "카테고리" },
      "settings": { "title": "설정", "language": "언어", "dark": "다크", "light": "라이트", "general": "일반", "organization": "구성" },
      "buttons": { "refresh": "새로고침", "viewAll": "모두 보기" }
    }
  },
  pt: { translation: { "app": { "title": "DesktopSort", "search": "Pesquisar..." }, "nav": { "dashboard": "Painel", "files": "Arquivos", "settings": "Configurações" }, "dashboard": { "subtitle": "Gerencie seus arquivos", "organizeFiles": "Organizar", "restoreDesktop": "Restaurar", "sorted": "Sorted", "categories": "Categorias" }, "settings": { "title": "Configurações", "language": "Idioma", "dark": "Escuro", "light": "Claro", "general": "Geral", "organization": "Organização" }, "buttons": { "refresh": "Atualizar", "viewAll": "Ver tudo" } } },
  bn: { translation: { "app": { "title": "DesktopSort", "search": "শর্চ..." }, "nav": { "dashboard": "ড্যাশবোর্ড", "files": "ফাইল", "settings": "সেটিংস" }, "dashboard": { "subtitle": "ফাইল গুছিয়ে নিন", "organizeFiles": "গুছিয়ে নিন", "restoreDesktop": "পুনরুদ্ধার", "sorted": "Sorted", "categories": "বিভাগসমূহ" }, "settings": { "title": "সেটিংস", "language": "ভাষা", "dark": "ডার্ক", "light": "লাইট", "general": "সাধারণ", "organization": "সংগঠন" }, "buttons": { "refresh": "রিফ্রেশ", "viewAll": "সব দেখুন" } } },
  ur: { translation: { "app": { "title": "DesktopSort", "search": "تلاش..." }, "nav": { "dashboard": "ڈیش بورڈ", "files": "فائلیں", "settings": "سیٹنگز" }, "dashboard": { "subtitle": "فائلیں ترتیب دیں", "organizeFiles": "ترتیب دیں", "restoreDesktop": "بحال کریں", "sorted": "Sorted", "categories": "اقسام" }, "settings": { "title": "سیٹنگز", "language": "زبان", "dark": "ڈارک", "light": "لائٹ", "general": "عام", "organization": "تنظيم" }, "buttons": { "refresh": "ریفریش", "viewAll": "سب دیکھیں" } } },
  id: { translation: { "app": { "title": "DesktopSort", "search": "Cari..." }, "nav": { "dashboard": "Dasbor", "files": "Berkas", "settings": "Pengaturan" }, "dashboard": { "subtitle": "Kelola berkas Anda", "organizeFiles": "Organisir", "restoreDesktop": "Pulihkan", "sorted": "Sorted", "categories": "Kategori" }, "settings": { "title": "Pengaturan", "language": "Bahasa", "dark": "Gelap", "light": "Terang", "general": "Umum", "organization": "Organisasi" }, "buttons": { "refresh": "Segarkan", "viewAll": "Lihat semua" } } },
  de: { translation: { "app": { "title": "DesktopSort", "search": "Suchen..." }, "nav": { "dashboard": "Dashboard", "files": "Dateien", "settings": "Einstellungen" }, "dashboard": { "subtitle": "Dateien verwalten", "organizeFiles": "Organisieren", "restoreDesktop": "Wiederherstellen", "sorted": "Sorted", "categories": "Kategorien" }, "settings": { "title": "Einstellungen", "language": "Sprache", "dark": "Dunkel", "light": "Hell", "general": "Allgemein", "organization": "Organisation" }, "buttons": { "refresh": "Aktualisieren", "viewAll": "Alle anzeigen" } } },
  it: { translation: { "app": { "title": "DesktopSort", "search": "Cerca..." }, "nav": { "dashboard": "Dashboard", "files": "File", "settings": "Impostazioni" }, "dashboard": { "subtitle": "Gestisci i tuoi file", "organizeFiles": "Organizza", "restoreDesktop": "Ripristina", "sorted": "Sorted", "categories": "Categorie" }, "settings": { "title": "Impostazioni", "language": "Lingua", "dark": "Scuro", "light": "Chiaro", "general": "Generale", "organization": "Organizzazione" }, "buttons": { "refresh": "Aggiorna", "viewAll": "Vedi tutto" } } },
  tr: { translation: { "app": { "title": "DesktopSort", "search": "Ara..." }, "nav": { "dashboard": "Panel", "files": "Dosyalar", "settings": "Ayarlar" }, "dashboard": { "subtitle": "Dosyaları yönet", "organizeFiles": "Düzenle", "restoreDesktop": "Geri Yükle", "sorted": "Sorted", "categories": "Kategoriler" }, "settings": { "title": "Ayarlar", "language": "Dil", "dark": "Koyu", "light": "Açık", "general": "Genel", "organization": "Organizasyon" }, "buttons": { "refresh": "Yenile", "viewAll": "Hepsini gör" } } },
  vi: { translation: { "app": { "title": "DesktopSort", "search": "Tìm kiếm..." }, "nav": { "dashboard": "Bảng điều khiển", "files": "Tệp tin", "settings": "Cài đặt" }, "dashboard": { "subtitle": "Quản lý tệp của bạn", "organizeFiles": "Sắp xếp", "restoreDesktop": "Khôi phục", "sorted": "Sorted", "categories": "Danh mục" }, "settings": { "title": "Cài đặt", "language": "Ngôn ngữ", "dark": "Tối", "light": "Sáng", "general": "Chung", "organization": "Sắp xếp" }, "buttons": { "refresh": "Làm mới", "viewAll": "Xem tất cả" } } },
  mr: { translation: { "app": { "title": "DesktopSort", "search": "शोध..." }, "nav": { "dashboard": "डॅशबोर्ड", "files": "फाईली", "settings": "सेटिंग्ज" }, "dashboard": { "subtitle": "फाईली व्यवस्थापित करा", "organizeFiles": "आयोजित करा", "restoreDesktop": "पुनर्संचयित करा", "sorted": "Sorted", "categories": "श्रेणी" }, "settings": { "title": "सेटिंग्ज", "language": "भाषा", "dark": "डार्क", "light": "लाइट", "general": "सामान्य", "organization": "आयोजन" }, "buttons": { "refresh": "ताज़ा करा", "viewAll": "सर्व पहा" } } },
  te: { translation: { "app": { "title": "DesktopSort", "search": "శోధన..." }, "nav": { "dashboard": "డ్యాష్‌బోర్డ్", "files": "ఫైళ్ళు", "settings": "సెట్టింగులు" }, "dashboard": { "subtitle": "ఫైళ్ళను నిర్వహించండి", "organizeFiles": "అమర్చు", "restoreDesktop": "పునరుద్ధరించు", "sorted": "Sorted", "categories": "వర్గాలు" }, "settings": { "title": "సెట్టింగులు", "language": "భాష", "dark": "డార్క్", "light": "లైట్", "general": "సాధారణ", "organization": "నిర్వహణ" }, "buttons": { "refresh": "రిఫ్రెష్", "viewAll": "అన్నీ చూడండి" } } },
  ta: { translation: { "app": { "title": "DesktopSort", "search": "தேடல்..." }, "nav": { "dashboard": "டாஷ்போர்டு", "files": "கோப்புகள்", "settings": "அமைப்புகள்" }, "dashboard": { "subtitle": "கோப்புகளை நிர்வகிக்கவும்", "organizeFiles": "ஒழுங்கமைப்பாளர்", "restoreDesktop": "மீட்டெடுக்கவும்", "sorted": "Sorted", "categories": "வகைகள்" }, "settings": { "title": "அமைப்புகள்", "language": "மொழி", "dark": "டார்க்", "light": "லைட்", "general": "பொது", "organization": "அமைப்பு" }, "buttons": { "refresh": "புதுப்பி", "viewAll": "அனைத்தையும் பார்" } } }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
