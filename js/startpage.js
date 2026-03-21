// --- Global State ---
let currentData = null;
let isEditMode = false;
let fileHandle = null;
let activeModalCallback = null;
let sortableInstances = [];
let widgetTimer = null;
let lastWeatherFetch = 0;

// --- Dictionary ---
const uiTexts = {
    'de': {
        settings: "Einstellungen", theme: "Design", lang: "Sprache", newtab: "In neuem Tab öffnen",
        persistence: "Datenspeicherung", update: "Änderungen dauerhaft speichern",
        favs: "Favoriten", done: "Fertig", editBtn: "Bearbeiten", delConfirm: "Wirklich löschen?",
        addCat: "Kategorie hinzufügen", addSec: "Sektion hinzufügen", addLink: "Link hinzufügen",
        save: "Speichern", cancel: "Abbrechen", name: "Name", url: "URL", color: "Farbe", title: "Titel",
        editGreet: "Zeiten bearbeiten", uiScale: "Skalierung", themeEditor: "Themes",
        bg: "Hintergrund", text: "Schrift", accent: "Akzent", card: "Karten", border: "Rahmen",
        editUser: "Benutzername ändern", topBg: "Header BG", time: "Zeit", weather: "Wetter",
        editLoc: "Standort ändern", locLabel: "Stadt eingeben", headerBg: "Header Hintergrund",
        searchPlaceholder: "Suchen...", noColsErr: "Keine Spalten vorhanden!",
        syncDesc: "Schreibt alle Änderungen direkt in die links.js Datei.",
        reloadFile: "Aus Datei laden", iconPath: "Icon Pfad (Optional)",
        toastUpdate: "Konfigurationsdatei aktualisiert.", toastKeep: "Aktuelle behalten",
        greetMode: "Begrüßungstyp", showUser: "Benutzername anzeigen",
        gDynamic: "Zeitbasiert", gStatic: "Statisch", gNone: "Versteckt"
    },
    'en': {
        settings: "Settings", theme: "Theme", lang: "Language", newtab: "Open in new tab",
        persistence: "Persistence", update: "Save changes permanently",
        favs: "Favorites", done: "Done", editBtn: "Edit", delConfirm: "Really delete?",
        addCat: "Add Category", addSec: "Add Section", addLink: "Add Link",
        save: "Save", cancel: "Cancel", name: "Name", url: "URL", color: "Color", title: "Title",
        editGreet: "Edit Times", uiScale: "UI Scale", themeEditor: "Themes",
        bg: "Background", text: "Text", accent: "Accent", card: "Card", border: "Border",
        editUser: "Change Username", topBg: "Header BG", time: "Time", weather: "Weather",
        editLoc: "Change Location", locLabel: "Enter City", headerBg: "Header Background",
        searchPlaceholder: "Search...", noColsErr: "No columns available!",
        syncDesc: "Writes all changes directly to the links.js file.",
        reloadFile: "Load from File", iconPath: "Icon Path (Optional)",
        toastUpdate: "Configuration file updated.", toastKeep: "Keep Current",
        greetMode: "Greeting Mode", showUser: "Show Username",
        gDynamic: "Time-based", gStatic: "Static", gNone: "Hidden"
    },
    'es': {
        settings: "Ajustes", theme: "Tema", lang: "Idioma", newtab: "Abrir en nueva pestaña",
        persistence: "Persistencia", update: "Guardar cambios permanentemente",
        favs: "Favoritos", done: "Hecho", editBtn: "Editar", delConfirm: "¿Realmente eliminar?",
        addCat: "Añadir categoría", addSec: "Añadir sección", addLink: "Añadir enlace",
        save: "Guardar", cancel: "Cancelar", name: "Nombre", url: "URL", color: "Color", title: "Título",
        editGreet: "Editar Horas", uiScale: "Escala de interfaz", themeEditor: "Temas",
        bg: "Fondo", text: "Texto", accent: "Acento", card: "Tarjeta", border: "Borde",
        editUser: "Cambiar usuario", topBg: "Fondo cabecera", time: "Hora", weather: "Clima",
        editLoc: "Cambiar ubicación", locLabel: "Ciudad", headerBg: "Fondo de cabecera",
        searchPlaceholder: "Buscar...", noColsErr: "¡No hay columnas!",
        syncDesc: "Escribe todos los cambios directamente en el archivo links.js.",
        reloadFile: "Cargar desde archivo", iconPath: "Ruta del icono (Opcional)",
        toastUpdate: "Archivo de configuración actualizado.", toastKeep: "Mantener actual",
        greetMode: "Tipo de saludo", showUser: "Mostrar usuario",
        gDynamic: "Basado en el tiempo", gStatic: "Estático", gNone: "Oculto"
    },
    'it': {
        settings: "Impostazioni", theme: "Tema", lang: "Lingua", newtab: "Apri in nuova scheda",
        persistence: "Persistenza", update: "Salva modifiche permanentemente",
        favs: "Preferiti", done: "Fatto", editBtn: "Modifica", delConfirm: "Vuoi eliminare?",
        addCat: "Aggiungi categoria", addSec: "Aggiungi sezione", addLink: "Aggiungi link",
        save: "Salva", cancel: "Annulla", name: "Nome", url: "URL", color: "Colore", title: "Titolo",
        editGreet: "Modifica Orari", uiScale: "Scala UI", themeEditor: "Temi",
        bg: "Sfondo", text: "Testo", accent: "Accento", card: "Scheda", border: "Bordo",
        editUser: "Cambia utente", topBg: "Sfondo intestazione", time: "Ora", weather: "Meteo",
        editLoc: "Cambia posizione", locLabel: "Città", headerBg: "Sfondo intestazione",
        searchPlaceholder: "Cerca...", noColsErr: "Nessuna colonna disponibile!",
        syncDesc: "Scrive tutte le modifiche direttamente nel file links.js.",
        reloadFile: "Carica da file", iconPath: "Percorso icona (Opzionale)",
        toastUpdate: "File di configurazione aggiornato.", toastKeep: "Mantieni attuale",
        greetMode: "Tipo di saluto", showUser: "Mostra utente",
        gDynamic: "Basato sul tempo", gStatic: "Statico", gNone: "Nascosto"
    }
};

