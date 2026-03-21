# Dashboard Startpage

A professional, highly customizable browser startpage designed for stability, privacy, and local persistence.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.1.0-green.svg)

## ✨ Features

- **Modern UI:** Stunning visuals with backdrop-blur, smooth transitions, and consistent spacing.
- **🛠️ Drag & Drop Dashboard:** Reorder everything! Categories, sections, and links can be moved freely.
- **🕒 Smart Widgets:** 
  - Live clock with localized day and date.
  - Weather widget with smart caching (powered by Open-Meteo).
- **🌍 Full Localization:** Interface and settings support Deutsch, English, Español, and Italiano.
- **💾 Smart Persistence:** 
  - Dual-layer save system. Changes are temporarily cached in the browser and can be permanently written to the physical `links.js` file with a single click.
  - Automatic detection of external file edits to prevent data loss.
- **👋 Flexible Greetings:** Customize time-based greetings, use a static message, or disable greetings entirely. Greetings stay seamlessly synchronized across all supported languages.
- **🎨 Theme Editor:** Create custom visual themes directly in the browser or use built-in presets (Light, Dark, Forest).
- **🖥️ Desktop Manager Tool:** Includes a standalone Python GUI (`StartpageManager`) to mass-manage your links, perform automated health checks on your custom icons, and quickly download missing favicons.

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome or Edge recommended to support the local File System Access API for seamless saving).
- No web server required! The project runs entirely locally.
- (Optional) **Python 3** if you wish to build or run the Desktop Manager from source.

### Installation & Usage
1. Clone the repository:
   ```bash
   git clone https://github.com/valleloper/startpage.git
   ```
2. Open `index.html` in your browser to start using the dashboard immediately.
3. Click the **Settings (⚙)** or **Edit (✎)** icons in the top right to customize your experience.

---

## 🖥️ The Startpage Manager (Desktop Tool)

We provide a specialized desktop application to help you manage your dashboard's data, which is especially useful for managing custom icons that the browser cannot easily access due to security restrictions.

### Running the Manager
If you have Python installed, you can launch the manager directly:
```bash
python scripts/manager.py
```

### Building a Standalone Executable (.exe)
You can compile the manager into a portable `.exe` file so it can be run on Windows machines without needing Python installed.
1. Run the build script:
   ```bash
   python build.py
   ```
2. Once complete, you will find `StartpageManager.exe` inside the generated `dist/` folder. You can move this file anywhere on your computer.

### Key Capabilities of the Manager
- **Visual Link Editor:** Quickly review and edit all your categories, sections, and URLs in one place.
- **Icon Management:** Apply custom local images to your links. The tool automatically organizes them into your workspace.
- **Mass Downloader:** Click "Download Icons" to automatically fetch missing favicons from the web for all your links.
- **Health Check & Cleanup:** Identify broken links and automatically delete leftover images that are no longer being used by your dashboard.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Vanilla CSS Variables), JavaScript (ES6+)
- **Libraries:** jQuery (DOM), Bootstrap 4 (Grid), SortableJS (Drag & Drop)
- **Tooling:** Python 3, Tkinter (GUI), PyInstaller (Executable Compilation)

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repository and submit pull requests.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.