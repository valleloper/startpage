# Dashboard Startpage

A professional, highly customizable browser startpage. Built with stability, privacy, and local persistence in mind.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ✨ Features

- **Modern UI:** Stunning visuals with backdrop-blur, smooth transitions, and consistent spacing.
- **🛠️ Drag & Drop Dashboard:** Reorder everything! Categories, sections, and links can be moved freely via SortableJS.
- **🕒 Smart Widgets:** 
  - Live clock with localized day and date.
  - Weather widget with 30-min smart caching (powered by Open-Meteo).
  - Individual widget alignment (Left/Right).
- **🔍 Intelligent Search:** Real-time filtering that hides empty panels and categories instantly.
- **🌍 Full Localization:** Supports Deutsch, English, Español, and Italiano.
- **💾 Local Persistence:** 
  - Uses `localStorage` for immediate state.
  - Features a **"Persistence Mode"** via the File System Access API to write changes directly back to your physical `js/links.js` file.
- **🎨 Theme Editor:** Create your own themes or use built-in presets (Light, Dark, Forest).
- **📱 Responsive Design:** Global UI scaling (70% - 130%) ensuring it looks great on any screen.

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome or Edge recommended for File System Access support).
- No web server required! Just open `index.html`.
- Python on a non Windows system

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/valleloper/startpage.git
   ```
2. Open `index.html` in your browser.

### 🖼️ Favicon Management
The dashboard tries to load icons locally from the `img/` folder using the domain name (e.g., `github.com.ico`). To download all icons for your links at once, use one of the utility scripts in the `scripts/` folder:

#### Option A: Windows (Native)
1. Open the `scripts/` folder in File Explorer.
2. **Right-click** on `update_icons.ps1`.
3. Select **"Run with PowerShell"**.
4. The script will scan your links and download missing icons into the `img/` folder.

#### Option B: Python (Cross-platform)
1. Ensure you have **Python** installed.
2. Run the script from the root directory:
   ```bash
   python scripts/update_icons.py
   ```
3. If an icon is missing or fails to load, the dashboard will fall back to Google's S2 service or a local `default.ico`.

### 🎨 Customization
- **Logo:** Replace `img/app-icon.png` with your own image to change the site icon.
- **Data:** Edit `js/links.js` directly or use the built-in **Persistence** settings to save changes from the browser.


## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Libraries:** jQuery (DOM), Bootstrap (Grid), SortableJS (Drag & Drop)
- **APIs:** Open-Meteo (Weather & Geocoding)

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo and submit pull requests.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