const builtInThemes = {
    'Light': { bg: '#f5f5f7', text: '#1d1d1f', accent: '#0071e3', card: '#ffffff', border: 'rgba(0,0,0,0.1)', top: 'rgba(255, 255, 255, 0.8)' },
    'Dark': { bg: '#000000', text: '#f5f5f7', accent: '#0071e3', card: '#1d1d1f', border: 'rgba(255,255,255,0.1)', top: 'rgba(29, 29, 31, 0.8)' },
    'Forest': { bg: '#0a0f0a', text: '#e0e7e0', accent: '#4caf50', card: '#1a251a', border: 'rgba(40, 60, 40, 0.3)', top: 'rgba(20, 30, 20, 0.8)' }
};

const defaultGreetings = {
    'de': { 0: "Schlafenszeit!", 8: "Guten Morgen", 12: "Mittagszeit!", 13: "Hallo", 17: "Guten Abend", 23: "Gute Nacht" },
    'en': { 0: "Time to sleep!", 8: "Good morning", 12: "Lunchtime!", 13: "Hello", 17: "Good evening", 23: "Good night" },
    'es': { 0: "¡Hora de dormir!", 8: "Buenos días", 12: "¡Hora de comer!", 13: "Hola", 17: "Buenas noches", 23: "Buenas noches" },
    'it': { 0: "È ora di dormire!", 8: "Buongiorno", 12: "È ora di pranzo!", 13: "Ciao", 17: "Buonasera", 23: "Buonanotte" }
};

// --- Helpers ---
const getDomain = (url) => { 
    if (!url) return '';
    try { 
        const d = new URL(url.includes('://') ? url : 'https://' + url).hostname.replace('www.', ''); 
        return d === 'localhost' ? '' : d;
    } catch (e) { return ''; } 
};
const getContrastYIQ = (hex) => {
    if(!hex) return 'black'; hex = hex.replace("#", "");
    const r = parseInt(hex.substr(0,2),16), g = parseInt(hex.substr(2,2),16), b = parseInt(hex.substr(4,2),16);
    return ((r*299)+(g*587)+(b*114))/1000 >= 128 ? 'black' : 'white';
};
const getHighestIndex = (map, hr) => {
    const keys = Object.keys(map).map(Number).sort((a,b)=>a-b);
    if (!keys.length) return null;
    let res = keys[keys.length - 1]; // Default to highest (wrap around for early morning)
    keys.forEach(h => { if(hr >= h) res = h; });
    return res;
};
const showToast = (msg) => {
    const $t = $(`<div class="toast-msg">${msg}</div>`);
    $('#toast-container').append($t);
    setTimeout(() => $t.fadeOut(300, () => $t.remove()), 3000);
};

// --- Modal System ---
function openModal(title, fields, callback) {
    $('#modal-title').text(title);
    const $body = $('#modal-body').empty();
    fields.forEach(f => {
        const type = f.type || 'text';
        $body.append(`<div class="form-group mb-3"><label class="small text-muted font-weight-bold text-uppercase">${f.label}</label><input type="${type}" class="form-control" id="modal-field-${f.id}" value="${f.value||''}" style="border-radius:10px;"></div>`);
    });
    $('#modal-overlay, #edit-modal').fadeIn(200).removeClass('hidden');
    activeModalCallback = callback;
    
    // Auto-focus first input
    setTimeout(() => $('#modal-body input').first().focus(), 250);

    // Enter/Esc Listeners
    $(document).off('keydown.modal').on('keydown.modal', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            $('#modal-save').click();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        }
    });
}

function closeModal() {
    $('#modal-overlay, #edit-modal').fadeOut(200, function(){ $(this).addClass('hidden'); });
    activeModalCallback = null;
    $(document).off('keydown.modal');
}

// --- Data Core ---
/**
 * Sanitizes the currentData object to ensure structural integrity.
 * Removes empty links, empty columns, and sections without titles.
 * Also migrates legacy widget formats into the current array structure.
 */
function cleanData() {
    if(!currentData) return;
    currentData.shortLinks = (currentData.shortLinks || []).filter(l => l?.url);
    currentData.categories.forEach(c => {
        c.columns = (c.columns || []).filter(col => col !== null);
        c.columns.forEach(col => { col.sections = (col.sections || []).filter(s => s?.title !== undefined); });
    });
    if(!Array.isArray(currentData.widgets)) {
        const old = currentData.widgets || { clock: true, weather: true };
        currentData.widgets = [];
        if(old.clock) currentData.widgets.push({ type: 'clock', align: 'left' });
        if(old.weather) currentData.widgets.push({ type: 'weather', align: 'left' });
    }
}

/**
 * Commits the current in-memory state (currentData) to the browser's localStorage.
 * Updates the lastUpdated timestamp to trigger cross-tab/reload sync checks.
 * Re-renders the UI automatically after saving.
 */
