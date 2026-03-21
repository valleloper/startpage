"""
manager.py

A standalone Python GUI tool built with Tkinter to manage the Startpage dashboard.
It allows users to visually edit links, mass-download missing favicons, and perform 
health checks on the local image directory, bypassing browser security limitations.
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import json
import os
import sys
import shutil
import urllib.request
from datetime import datetime
from urllib.parse import urlparse

# --- Constants & Paths ---
if getattr(sys, 'frozen', False):
    # Running as compiled executable
    DEFAULT_BASE_DIR = os.path.dirname(sys.executable)
else:
    # Running as script
    DEFAULT_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BASE_DIR = DEFAULT_BASE_DIR
LINKS_FILE = os.path.join(BASE_DIR, 'js', 'links.js')
IMG_DIR = os.path.join(BASE_DIR, 'img')
CUSTOM_IMG_DIR = os.path.join(IMG_DIR, 'custom')
CONFIG_FILE = os.path.join(DEFAULT_BASE_DIR, 'manager_config.json')

# Prompt user to locate links.js if missing
if not os.path.exists(LINKS_FILE):
    root = tk.Tk()
    root.withdraw()
    messagebox.showinfo("Startpage Manager", "Could not find links.js automatically.\nPlease locate your links.js file.")
    file_path = filedialog.askopenfilename(
        title="Select links.js",
        filetypes=[("JavaScript Files", "*.js")],
        initialdir=DEFAULT_BASE_DIR
    )
    if not file_path or not file_path.endswith('links.js'):
        messagebox.showerror("Error", "You must select the links.js file to continue.")
        sys.exit(1)
    
    LINKS_FILE = file_path
    BASE_DIR = os.path.dirname(os.path.dirname(file_path))
    IMG_DIR = os.path.join(BASE_DIR, 'img')
    CUSTOM_IMG_DIR = os.path.join(IMG_DIR, 'custom')
    root.destroy()

# Ensure custom img dir exists
if not os.path.exists(CUSTOM_IMG_DIR):
    try:
        os.makedirs(CUSTOM_IMG_DIR)
    except:
        pass

# --- I18n ---
LANGUAGES = {
    'en': {
        'title': 'Startpage Manager',
        'health': 'Health Check',
        'cleanup': 'Clean Up',
        'download': 'Download Icons',
        'save': 'Save Changes',
        'link_editor': 'Link Editor',
        'name': 'Name',
        'url': 'URL',
        'icon': 'Icon',
        'category': 'Category',
        'section': 'Section',
        'browse': 'Browse...',
        'select_icon': 'Select Icon Image',
        'save_success': 'Changes saved successfully!',
        'clean_success': 'Removed {} unused icons.',
        'health_missing': 'Missing Icons:',
        'all_good': 'All links have icons.',
        'download_done': 'Downloaded {} new icons.',
        'downloading': 'Downloading...',
        'update_link': 'Apply Icon'
    },
    'de': {
        'title': 'Startpage Manager',
        'health': 'Systemprüfung',
        'cleanup': 'Aufräumen',
        'download': 'Icons laden',
        'save': 'Änderungen speichern',
        'link_editor': 'Link Editor',
        'name': 'Name',
        'url': 'URL',
        'icon': 'Icon',
        'category': 'Kategorie',
        'section': 'Sektion',
        'browse': 'Durchsuchen...',
        'select_icon': 'Icon auswählen',
        'save_success': 'Änderungen erfolgreich gespeichert!',
        'clean_success': '{} ungenutzte Icons entfernt.',
        'health_missing': 'Fehlende Icons:',
        'all_good': 'Alle Links haben Icons.',
        'download_done': '{} neue Icons heruntergeladen.',
        'downloading': 'Lade Icons...',
        'update_link': 'Icon anwenden'
    },
    'es': {
        'title': 'Gestor de Startpage',
        'health': 'Verificar Salud',
        'cleanup': 'Limpiar',
        'download': 'Bajar Iconos',
        'save': 'Guardar Cambios',
        'link_editor': 'Editor de Enlaces',
        'name': 'Nombre',
        'url': 'URL',
        'icon': 'Icono',
        'category': 'Categoría',
        'section': 'Sección',
        'browse': 'Buscar...',
        'select_icon': 'Seleccionar Icono',
        'save_success': '¡Cambios guardados con éxito!',
        'clean_success': 'Eliminados {} iconos no utilizados.',
        'health_missing': 'Iconos faltantes:',
        'all_good': 'Todos los enlaces tienen iconos.',
        'download_done': '{} nuevos iconos descargados.',
        'downloading': 'Descargando...',
        'update_link': 'Aplicar Icono'
    },
    'it': {
        'title': 'Gestore Startpage',
        'health': 'Controllo Salute',
        'cleanup': 'Pulisci',
        'download': 'Scarica Icone',
        'save': 'Salva Modifiche',
        'link_editor': 'Editor Link',
        'name': 'Nome',
        'url': 'URL',
        'icon': 'Icona',
        'category': 'Categoria',
        'section': 'Sezione',
        'browse': 'Sfoglia...',
        'select_icon': 'Seleziona Icona',
        'save_success': 'Modifiche salvate con successo!',
        'clean_success': 'Rimossi {} icone inutilizzate.',
        'health_missing': 'Icone mancanti:',
        'all_good': 'Tutti i link hanno icone.',
        'download_done': '{} nuove icone scaricate.',
        'downloading': 'Scaricamento...',
        'update_link': 'Applica Icona'
    }
}

class StartpageManager(tk.Tk):
    """
    Main application window for the Startpage Manager.
    Handles data loading, independent configuration states, UI generation, 
    and operations like downloading or cleaning up favicons.
    """
    def __init__(self):
        super().__init__()
        
        # Set Window Icon
        # If frozen (PyInstaller), it extracts to sys._MEIPASS
        if getattr(sys, 'frozen', False):
            bundled_icon = os.path.join(sys._MEIPASS, "img", "app-icon.ico")
        else:
            bundled_icon = os.path.join(DEFAULT_BASE_DIR, "img", "app-icon.ico")
            
        if os.path.exists(bundled_icon):
            try:
                self.iconbitmap(bundled_icon)
            except Exception:
                pass

        self.data = self.load_data()
        
        # Load independent manager config
        self.lang = 'en'
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                    conf = json.load(f)
                    self.lang = conf.get('language', 'en')
            except:
                pass
        else:
            self.lang = self.data.get('settings', {}).get('language', 'en')
            
        if self.lang not in LANGUAGES:
            self.lang = 'en'
        self.t = LANGUAGES[self.lang]
        
        self.title(self.t['title'])
        self.geometry("850x650")
        self.configure(bg="#f5f5f7") # Apple Light BG
        self.setup_styles()
        self.create_widgets()
        self.populate_links()

    def setup_styles(self):
        style = ttk.Style(self)
        style.theme_use('clam')
        
        # Apple-like aesthetics
        bg_color = "#f5f5f7"
        card_bg = "#ffffff"
        text_color = "#1d1d1f"
        accent_color = "#0071e3"
        
        self.configure(bg=bg_color)
        
        style.configure('TFrame', background=bg_color)
        style.configure('Card.TFrame', background=card_bg, relief="flat", borderwidth=1)
        
        style.configure('TLabel', background=bg_color, foreground=text_color, font=('Segoe UI', 10))
        style.configure('Header.TLabel', font=('Segoe UI', 16, 'bold'), padding=(0, 10))
        
        style.configure('TButton', font=('Segoe UI', 10), padding=6)
        style.map('TButton', background=[('active', '#e0e0e0')])
        
        style.configure('Accent.TButton', background=accent_color, foreground='white', font=('Segoe UI', 10, 'bold'))
        style.map('Accent.TButton', background=[('active', '#005bb5')])
        
        style.configure('Treeview', font=('Segoe UI', 10), rowheight=30)
        style.configure('Treeview.Heading', font=('Segoe UI', 10, 'bold'))

    def load_data(self):
        if not os.path.exists(LINKS_FILE):
            messagebox.showerror("Error", f"Could not find {LINKS_FILE}")
            self.destroy()
            sys.exit(1)
            
        with open(LINKS_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
            
        try:
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            return json.loads(content[start_idx:end_idx])
        except Exception as e:
            messagebox.showerror("Parse Error", str(e))
            self.destroy()
            sys.exit(1)

    def save_data(self):
        # Update timestamp
        self.data['lastUpdated'] = datetime.utcnow().isoformat() + "Z"
        
        try:
            json_str = json.dumps(self.data, indent=2)
            with open(LINKS_FILE, 'w', encoding='utf-8') as f:
                f.write(f"const LINKS_DATA = {json_str};\n")
            messagebox.showinfo("Success", self.t['save_success'])
        except Exception as e:
            messagebox.showerror("Error", f"Could not save: {e}")

    def create_widgets(self):
        # Top Bar
        top_frame = ttk.Frame(self)
        top_frame.pack(fill=tk.X, padx=20, pady=20)
        
        ttk.Label(top_frame, text=self.t['title'], style='Header.TLabel').pack(side=tk.LEFT)
        
        # Language Selector
        lang_frame = ttk.Frame(top_frame)
        lang_frame.pack(side=tk.LEFT, padx=30)
        for code in ['DE', 'EN', 'ES', 'IT']:
            btn = tk.Button(lang_frame, text=code, command=lambda c=code.lower(): self.change_language(c), 
                          relief="flat", bg="#f5f5f7", font=('Segoe UI', 8, 'bold'), cursor="hand2")
            btn.pack(side=tk.LEFT, padx=3)
            if code.lower() == self.lang:
                btn.configure(fg="#0071e3")

        ttk.Button(top_frame, text=self.t['health'], command=self.check_health).pack(side=tk.RIGHT, padx=5)
        ttk.Button(top_frame, text=self.t['cleanup'], command=self.cleanup_icons).pack(side=tk.RIGHT, padx=5)
        ttk.Button(top_frame, text=self.t['download'], command=self.download_icons).pack(side=tk.RIGHT, padx=5)
        ttk.Button(top_frame, text=self.t['save'], style='Accent.TButton', command=self.save_data).pack(side=tk.RIGHT, padx=5)

        # Main Content
        main_frame = ttk.Frame(self, style='Card.TFrame')
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=(0, 20))
        
        # Treeview for Links
        cols = ('name', 'url', 'icon', 'location')
        self.tree = ttk.Treeview(main_frame, columns=cols, show='headings')
        
        self.tree.heading('name', text=self.t['name'])
        self.tree.heading('url', text=self.t['url'])
        self.tree.heading('icon', text=self.t['icon'])
        self.tree.heading('location', text='Location')
        
        self.tree.column('name', width=150)
        self.tree.column('url', width=250)
        self.tree.column('icon', width=150)
        self.tree.column('location', width=150)
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(main_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y, pady=10)
        
        # Edit Panel (Bottom)
        edit_frame = ttk.Frame(self)
        edit_frame.pack(fill=tk.X, padx=20, pady=(0, 20))
        
        ttk.Label(edit_frame, text=self.t['icon'] + ":").pack(side=tk.LEFT)
        self.icon_entry = ttk.Entry(edit_frame, width=45)
        self.icon_entry.pack(side=tk.LEFT, padx=10)
        
        ttk.Button(edit_frame, text=self.t['browse'], command=self.browse_icon).pack(side=tk.LEFT)
        ttk.Button(edit_frame, text=self.t['update_link'], command=self.update_selected_link).pack(side=tk.LEFT, padx=10)

        self.tree.bind('<<TreeviewSelect>>', self.on_select)
        self.item_mapping = {}

    def change_language(self, code):
        self.lang = code
        self.t = LANGUAGES[self.lang]
        
        # Save independent config
        try:
            with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump({'language': code}, f)
        except:
            pass
            
        # Rebuild UI in-place instead of restarting
        for widget in self.winfo_children():
            widget.destroy()
            
        self.title(self.t['title'])
        self.create_widgets()
        self.populate_links()

    def populate_links(self):
        for item in self.tree.get_children():
            self.tree.delete(item)
        self.item_mapping.clear()
        
        # Favorites
        for i, link in enumerate(self.data.get('shortLinks', [])):
            domain = urlparse(link['url'] if '://' in link['url'] else 'https://' + link['url']).hostname
            default_icon = f"img/{domain.replace('www.', '')}.ico" if domain else ""
            icon_val = link.get('icon', default_icon)
            iid = self.tree.insert('', tk.END, values=(link['name'], link['url'], icon_val, 'Favorite'))
            self.item_mapping[iid] = ('shortLinks', i)
            
        # Categories
        for ci, cat in enumerate(self.data.get('categories', [])):
            for coli, col in enumerate(cat.get('columns', [])):
                for si, sec in enumerate(col.get('sections', [])):
                    for li, link in enumerate(sec.get('links', [])):
                        domain = urlparse(link['url'] if '://' in link['url'] else 'https://' + link['url']).hostname
                        default_icon = f"img/{domain.replace('www.', '')}.ico" if domain else ""
                        icon_val = link.get('icon', default_icon)
                        loc_str = f"{cat.get('title', 'Cat')} > {sec.get('title', 'Sec')}"
                        iid = self.tree.insert('', tk.END, values=(link['name'], link['url'], icon_val, loc_str))
                        self.item_mapping[iid] = ('categories', ci, coli, si, li)

    def on_select(self, event):
        selected = self.tree.selection()
        if not selected: return
        item = self.tree.item(selected[0])
        self.icon_entry.delete(0, tk.END)
        self.icon_entry.insert(0, item['values'][2])

    def update_selected_link(self):
        selected = self.tree.selection()
        if not selected: return
        
        iid = selected[0]
        new_icon = self.icon_entry.get().strip()
        path = self.item_mapping[iid]
        
        if path[0] == 'shortLinks':
            self.data['shortLinks'][path[1]]['icon'] = new_icon
        elif path[0] == 'categories':
            self.data['categories'][path[1]]['columns'][path[2]]['sections'][path[3]]['links'][path[4]]['icon'] = new_icon
            
        current_vals = list(self.tree.item(iid, 'values'))
        current_vals[2] = new_icon
        self.tree.item(iid, values=current_vals)

    def browse_icon(self):
        selected = self.tree.selection()
        if not selected: 
            messagebox.showwarning("Warning", "Select a link first.")
            return
            
        file_path = filedialog.askopenfilename(
            title=self.t['select_icon'],
            initialdir=BASE_DIR,
            filetypes=[("Image files", "*.ico *.png *.svg *.webp *.jpg")]
        )
        
        if file_path:
            # Check if file is inside our project structure
            norm_file = os.path.normpath(file_path).lower()
            norm_base = os.path.normpath(BASE_DIR).lower()
            
            if not norm_file.startswith(norm_base):
                # Outside project -> copy to img/custom
                filename = os.path.basename(file_path)
                dest_path = os.path.join(CUSTOM_IMG_DIR, filename)
                try:
                    shutil.copy2(file_path, dest_path)
                    rel_path = f"img/custom/{filename}"
                except Exception as e:
                    messagebox.showerror("Error", f"Failed to copy: {e}")
                    return
            else:
                # Inside project -> just get relative path
                rel_path = os.path.relpath(file_path, BASE_DIR).replace('\\', '/')
                
            self.icon_entry.delete(0, tk.END)
            self.icon_entry.insert(0, rel_path)
            self.update_selected_link()

    def get_all_icons_in_use(self):
        in_use = set()
        in_use.add('app-icon.ico')
        in_use.add('default.ico')
        
        for link in self.data.get('shortLinks', []):
            if 'icon' in link: in_use.add(link['icon'].replace('img/', '', 1))
            else:
                domain = urlparse(link['url'] if '://' in link['url'] else 'https://' + link['url']).hostname
                if domain: in_use.add(f"{domain.replace('www.', '')}.ico")
                
        for cat in self.data.get('categories', []):
            for col in cat.get('columns', []):
                for sec in col.get('sections', []):
                    for link in sec.get('links', []):
                        if 'icon' in link: in_use.add(link['icon'].replace('img/', '', 1))
                        else:
                            domain = urlparse(link['url'] if '://' in link['url'] else 'https://' + link['url']).hostname
                            if domain: in_use.add(f"{domain.replace('www.', '')}.ico")
        return in_use

    def cleanup_icons(self):
        in_use = self.get_all_icons_in_use()
        removed = 0
        for f in os.listdir(IMG_DIR):
            if f.endswith('.ico') or f.endswith('.png'):
                if f not in in_use and os.path.isfile(os.path.join(IMG_DIR, f)):
                    os.remove(os.path.join(IMG_DIR, f))
                    removed += 1
        if os.path.exists(CUSTOM_IMG_DIR):
            for f in os.listdir(CUSTOM_IMG_DIR):
                rel_path = f"custom/{f}"
                if rel_path not in in_use and os.path.isfile(os.path.join(CUSTOM_IMG_DIR, f)):
                    os.remove(os.path.join(CUSTOM_IMG_DIR, f))
                    removed += 1
        messagebox.showinfo("Clean Up", self.t['clean_success'].format(removed))

    def check_health(self):
        in_use = self.get_all_icons_in_use()
        missing = []
        for icon_path in in_use:
            full_path = os.path.join(BASE_DIR, icon_path) if icon_path.startswith('img/') else os.path.join(IMG_DIR, icon_path)
            if not os.path.exists(full_path) and icon_path not in ['app-icon.ico', 'default.ico']:
                missing.append(icon_path)
        if missing:
            msg = self.t['health_missing'] + "\n\n" + "\n".join(missing[:10])
            if len(missing) > 10: msg += f"\n...and {len(missing)-10} more."
            messagebox.showwarning(self.t['health'], msg)
        else:
            messagebox.showinfo(self.t['health'], self.t['all_good'])

    def download_icons(self):
        urls = []
        for link in self.data.get('shortLinks', []):
            if link.get('url'): urls.append(link['url'])
        for cat in self.data.get('categories', []):
            for col in cat.get('columns', []):
                for sec in col.get('sections', []):
                    for link in sec.get('links', []):
                        if link.get('url'): urls.append(link['url'])
        
        unique_urls = list(set(urls))
        downloaded = 0
        progress_win = tk.Toplevel(self)
        progress_win.title(self.t['downloading'])
        progress_win.geometry("300x100")
        progress_win.transient(self)
        progress_win.grab_set()
        label = ttk.Label(progress_win, text=self.t['downloading'])
        label.pack(pady=10)
        progress = ttk.Progressbar(progress_win, length=200, mode='determinate')
        progress.pack(pady=5)
        progress['maximum'] = len(unique_urls)
        
        for i, url in enumerate(unique_urls):
            try:
                domain = urlparse(url).hostname
                if not domain: domain = urlparse('https://' + url).hostname
                if not domain or domain == 'localhost': continue
                clean_domain = domain.replace('www.', '')
                file_path = os.path.join(IMG_DIR, f"{clean_domain}.ico")
                if not os.path.exists(file_path):
                    api_url = f"https://www.google.com/s2/favicons?domain={domain}&sz=64"
                    req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=5) as response:
                        icon_data = response.read()
                        if icon_data:
                            with open(file_path, 'wb') as f:
                                f.write(icon_data)
                            downloaded += 1
            except: pass
            progress['value'] = i + 1
            progress_win.update()
        progress_win.destroy()
        messagebox.showinfo(self.t['download'], self.t['download_done'].format(downloaded))
        self.populate_links()

if __name__ == "__main__":
    app = StartpageManager()
    app.mainloop()