async function saveData() {
    cleanData();
    currentData.lastUpdated = new Date().toISOString();
    localStorage.setItem('startpage_links', JSON.stringify(currentData));
    renderUI();
}

/**
 * Attempts to permanently save changes to the physical 'js/links.js' file 
 * using the modern File System Access API. 
 * Falls back to a standard file download (Blob) if the API is unsupported.
 */
async function syncToFile() {
    try {
        const lang = currentData.settings.language || 'de';
        if(!window.showSaveFilePicker) throw new Error();
        if(!fileHandle) fileHandle = await window.showSaveFilePicker({ suggestedName: 'links.js', types: [{ description: 'JS File', accept: {'text/javascript':['.js']}}] });
        const w = await fileHandle.createWritable();
        
        // Ensure lastUpdated is fresh before syncing to file
        currentData.lastUpdated = new Date().toISOString();
        
        await w.write(`const LINKS_DATA = ${JSON.stringify(currentData, null, 2)};`);
        await w.close();
        
        // Update localStorage as well to stay in sync
        localStorage.setItem('startpage_links', JSON.stringify(currentData));
        
        showToast(uiTexts[lang].update + "!");
    } catch(e) {
        currentData.lastUpdated = new Date().toISOString();
        const blob = new Blob([`const LINKS_DATA = ${JSON.stringify(currentData, null, 2)};`], {type:'text/javascript'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'links.js'; a.click();
    }
}

// --- Style Logic ---
function updateThemeDropdown() {
    const $sel = $('#theme-setting').empty();
    Object.keys(builtInThemes).forEach(k => $sel.append(`<option value="${k}">${k}</option>`));
    if (currentData.settings.customThemes) {
        Object.keys(currentData.settings.customThemes).forEach(k => $sel.append(`<option value="${k}">${k}</option>`));
    }
    const id = currentData.settings.theme;
    $('#theme-setting').val(id);
    $('#edit-theme-btn, #delete-theme-btn').toggle(!builtInThemes[id]);
}

/**
 * Applies a specific theme ID to the document root variables.
 * Also dynamically calculates an appropriate input background based on contrast.
 */
function applyTheme(id) {
    const t = builtInThemes[id] || (currentData.settings.customThemes?.[id]) || builtInThemes['Light'];
    const r = document.documentElement;
    r.style.setProperty('--bg-color', t.bg); r.style.setProperty('--text-color', t.text);
    r.style.setProperty('--accent-color', t.accent); r.style.setProperty('--card-bg', t.card);
    r.style.setProperty('--border-color', t.border); r.style.setProperty('--top-bg', t.top || t.bg);
    const isDark = getContrastYIQ(t.bg) === 'white';
    r.style.setProperty('--input-bg', isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)');
    r.style.setProperty('--input-text', t.text);
    currentData.settings.theme = id;
    updateThemeDropdown();
}

function openThemeModal(themeId = null) {
    const t = uiTexts[currentData.settings.language || 'de'];
    let theme = themeId ? (builtInThemes[themeId] || currentData.settings.customThemes[themeId]) : { bg: '#ffffff', text: '#000000', accent: '#0071e3', card: '#f0f0f0', border: '#cccccc', top: '#ffffff' };
    openModal(themeId ? t.editBtn : '+ Theme', [
        { id: 'name', label: t.name, value: themeId || '' },
        { id: 'bg', label: t.bg, type: 'color', value: theme.bg },
        { id: 'top', label: t.topBg, type: 'color', value: theme.top || theme.bg },
        { id: 'text', label: t.text, type: 'color', value: theme.text },
        { id: 'accent', label: t.accent, type: 'color', value: theme.accent },
        { id: 'card', label: t.card, type: 'color', value: theme.card },
        { id: 'border', label: t.border, type: 'color', value: theme.border }
    ], (res) => {
        if (!res.name) return;
        if (!currentData.settings.customThemes) currentData.settings.customThemes = {};
        currentData.settings.customThemes[res.name] = { bg: res.bg, top: res.top, text: res.text, accent: res.accent, card: res.card, border: res.border };
        applyTheme(res.name); saveData();
    });
}

function translateUI() {
    const lang = currentData.settings.language || 'de';
    const t = uiTexts[lang] || uiTexts['en'];
    $('.ui-settings-title').text(t.settings); $('.ui-label-theme').text(t.theme);
    $('.ui-label-lang').text(t.lang); $('.ui-label-newtab').text(t.newtab);
    $('.ui-label-backup').text(t.persistence); $('#export-btn').text(t.update);
    $('#reload-file-btn').text(t.reloadFile);
    $('.persistence-desc').text(t.syncDesc);
    $('.ui-label-favorites').text(t.favs); $('#modal-save').text(t.save);
    $('#modal-cancel').text(t.cancel); $('#edit-greetings-btn').text(t.editGreet);
    $('#edit-username-btn').text(t.editUser); $('#edit-location-btn').text(t.editLoc);
    $('#ui-scale-label').text(t.uiScale); $('#main-edit-btn').text(isEditMode ? t.done : '✎');
    $('#search-input').attr('placeholder', t.searchPlaceholder);
    $('#open-in-new-tab-setting').prop('checked', !!currentData.settings.openInNewTab);
    
    // New Greetings Settings
    $('.ui-label-greeting-mode').text(t.greetMode);
    $('.ui-label-show-username').text(t.showUser);
    $('#greeting-mode-setting option[value="dynamic"]').text(t.gDynamic);
    $('#greeting-mode-setting option[value="static"]').text(t.gStatic);
    $('#greeting-mode-setting option[value="none"]').text(t.gNone);
    
    $('#greeting-mode-setting').val(currentData.settings.greetingType || 'dynamic');
    $('#show-username-setting').prop('checked', currentData.settings.showUserName !== false);
    $('#static-greeting-input').val(currentData.settings.staticGreeting || '');
    $('#static-greeting-input').toggleClass('hidden', (currentData.settings.greetingType || 'dynamic') !== 'static');
    $('#edit-greetings-btn').toggleClass('hidden', (currentData.settings.greetingType || 'dynamic') !== 'dynamic');
    
    $('.lang-flag-btn').removeClass('btn-primary').addClass('btn-light');
    $(`.lang-flag-btn[data-lang="${lang}"]`).removeClass('btn-light').addClass('btn-primary');
}

/**
 * Calculates and updates the greeting text and username display based on user settings.
 * Supports dynamic (time-based), static, and hidden greeting modes.
 */
function setWelcome() {
    const s = currentData.settings;
    const type = s.greetingType || 'dynamic';
    const showName = s.showUserName !== false;
    
    let greeting = "";
    if (type === 'dynamic') {
        const lang = s.language || 'de';
        const map = s.greetings?.[lang] || defaultGreetings[lang] || defaultGreetings['en'];
        const hr = new Date().getHours();
        const index = getHighestIndex(map, hr);
        greeting = index !== null && map[index] ? map[index] : "Hello";
    } else if (type === 'static') {
        greeting = s.staticGreeting || "Welcome";
    }
    
    $('#greeting_text').text(greeting);
    $('#user_name_text').text(showName && s.userName && greeting ? " " + s.userName : (!greeting && showName && s.userName ? s.userName : ""));
}

function setActivePanel(id) {
    if(!id) return;
    localStorage.setItem('last-active-panel', id);
    const $p = $(id); if(!$p.length) return;
    $('.link-panel').addClass('hidden').hide();
    $p.removeClass('hidden').hide().fadeIn(300);
}

function showActivePanel() {
    const last = localStorage.getItem('last-active-panel');
    if(last && $(last).length) setActivePanel(last);
    else if(currentData.categories.length) setActivePanel(`#${currentData.categories[0].id}`);
}

/**
 * Main rendering loop. Constructs the entire DOM layout for shortcuts,
 * categories, sections, and links based on currentData. Also attaches
 * edit controls if edit mode is active.
 */
function renderUI() {
    const $short = $('#short-links'), $btns = $('#category-buttons'), $panels = $('#panels-container');
    $short.empty(); $btns.empty(); $panels.empty();
    $('body').toggleClass('edit-mode-active', isEditMode);
    const lang = currentData.settings.language || 'de';
    const t = uiTexts[lang] || uiTexts['en'];
    const target = currentData.settings.openInNewTab ? 'target="_blank"' : '';

    // Show/Hide Favorites Header & Add Button
    $('#short-links-header').toggle(isEditMode || currentData.shortLinks.length > 0);
    $('#add-short-link-btn').toggle(isEditMode);

    currentData.shortLinks.forEach((l, i) => {
        let del = isEditMode ? `<div style="position:absolute;top:-10px;right:0;background:rgba(0,0,0,0.6);padding:2px;border-radius:4px;z-index:10;"><button class="btn btn-sm btn-link p-0 text-warning" onclick="editShortLink(${i})">✎</button><button class="btn btn-sm btn-link p-0 text-danger" onclick="deleteShortLink(${i})">✕</button></div>` : '';
        let iconSrc = l.icon ? l.icon : `img/${getDomain(l.url)}.ico`;
        $short.append(`<div class="col-lg-2 col-md-3 col-sm-4 col-6 mb-3 relative">${del}<div class="d-flex align-items-center drag-handle"><img class="ico mr-2" src="${iconSrc}" onerror="handleIconError(this, '${l.url}')"><a href="${l.url}" ${target}>${l.name}</a></div></div>`);
    });

    currentData.categories.forEach((c, ci) => {
        const bg = c.headerColor || '#6c757d', txt = getContrastYIQ(bg);
        let ctrl = isEditMode ? `<div class="text-center mt-1"><button onclick="editCategory(${ci})">✎</button><button onclick="deleteCategory(${ci})">✕</button></div>` : '';
        $btns.append(`<div class="col-sm-3 col-md-3 col-lg-2 mb-3 category-item drag-handle" data-target="#${c.id}"><button class="btn w-100 shadow-sm" style="background-color:${bg};color:${txt};height:50px;pointer-events:none;" type="button">${c.category}</button>${ctrl}</div>`);
        let html = `<div class="row margin-bottom link-panel hidden" id="${c.id}"><div class="col-12"><div class="card shadow-lg"><div class="card-header d-flex justify-content-between align-items-center" style="color:${txt};background-color:${bg}"><h5 class="mb-0">${c.title}</h5>${isEditMode ? `<div><button class="btn btn-sm btn-light py-0 px-2 mr-1" onclick="addColumn(${ci})">+ Col</button><button class="btn btn-sm btn-light py-0 px-2" onclick="addSection(${ci})">+ Section</button></div>` : ''}</div><div class="card-body"><div class="row">`;
        const cw = Math.max(1, Math.floor(12 / (c.columns.length || 1)));
        c.columns.forEach((col, coli) => {
            html += `<div class="col-md-${cw} mb-4">`;
            if(isEditMode) html += `<button class="btn btn-sm btn-link text-danger p-0 float-right" onclick="deleteColumn(${ci}, ${coli})">✕ Col</button>`;
            html += `<div class="sections-wrapper" data-cat-idx="${ci}" data-col-idx="${coli}" style="min-height:50px; border: ${isEditMode?'1px dashed rgba(128,128,128,0.2)':'none'}; border-radius: 10px;">`;
            col.sections.forEach((s, si) => {
                let sCtrl = isEditMode ? `<span class="ml-2"><button class="btn btn-sm btn-link p-0" onclick="addLink(${ci},${coli},${si})">＋</button><button class="btn btn-sm btn-link p-0" onclick="editSection(${ci},${coli},${si})">✎</button><button class="btn btn-sm btn-link p-0 text-danger" onclick="deleteSection(${ci},${coli},${si})">✕</button></span>` : '';
                html += `<div class="section-item mb-3"><h6 class="font-weight-bold text-uppercase small drag-handle">${s.title}${sCtrl}</h6><ul class="list-unstyled links-list" data-cat-idx="${ci}" data-col-idx="${coli}" data-sec-idx="${si}" style="min-height:20px;">`;
                s.links.forEach((l, li) => {
                    let lCtrl = isEditMode ? `<button class="btn btn-sm btn-link p-0 ml-2" onclick="editLink(${ci},${coli},${si},${li})">✎</button><button class="btn btn-sm btn-link p-0 text-danger" onclick="deleteLink(${ci},${coli},${si},${li})">✕</button>` : '';
                    let iconSrc = l.icon ? l.icon : `img/${getDomain(l.url)}.ico`;
                    html += `<li class="mb-2 d-flex align-items-center drag-handle"><img src="${iconSrc}" onerror="handleIconError(this, '${l.url}')" class="ico mr-2"><a href="${l.url}" ${target}>${l.name}</a>${lCtrl}</li>`;
                });
                html += `</ul></div>`;
            });
            html += `</div></div>`;
        });
        $panels.append(html + `</div></div></div></div></div>`);
    });
    if (isEditMode) $btns.append(`<div class="col-sm-3 col-md-3 col-lg-2 mb-3 d-flex align-items-center justify-content-center"><button class="btn btn-success shadow-sm" style="width: 50px; height: 50px; border-radius: 50%; font-size: 20px;" onclick="addCategory()">+</button></div>`);
    
    updateWidgets(); translateUI(); initDragAndDrop(); showActivePanel(); setWelcome();
}

// --- Widgets ---
function updateWidgets() {
    const $container = $('#widgets-container').empty();
    const lang = currentData.settings.language || 'de';
    const t = uiTexts[lang] || uiTexts['en'];
    const loc = currentData.settings.location || { name: "Berlin" };

    currentData.widgets.forEach((w, idx) => {
        const align = w.align === 'right' ? 'align-right' : '';
        const icon = w.type === 'clock' ? '🕒' : '☁️';
        const dateStr = new Date().toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long' });
        const label = w.type === 'clock' ? dateStr : `${loc.name}, ${loc.country_code || loc.country || ''}`;
        
        $container.append(`<div class="widget-item ${align} drag-handle" data-idx="${idx}" onclick="if(isEditMode) removeWidget(${idx})">
            <div class="widget-icon">${icon}</div>
            <div class="widget-content"><div class="widget-label">${label}</div><div class="widget-value ${w.type==='clock'?'live-clock':'weather-temp'}">--</div></div>
            ${isEditMode ? `<div class="widget-align-btn" onclick="event.stopPropagation(); toggleWidgetAlign(${idx})">${w.align==='right'?'◀':'►'}</div>` : ''}
        </div>`);
    });

    if (isEditMode) {
        if(!currentData.widgets.some(w => w.type==='clock')) $container.append(`<button class="btn btn-sm btn-outline-secondary mr-2" onclick="addWidget('clock')">+ ${t.time}</button>`);
        if(!currentData.widgets.some(w => w.type==='weather')) $container.append(`<button class="btn btn-sm btn-outline-secondary" onclick="addWidget('weather')">+ ${t.weather}</button>`);
    }
    startClock();
    if (Date.now() - lastWeatherFetch > 1800000) fetchWeather(); // 30 min interval
    else updateWeatherDisplay();
}

function startClock() {
    if (widgetTimer) clearInterval(widgetTimer);
    widgetTimer = setInterval(() => {
        const opt = { hour:'2-digit', minute:'2-digit', second:'2-digit', timeZone: currentData.settings.location?.timezone };
        $('.live-clock').text(new Date().toLocaleTimeString(currentData.settings.language || 'de', opt));
    }, 1000);
}

function updateWeatherDisplay() {
    const temp = localStorage.getItem('last-weather-temp');
    if (temp) $('.weather-temp').text(`${temp}°C`);
}

async function fetchWeather() {
    const loc = currentData.settings.location || { lat: 52.52, lon: 13.41 };
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true`);
        if(!res.ok) return;
        const d = await res.json();
        const temp = Math.round(d.current_weather.temperature);
        localStorage.setItem('last-weather-temp', temp);
        lastWeatherFetch = Date.now();
        updateWeatherDisplay();
    } catch(e) {}
}

// --- Global Actions ---
window.removeWidget = (idx) => { currentData.widgets.splice(idx, 1); saveData(); };
window.addWidget = (type) => { currentData.widgets.push({ type, align: 'left' }); saveData(); };
window.toggleWidgetAlign = (idx) => { currentData.widgets[idx].align = currentData.widgets[idx].align==='left' ? 'right' : 'left'; saveData(); };
window.addCategory = () => { openModal('+ Category', [{id:'n', label:'Name'}, {id:'c', label:'Color', type:'color', value:'#0071e3'}], r => { if(r.n) { currentData.categories.push({id:"panel-"+Date.now(), category:r.n, title:r.n, headerColor:r.c, columns:[{sections:[]}]}); saveData(); } }); };
window.addSection = (ci) => { 
    const cols = currentData.categories[ci].columns;
    if(!cols?.length) { showToast(uiTexts[currentData.settings.language].noColsErr); return; }
    openModal('+ Section', [{id:'t', label:'Title'}, {id:'c', label:'Column (1-'+cols.length+')', value:'1'}], r => {
        const idx = Math.max(0, Math.min(cols.length-1, (parseInt(r.c)||1)-1));
        cols[idx].sections.push({title:r.t, links:[]}); saveData();
    });
};
window.addLink = (ci, coli, si) => { 
    const t = uiTexts[currentData.settings.language || 'de'];
    openModal('+ Link', [{id:'n', label:t.name}, {id:'u', label:t.url}, {id:'i', label:t.iconPath}], r => { 
        if(r.n && r.u) { 
            let linkObj = {name:r.n, url:r.u.includes('://')?r.u:'https://'+r.u};
            if (r.i) linkObj.icon = r.i;
            currentData.categories[ci].columns[coli].sections[si].links.push(linkObj); 
            saveData(); 
        } 
    }); 
};
window.editCategory = (i) => { const c = currentData.categories[i]; openModal('Edit', [{id:'n', label:'Name', value:c.category}, {id:'t', label:'Title', value:c.title}, {id:'c', label:'Color', type:'color', value:c.headerColor}], r => { c.category=r.n; c.title=r.t; c.headerColor=r.c; saveData(); }); };
window.editSection = (ci, coli, si) => { const s = currentData.categories[ci].columns[coli].sections[si]; openModal('Edit', [{id:'t', label:'Title', value:s.title}], r => { s.title=r.t; saveData(); }); };
window.editLink = (ci, coli, si, li) => { 
    const l = currentData.categories[ci].columns[coli].sections[si].links[li]; 
    const t = uiTexts[currentData.settings.language || 'de'];
    openModal('Edit', [{id:'n', label:t.name, value:l.name}, {id:'u', label:t.url, value:l.url}, {id:'i', label:t.iconPath, value:l.icon || ''}], r => { 
        l.name=r.n; l.url=r.u; 
        if (r.i) l.icon = r.i; else delete l.icon;
        saveData(); 
    }); 
};
window.deleteCategory = (i) => { if(confirm('Delete?')) { currentData.categories.splice(i, 1); saveData(); } };
window.deleteColumn = (ci, coli) => { if(confirm('Delete?')) { currentData.categories[ci].columns.splice(coli, 1); saveData(); } };
window.deleteSection = (ci, coli, si) => { if(confirm('Delete?')) { currentData.categories[ci].columns[coli].sections.splice(si, 1); saveData(); } };
window.deleteLink = (ci, coli, si, li) => { if(confirm('Delete?')) { currentData.categories[ci].columns[coli].sections[si].links.splice(li, 1); saveData(); } };
window.addColumn = (ci) => { currentData.categories[ci].columns.push({sections:[]}); saveData(); };

window.addShortLink = () => {
    const t = uiTexts[currentData.settings.language || 'de'];
    openModal('+ Favorite', [{id:'n', label:t.name}, {id:'u', label:t.url}, {id:'i', label:t.iconPath}], r => {
        if(r.n && r.u) {
            let linkObj = { name: r.n, url: r.u.includes('://') ? r.u : 'https://' + r.u };
            if (r.i) linkObj.icon = r.i;
            currentData.shortLinks.push(linkObj);
            saveData();
        }
    });
};
window.editShortLink = (i) => {
    const l = currentData.shortLinks[i];
    const t = uiTexts[currentData.settings.language || 'de'];
    openModal('Edit Favorite', [{id:'n', label:t.name, value:l.name}, {id:'u', label:t.url, value:l.url}, {id:'i', label:t.iconPath, value:l.icon || ''}], r => {
        if(r.n && r.u) { 
            l.name = r.n; l.url = r.u; 
            if (r.i) l.icon = r.i; else delete l.icon;
            saveData(); 
        }
    });
};
window.deleteShortLink = (i) => { if(confirm('Delete?')) { currentData.shortLinks.splice(i, 1); saveData(); } };

window.handleIconError = (img, url) => { 
    const domain = getDomain(url);
    if (!domain) { img.src = 'img/default.ico'; return; }
    img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`; 
    img.onerror = () => img.src = 'img/default.ico'; 
};

// --- Sortables ---
function initDragAndDrop() {
    cleanupSortables(); if(!isEditMode) return;
    const opt = { animation: 150, ghostClass: 'sortable-ghost', handle: '.drag-handle' };
    const push = (el, cfg) => { if(el) sortableInstances.push(new Sortable(el, cfg)); };
    
    push(document.getElementById('short-links'), { ...opt, onEnd: e => { const item = currentData.shortLinks.splice(e.oldIndex, 1)[0]; currentData.shortLinks.splice(e.newIndex, 0, item); saveData(); }});
    push(document.getElementById('category-buttons'), { ...opt, draggable: '.category-item', onEnd: e => { const item = currentData.categories.splice(e.oldIndex, 1)[0]; currentData.categories.splice(e.newIndex, 0, item); saveData(); }});
    push(document.getElementById('widgets-container'), { ...opt, onEnd: e => { const item = currentData.widgets.splice(e.oldIndex, 1)[0]; currentData.widgets.splice(e.newIndex, 0, item); saveData(); }});
    
    document.querySelectorAll('.sections-wrapper').forEach(el => {
        push(el, { ...opt, group: `cat-${el.dataset.catIdx}-sections`, draggable: '.section-item', onEnd: e => {
            const f = e.from.dataset, t = e.to.dataset; 
            const fCat = parseInt(f.catIdx), tCat = parseInt(t.catIdx);
            const fCol = parseInt(f.colIdx), tCol = parseInt(t.colIdx);
            if(fCat !== tCat) { renderUI(); return; }
            const item = currentData.categories[fCat].columns[fCol].sections.splice(e.oldIndex, 1)[0];
            currentData.categories[tCat].columns[tCol].sections.splice(e.newIndex, 0, item); saveData();
        }});
    });
    
    document.querySelectorAll('.links-list').forEach(el => {
        push(el, { ...opt, group: 'all-links', onEnd: e => {
            const f = e.from.dataset, t = e.to.dataset;
            const fCat = parseInt(f.catIdx), tCat = parseInt(t.catIdx);
            const fCol = parseInt(f.colIdx), tCol = parseInt(t.colIdx);
            const fSec = parseInt(f.secIdx), tSec = parseInt(t.secIdx);
            const item = currentData.categories[fCat].columns[fCol].sections[fSec].links.splice(e.oldIndex, 1)[0];
            currentData.categories[tCat].columns[tCol].sections[tSec].links.splice(e.newIndex, 0, item); saveData();
        }});
    });
}
function cleanupSortables() { sortableInstances.forEach(i => i.destroy()); sortableInstances = []; }

// --- Initialization ---
$(document).ready(() => {
    let saved = localStorage.getItem('startpage_links');
    let needsUpdate = false;
    let fileData = typeof LINKS_DATA !== 'undefined' ? LINKS_DATA : null;

    if (saved && fileData) {
        try {
            const parsedSaved = JSON.parse(saved);
            const savedTime = parsedSaved.lastUpdated ? new Date(parsedSaved.lastUpdated).getTime() : 0;
            const fileTime = fileData.lastUpdated ? new Date(fileData.lastUpdated).getTime() : 0;
            if (fileTime > savedTime) {
                needsUpdate = true;
            }
        } catch(e) {}
    }

    currentData = saved ? JSON.parse(saved) : fileData;
    if(!currentData) return;
    
    cleanData(); 
    applyTheme(currentData.settings.theme); 
    if (currentData.settings.uiScale) {
        document.documentElement.style.setProperty('--ui-scale', currentData.settings.uiScale);
        $('#ui-scale-setting').val(currentData.settings.uiScale);
    }
    translateUI(); 
    renderUI();

    if (needsUpdate) {
        const lang = currentData.settings.language || 'de';
        const t = uiTexts[lang] || uiTexts['en'];
        const $t = $(`<div class="toast-msg d-flex align-items-center" style="animation: fadeInUp 0.3s ease;">
            <span class="mr-3">${t.toastUpdate || 'Update available.'}</span>
            <button class="btn btn-sm btn-primary mr-2" id="toast-reload-btn" style="border-radius: 10px;">${t.reloadFile || 'Reload'}</button>
            <button class="btn btn-sm btn-outline-light" onclick="$(this).parent().fadeOut(300, function(){$(this).remove()})" style="border-radius: 10px;">✕</button>
        </div>`);
        $('#toast-container').append($t);
        $('#toast-reload-btn').on('click', () => {
            localStorage.removeItem('startpage_links');
            location.reload();
        });
    }

    $('#open-menu, #close-menu, #menu-overlay').on('click', () => $('#settings-menu, #menu-overlay').toggleClass('active'));
    $(document).on('click', '.category-item', function() { setActivePanel($(this).data('target')); });
    
    $('#reload-file-btn').on('click', () => {
        if(confirm("Reload from file? Unsaved changes will be lost.")) {
            localStorage.removeItem('startpage_links');
            location.reload();
        }
    });

    $(document).on('click', '#modal-save', function() {
        if (activeModalCallback) {
            const res = {};
            $('#modal-body input').each(function() { 
                const id = $(this).attr('id');
                if (id) res[id.replace('modal-field-', '')] = $(this).val(); 
            });
            activeModalCallback(res);
        }
        closeModal();
    });
    $(document).on('click', '#modal-cancel', closeModal);

    $('#theme-setting').on('change', e => { applyTheme(e.target.value); saveData(); });
    $('#add-theme-btn').on('click', () => openThemeModal());
    $('#edit-theme-btn').on('click', () => openThemeModal(currentData.settings.theme));
    $('#delete-theme-btn').on('click', () => { if(confirm("Delete theme?")) { delete currentData.settings.customThemes[currentData.settings.theme]; updateThemeDropdown(); applyTheme('Light'); saveData(); } });
    
    $(document).on('click', '.lang-flag-btn', function() {
        currentData.settings.language = $(this).data('lang');
        saveData(); translateUI();
    });

    $('#ui-scale-setting').on('input', e => { document.documentElement.style.setProperty('--ui-scale', e.target.value); }).on('change', () => saveData());
    $('#open-in-new-tab-setting').on('change', e => { currentData.settings.openInNewTab = e.target.checked; saveData(); });
    
    // Greeting settings listeners
    $('#greeting-mode-setting').on('change', e => { 
        currentData.settings.greetingType = e.target.value; 
        $('#static-greeting-input').toggleClass('hidden', e.target.value !== 'static');
        $('#edit-greetings-btn').toggleClass('hidden', e.target.value !== 'dynamic');
        saveData(); 
    });
    $('#show-username-setting').on('change', e => { currentData.settings.showUserName = e.target.checked; saveData(); });
    $('#static-greeting-input').on('change', e => { currentData.settings.staticGreeting = e.target.value; saveData(); });

    $('#export-btn').on('click', syncToFile);
    $('#main-edit-btn').on('click', () => { isEditMode = !isEditMode; renderUI(); });
    $(document).on('click', '#add-short-link-btn', addShortLink);
    
    $('#edit-location-btn').on('click', () => {
        const t = uiTexts[currentData.settings.language || 'de'];
        const loc = currentData.settings.location || {};
        const currentLoc = loc.name ? `${loc.name}${loc.country ? ' ('+loc.country+')' : ''}` : '';
        openModal(t.editLoc, [{id:'c', label:t.locLabel, value:currentLoc}], async r => {
            if(!r.c) return;
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(r.c)}&count=1&language=en&format=json`);
            const d = await res.json();
            if(d.results?.[0]) {
                const item = d.results[0];
                currentData.settings.location = { 
                    name: item.name, 
                    country: item.country,
                    country_code: item.country_code,
                    lat: item.latitude, 
                    lon: item.longitude, 
                    timezone: item.timezone 
                };
                saveData();
            }
        });
    });
    
    $('#edit-username-btn').on('click', () => {
        const t = uiTexts[currentData.settings.language || 'de'];
        openModal(t.editUser, [{id:'n', label:t.name, value:currentData.settings.userName}], r => { currentData.settings.userName = r.n; saveData(); });
    });
    
    $('#edit-greetings-btn').on('click', () => {
        const lang = currentData.settings.language || 'de';
        if(!currentData.settings.greetings) currentData.settings.greetings = JSON.parse(JSON.stringify(defaultGreetings));
        
        let allHours = new Set();
        Object.keys(currentData.settings.greetings).forEach(l => {
            Object.keys(currentData.settings.greetings[l]).forEach(h => allHours.add(Number(h)));
        });
        let sortedHours = Array.from(allHours).sort((a,b)=>a-b);

        openModal(uiTexts[lang].editGreet, [], () => {
            const newGreetings = {};
            const langsToSync = Object.keys(currentData.settings.greetings);
            langsToSync.forEach(l => newGreetings[l] = {});
            
            $('#modal-body .greeting-row').each(function() {
                const timeVal = $(this).find('.g-time').val();
                const textVal = $(this).find('.g-text').val();
                const origTime = $(this).data('orig-time');
                
                if (timeVal !== undefined && timeVal !== '' && !isNaN(timeVal)) {
                    const h = parseInt(timeVal);
                    if (h >= 0 && h <= 23) {
                        const newText = textVal ? textVal.trim() : '';
                        if (newText) newGreetings[lang][h] = newText;
                        
                        langsToSync.forEach(l => {
                            if (l !== lang) {
                                const oldText = origTime !== undefined ? currentData.settings.greetings[l]?.[origTime] : null;
                                newGreetings[l][h] = newGreetings[l][h] || oldText || newText || 'Hello';
                            }
                        });
                    }
                }
            });
            currentData.settings.greetings = newGreetings;
            saveData();
            setWelcome();
        });
        
        const $body = $('#modal-body');
        $body.append(`<div id="greetings-list"></div>`);
        const $list = $('#greetings-list');
        
        const addRow = (h = '', text = '', orig = '') => {
            $list.append(`
                <div class="row mb-2 greeting-row align-items-center" data-orig-time="${orig}">
                    <div class="col-4">
                        <input type="number" class="form-control g-time" value="${h}" placeholder="Hr (0-23)" min="0" max="23" style="border-radius:10px;">
                    </div>
                    <div class="col-6">
                        <input type="text" class="form-control g-text" value="${text}" placeholder="Greeting text" style="border-radius:10px;">
                    </div>
                    <div class="col-2 text-right">
                        <button type="button" class="btn btn-sm btn-outline-danger g-remove" style="border-radius:10px;">✕</button>
                    </div>
                </div>
            `);
        };
        
        sortedHours.forEach(h => {
            addRow(h, currentData.settings.greetings[lang]?.[h] || '', h);
        });
        
        $body.append(`<button type="button" class="btn btn-sm btn-outline-success mt-2 w-100" id="add-greeting-row" style="border-radius:10px;">+ Add Slot</button>`);
        
        $('#add-greeting-row').on('click', () => addRow());
        $body.on('click', '.g-remove', function() { $(this).closest('.greeting-row').remove(); });
    });

    $("#search-input").on("input", e => {
        const v = e.target.value.toLowerCase().trim(); $('#search-clear').toggleClass('hidden', !v);
        if(!v) { renderUI(); return; }
        
        $('.link-panel').each(function() {
            const $panel = $(this);
            let panelHasMatch = false;
            
            $panel.find('.section-item').each(function() {
                const $section = $(this);
                let sectionHasMatch = false;
                
                $section.find('li').each(function() {
                    const $li = $(this);
                    const match = $li.text().toLowerCase().includes(v);
                    $li.toggle(match);
                    if(match) sectionHasMatch = true;
                });
                
                $section.toggle(sectionHasMatch);
                if(sectionHasMatch) panelHasMatch = true;
            });
            
            $panel.toggle(panelHasMatch).removeClass('hidden');
        });
    });
    $('#search-clear').on('click', () => $('#search-input').val('').trigger('input').focus());
});
