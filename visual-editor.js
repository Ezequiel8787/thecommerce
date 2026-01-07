class VisualEditor {
    constructor() {
        this.editMode = false;
        this.selectedElement = null;
        this.originalContent = {};
        this.changes = {};
        this.clientNotes = '';
        this.notesStorageKey = '';
        this.toolbarCollapsed = false;
        // Detectar página actual correctamente
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        // Si no tiene extensión, asumir que es index.html (para URLs como / o /?edit=true)
        this.pageId = currentPage.includes('.html') ? currentPage.replace('.html', '_html') : 'index_html';
        this.notesStorageKey = `visualEditorNotes_${this.pageId}`;
        
        // Debug logging
        console.log('🔍 VisualEditor iniciado:', {
            currentPage,
            pageId: this.pageId,
            pathname: window.location.pathname,
            search: window.location.search
        });
        try {
            this.clientNotes = localStorage.getItem(this.notesStorageKey) || '';
        } catch (e) {
            console.log('ℹ️ Notas locales no disponibles:', e.message);
        }
        this.editorPassword = 'thm2024'; // Contraseña para acceder al editor
        this.isAuthenticated = false;
        
        // Solo mostrar el editor si la URL tiene ?edit=true
        const urlParams = new URLSearchParams(window.location.search);
        this.editorEnabled = urlParams.get('edit') === 'true';
        
        // Solo crear la UI si está habilitado el modo edición
        if (this.editorEnabled) {
            this.createEditorUI();
            this.setupEditor();
        }
        this.loadSavedChanges();
    }

    setupEditor() {
        this.createColorPicker();
        this.createImageUploader();
        this.setupKeyboardShortcuts();
    }
    
    // Sistema de guardado persistente - usando archivo JSON
    async loadSavedChanges() {
        console.log('🔍 Cargando cambios desde editor-changes.json...');
        
        try {
            const response = await fetch('editor-changes.json');
            if (response.ok) {
                const allChanges = await response.json();
                this.changes = allChanges[this.pageId] || {};
                if (allChanges.meta?.notes) {
                    this.clientNotes = allChanges.meta.notes;
                    this.persistNotesLocally();
                }
                console.log('� Cambios cargados:', Object.keys(this.changes).length, 'elementos');
                
                if (Object.keys(this.changes).length > 0) {
                    this.applyStoredChanges();
                }
            }
        } catch (e) {
            console.log('📦 No hay cambios guardados o error:', e.message);
            this.changes = {};
        }
    }
    
    applyStoredChanges() {
        Object.keys(this.changes).forEach(selector => {
            const change = this.changes[selector];
            let element = null;
            
            // Manejar selectores personalizados :eq()
            if (selector.includes(':eq(')) {
                const match = selector.match(/^(\w+):eq\((\d+)\)$/);
                if (match) {
                    const tag = match[1];
                    const index = parseInt(match[2]);
                    const allOfType = document.querySelectorAll(tag);
                    element = allOfType[index] || null;
                }
            } else {
                try {
                    element = document.querySelector(selector);
                } catch (e) {
                    console.log('❌ Selector inválido:', selector);
                }
            }
            
            if (element) {
                if (change.text !== undefined) {
                    element.textContent = change.text;
                }
                if (change.color) {
                    element.style.color = change.color;
                }
                if (change.backgroundColor) {
                    element.style.backgroundColor = change.backgroundColor;
                }
                if (change.src && element.tagName === 'IMG') {
                    element.src = change.src;
                }
                if (change.options && element.tagName === 'SELECT') {
                    element.innerHTML = '';
                    change.options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.text = opt.text;
                        element.add(option);
                    });
                }
            }
        });
    }
    
    saveChanges() {
        // Guardar en memoria y mostrar instrucciones para guardar permanentemente
        console.log('💾 Cambios en memoria:', Object.keys(this.changes).length, 'elementos');
        console.log('💾 Para guardar permanentemente, usa el botón "📁 Descargar Cambios"');
    }
    
    downloadAndSaveChanges() {
        const hasNotes = this.clientNotes.trim().length > 0;
        if (Object.keys(this.changes).length === 0 && !hasNotes) {
            this.showNotification('⚠️ No hay cambios para guardar. Edita algo primero.', 'info');
            return;
        }
        
        // Descargar archivo JSON con los cambios
        const allChanges = {
            meta: {
                page: this.pageId,
                exportedAt: new Date().toISOString(),
                notes: this.clientNotes.trim()
            }
        };
        allChanges[this.pageId] = this.changes;
        
        const data = JSON.stringify(allChanges, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'editor-changes.json';
        a.click();
        URL.revokeObjectURL(url);
        
        // Mostrar instrucciones claras
        this.showInstructions();
    }
    
    showInstructions() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center';
        const notesReminder = this.clientNotes.trim().length > 0 ? `
                <div class="bg-purple-50 p-4 rounded-xl mb-4 border border-purple-100">
                    <h3 class="font-bold text-purple-800 mb-2">📝 Tus notas también se guardaron</h3>
                    <p class="text-sm text-purple-700">Comparte el archivo conmigo; el apartado <strong>"Notas para soporte"</strong> viene incluido para que sepamos qué falta.</p>
                </div>
        ` : '';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">✅</div>
                    <h2 class="text-2xl font-bold text-slate-900">¡Archivo Descargado!</h2>
                </div>
                <div class="bg-emerald-50 p-4 rounded-xl mb-6">
                    <h3 class="font-bold text-emerald-800 mb-2">📋 Siguiente paso:</h3>
                    <ol class="text-emerald-700 text-sm space-y-2">
                        <li><strong>1.</strong> Busca el archivo <code class="bg-emerald-100 px-1 rounded">editor-changes.json</code> en tus Descargas</li>
                        <li><strong>2.</strong> Cópialo a la carpeta del proyecto (reemplaza el existente)</li>
                        <li><strong>3.</strong> Recarga la página para ver los cambios</li>
                    </ol>
                </div>
                ${notesReminder}
                <button onclick="this.closest('.fixed').remove()" class="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition">
                    ¡Entendido!
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    getElementSelector(element) {
        // Crear un selector único y estable para el elemento
        if (element.id) {
            return `#${element.id}`;
        }
        
        // Usar data-attributes existentes
        const dataAttrs = ['data-hero', 'data-stat', 'data-nosotros', 'data-contact'];
        for (const attr of dataAttrs) {
            if (element.hasAttribute(attr)) {
                return `[${attr}="${element.getAttribute(attr)}"]`;
            }
        }
        
        // Usar índice global del elemento por tipo de tag
        const tag = element.tagName.toLowerCase();
        const allOfType = document.querySelectorAll(tag);
        const index = Array.from(allOfType).indexOf(element);
        
        if (index !== -1) {
            return `${tag}:eq(${index})`;
        }
        
        // Fallback: usar texto como identificador
        const text = element.textContent.trim().substring(0, 50);
        return `text:${text}`;
    }
    
    trackChange(element, changeType, value) {
        const selector = this.getElementSelector(element);
        console.log('💾 Guardando cambio:', { selector, changeType, value: typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value });
        
        if (!this.changes[selector]) {
            this.changes[selector] = {};
        }
        
        this.changes[selector][changeType] = value;
        
        // Auto-guardar cambios
        this.saveChanges();
        console.log('💾 Total cambios guardados:', Object.keys(this.changes).length);
    }

    createEditorUI() {
        // Agregar estilos CSS necesarios
        const styles = document.createElement('style');
        styles.textContent = `
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-scale-in {
                animation: scaleIn 0.2s ease;
            }
            .animate-pulse {
                animation: pulse 2s ease-in-out infinite;
            }
            .animate-fade-in {
                animation: fadeIn 0.3s ease;
            }
            .editable-hover {
                cursor: pointer !important;
                position: relative !important;
                transition: all 0.2s ease !important;
            }
            .editable-hover:hover {
                outline: 2px dashed #3b82f6 !important;
                outline-offset: 4px !important;
                background-color: rgba(59, 130, 246, 0.05) !important;
                border-radius: 4px !important;
            }
            .editable-hover::after {
                content: '✏️' !important;
                position: absolute !important;
                top: -8px !important;
                right: -8px !important;
                background: #3b82f6 !important;
                color: white !important;
                width: 20px !important;
                height: 20px !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 10px !important;
                opacity: 0 !important;
                transition: opacity 0.2s ease !important;
                pointer-events: none !important;
                z-index: 1000 !important;
            }
            .editable-hover:hover::after {
                opacity: 1 !important;
            }
            #toggle-edit-mode {
                position: fixed !important;
                bottom: 80px !important;
                right: 16px !important;
                z-index: 99998 !important;
            }
            #inline-color-toolbar {
                position: fixed !important;
                z-index: 99999 !important;
            }
            #floating-edit-menu {
                position: absolute !important;
                z-index: 99999 !important;
            }
        `;
        document.head.appendChild(styles);
        
        const editorHTML = `
            <button id="toggle-edit-mode" class="fixed bottom-20 right-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center gap-2 font-bold animate-pulse">
                <span class="text-2xl">✨</span>
                <span>Editar Sitio</span>
            </button>

            <div id="edit-overlay" class="fixed inset-0 bg-black/20 z-40 hidden pointer-events-none"></div>
            
            <!-- Tutorial Guide -->
            <div id="tutorial-guide" class="fixed bottom-24 right-4 bg-white rounded-2xl shadow-2xl p-4 max-w-xs z-50 animate-fade-in">
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-2xl">👋</span>
                    <h3 class="font-bold text-slate-900">¡Bienvenido al Editor!</h3>
                </div>
                <p class="text-sm text-slate-600 mb-3">Haz clic en el botón "Editar Sitio" para comenzar a modificar tu página web fácilmente.</p>
                <div class="flex gap-2">
                    <button id="start-tutorial" class="flex-1 px-3 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition">
                        Comenzar Tutorial
                    </button>
                    <button id="skip-tutorial" class="px-3 py-2 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition">
                        Omitir
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', editorHTML);
        
        // Setup tutorial
        this.setupTutorial();
        
        document.getElementById('toggle-edit-mode').addEventListener('click', () => this.toggleEditMode());
    }

    setupTutorial() {
        // Auto-hide tutorial after 10 seconds
        setTimeout(() => {
            const tutorial = document.getElementById('tutorial-guide');
            if (tutorial && !tutorial.dataset.dismissed) {
                tutorial.classList.add('animate-fade-in');
                setTimeout(() => tutorial.remove(), 300);
            }
        }, 10000);
        
        // Tutorial buttons
        const startBtn = document.getElementById('start-tutorial');
        const skipBtn = document.getElementById('skip-tutorial');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startInteractiveTutorial();
                document.getElementById('tutorial-guide').dataset.dismissed = 'true';
                document.getElementById('tutorial-guide').remove();
            });
        }
        
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                document.getElementById('tutorial-guide').dataset.dismissed = 'true';
                document.getElementById('tutorial-guide').remove();
            });
        }
    }
    
    startInteractiveTutorial() {
        const steps = [
            {
                element: '#toggle-edit-mode',
                title: '🚀 Botón de Edición',
                content: 'Este botón activa el modo edición. Haz clic para comenzar.',
                position: 'top'
            },
            {
                element: 'h1, h2, h3',
                title: '📝 Editar Textos',
                content: 'Haz clic en cualquier título o texto para editarlo directamente.',
                position: 'center'
            },
            {
                element: 'img',
                title: '🖼️ Cambiar Imágenes',
                content: 'Haz clic en las imágenes para cambiarlas por nuevas.',
                position: 'center'
            }
        ];
        
        let currentStep = 0;
        
        const showStep = (stepIndex) => {
            if (stepIndex >= steps.length) {
                this.showTutorialComplete();
                return;
            }
            
            const step = steps[stepIndex];
            const elements = document.querySelectorAll(step.element);
            
            if (elements.length > 0) {
                const element = elements[0];
                this.highlightElement(element, step.title, step.content, step.position);
            } else {
                showStep(stepIndex + 1);
            }
        };
        
        showStep(0);
    }
    
    highlightElement(element, title, content, position = 'top') {
        // Remove existing highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => el.remove());
        
        // Create highlight
        const highlight = document.createElement('div');
        highlight.className = 'tutorial-highlight fixed pointer-events-none z-[99997] animate-scale-in';
        highlight.style.cssText = `
            border: 3px solid #10b981;
            border-radius: 8px;
            position: absolute;
            background: rgba(16, 185, 129, 0.1);
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
        `;
        
        const rect = element.getBoundingClientRect();
        highlight.style.left = rect.left - 5 + 'px';
        highlight.style.top = rect.top - 5 + 'px';
        highlight.style.width = rect.width + 10 + 'px';
        highlight.style.height = rect.height + 10 + 'px';
        
        document.body.appendChild(highlight);
    }
    
    showTutorialComplete() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-2xl font-bold text-slate-900 mb-2">¡Tutorial Completado!</h3>
                <p class="text-slate-600 mb-6">Ahora estás listo para editar tu sitio web como un profesional.</p>
                <button class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:scale-105 transition">
                    🚀 Comenzar a Editar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.querySelector('button').addEventListener('click', () => modal.remove());
    }

    toggleEditMode() {
        // Si no está autenticado, pedir contraseña
        if (!this.isAuthenticated && !this.editMode) {
            this.showPasswordModal();
            return;
        }
        
        this.editMode = !this.editMode;
        const button = document.getElementById('toggle-edit-mode');
        const overlay = document.getElementById('edit-overlay');
        
        if (this.editMode) {
            button.innerHTML = '<span class="text-2xl">✖️</span><span>Salir</span>';
            button.classList.remove('from-emerald-500', 'to-teal-600');
            button.classList.add('from-red-500', 'to-red-600');
            overlay.classList.remove('hidden');
            document.body.classList.add('visual-editor-active');
            this.handleOverlays(true);
            this.enableEditing();
            this.showEditorToolbar();
            this.setupQuickActions();
        } else {
            button.innerHTML = '<span class="text-2xl">✨</span><span>Editar Sitio</span>';
            button.classList.remove('from-red-500', 'to-red-600');
            button.classList.add('from-emerald-500', 'to-teal-600');
            overlay.classList.add('hidden');
            document.body.classList.remove('visual-editor-active');
            this.handleOverlays(false);
            this.disableEditing();
            this.hideEditorToolbar();
        }
    }
    
    setupQuickActions() {
        // Quick edit text
        const quickTextBtn = document.getElementById('quick-edit-text');
        if (quickTextBtn) {
            quickTextBtn.addEventListener('click', () => {
                this.highlightAllEditableElements('text');
                this.showNotification('📝 Haz clic en cualquier texto para editarlo', 'info');
            });
        }
        
        // Quick edit images
        const quickImagesBtn = document.getElementById('quick-edit-images');
        if (quickImagesBtn) {
            quickImagesBtn.addEventListener('click', () => {
                this.highlightAllEditableElements('images');
                this.showNotification('🖼️ Haz clic en cualquier imagen para cambiarla', 'info');
            });
        }
        
        // Quick colors
        const quickColorsBtn = document.getElementById('quick-edit-colors');
        if (quickColorsBtn) {
            quickColorsBtn.addEventListener('click', () => {
                this.showColorPicker();
                this.showNotification('🎨 Selecciona un elemento y luego un color', 'info');
            });
        }
        
        // Preview mode
        const quickPreviewBtn = document.getElementById('quick-preview');
        if (quickPreviewBtn) {
            quickPreviewBtn.addEventListener('click', () => {
                this.togglePreviewMode();
            });
        }
        
        // Help button
        const helpBtn = document.getElementById('btn-help');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelpModal();
            });
        }
    }
    
    highlightAllEditableElements(type) {
        // Remove existing highlights
        document.querySelectorAll('.editable-highlight').forEach(el => {
            el.classList.remove('editable-highlight');
        });
        
        if (type === 'text') {
            document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button').forEach(el => {
                if (this.isElementEditable(el)) {
                    el.classList.add('editable-highlight');
                    el.style.outline = '2px solid #10b981';
                    el.style.outlineOffset = '2px';
                    el.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                }
            });
        } else if (type === 'images') {
            document.querySelectorAll('img').forEach(el => {
                el.classList.add('editable-highlight');
                el.style.outline = '3px solid #3b82f6';
                el.style.outlineOffset = '3px';
                el.style.borderRadius = '8px';
            });
        }
        
        // Remove highlights after 3 seconds
        setTimeout(() => {
            document.querySelectorAll('.editable-highlight').forEach(el => {
                el.classList.remove('editable-highlight');
                el.style.outline = '';
                el.style.outlineOffset = '';
                el.style.backgroundColor = '';
                el.style.borderRadius = '';
            });
        }, 3000);
    }
    
    isElementEditable(element) {
        const tagName = element.tagName.toLowerCase();
        const editableTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button', 'div'];
        
        // Skip certain elements
        if (element.id && (element.id.includes('toggle') || element.id.includes('editor') || element.id.includes('password'))) {
            return false;
        }
        
        // Skip if it's inside the editor toolbar
        if (element.closest('#editor-main-toolbar')) {
            return false;
        }
        
        return editableTags.includes(tagName) && element.textContent.trim().length > 0;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 px-6 py-3 rounded-xl shadow-2xl z-[99999] animate-scale-in font-semibold text-sm`;
        
        if (type === 'info') {
            notification.classList.add('bg-blue-500', 'text-white');
        } else if (type === 'success') {
            notification.classList.add('bg-emerald-500', 'text-white');
        } else if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('animate-fade-in');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    showHelpModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl animate-scale-in max-h-[80vh] overflow-y-auto">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">❓</div>
                    <h2 class="text-2xl font-bold text-slate-900">Ayuda del Editor</h2>
                </div>
                
                <div class="space-y-4 mb-6">
                    <div class="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                        <h3 class="font-bold text-emerald-800 mb-2">📝 Editar Textos</h3>
                        <p class="text-sm text-slate-700">Haz clic en cualquier texto para editarlo directamente. Los cambios se guardan automáticamente.</p>
                    </div>
                    
                    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h3 class="font-bold text-blue-800 mb-2">🖼️ Cambiar Imágenes</h3>
                        <p class="text-sm text-slate-700">Haz clic en una imagen y pega una nueva URL o arrastra una imagen desde tu computadora.</p>
                    </div>
                    
                    <div class="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <h3 class="font-bold text-purple-800 mb-2">🎨 Cambiar Colores</h3>
                        <p class="text-sm text-slate-700">Selecciona un elemento y usa el selector de colores para cambiar su color de texto o fondo.</p>
                    </div>
                    
                    <div class="bg-orange-50 rounded-xl p-4 border border-orange-200">
                        <h3 class="font-bold text-orange-800 mb-2">💾 Guardar Cambios</h3>
                        <p class="text-sm text-slate-700">Haz clic en "Guardar Cambios" para descargar un archivo JSON con todas tus modificaciones.</p>
                    </div>
                </div>
                
                <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 class="font-bold text-slate-800 mb-2">⌨️ Atajos de Teclado</h3>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div><kbd class="px-2 py-1 bg-white rounded">Esc</kbd> - Salir del modo edición</div>
                        <div><kbd class="px-2 py-1 bg-white rounded">Ctrl+Z</kbd> - Deshacer último cambio</div>
                        <div><kbd class="px-2 py-1 bg-white rounded">Ctrl+S</kbd> - Guardar cambios</div>
                        <div><kbd class="px-2 py-1 bg-white rounded">Ctrl+P</kbd> - Vista previa</div>
                    </div>
                </div>
                
                <div class="flex gap-3 mt-6">
                    <button class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:scale-105 transition">
                        Entendido
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.querySelector('button').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    showPasswordModal() {
        const modal = document.createElement('div');
        modal.id = 'password-modal';
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">🔐</div>
                    <h2 class="text-2xl font-bold text-slate-900">Acceso al Editor</h2>
                    <p class="text-slate-600 mt-2">Ingresa la contraseña para editar el contenido</p>
                    <div class="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <p class="text-xs text-emerald-700 font-semibold">💡 Contraseña sugerida: <code class="bg-emerald-100 px-2 py-1 rounded">thm2024</code></p>
                    </div>
                </div>
                <input type="password" id="editor-password-input" placeholder="Ingresa la contraseña" 
                    class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-center text-lg mb-4">
                <div id="password-error" class="text-red-500 text-sm text-center mb-4 hidden">
                    <span class="font-semibold">❌ Contraseña incorrecta</span>
                    <br>Inténtalo de nuevo o usa la contraseña sugerida
                </div>
                <div class="flex gap-3">
                    <button id="password-submit" class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:scale-105 transition">
                        🚀 Entrar al Editor
                    </button>
                    <button id="password-cancel" class="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition">
                        Cancelar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        const input = document.getElementById('editor-password-input');
        input.focus();
        
        input.onkeydown = (e) => {
            if (e.key === 'Enter') this.verifyPassword();
            if (e.key === 'Escape') modal.remove();
        };
        
        document.getElementById('password-submit').onclick = () => this.verifyPassword();
        document.getElementById('password-cancel').onclick = () => modal.remove();
    }
    
    verifyPassword() {
        const input = document.getElementById('editor-password-input');
        const error = document.getElementById('password-error');
        
        if (input.value === this.editorPassword) {
            this.isAuthenticated = true;
            document.getElementById('password-modal').remove();
            this.toggleEditMode();
        } else {
            error.classList.remove('hidden');
            input.classList.add('border-red-500');
            input.value = '';
            input.focus();
        }
    }
    
    showEditorToolbar() {
        if (this.toolbarCollapsed) {
            this.renderCollapsedToolbarButton();
            return;
        }
        
        const toolbar = document.createElement('div');
        toolbar.id = 'editor-main-toolbar';
        toolbar.className = 'fixed top-4 right-4 bg-white rounded-2xl shadow-2xl px-6 py-4 z-[99998] max-w-md w-full sm:w-[420px] animate-scale-in';
        toolbar.innerHTML = `
            <div class="flex items-center gap-4 mb-4">
                <div class="flex items-center gap-2 text-emerald-600 font-bold">
                    <span class="text-xl">🎨</span>
                    <span>Editor Visual</span>
                </div>
                <div class="h-6 w-px bg-slate-300"></div>
                <span class="text-sm text-slate-500">✨ Haz clic en cualquier elemento para editarlo</span>
                <button id="collapse-toolbar-btn" class="ml-auto px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-xs font-semibold flex items-center gap-1" title="Minimizar panel">
                    <span>—</span>
                    <span>Minimizar</span>
                </button>
            </div>
            
            <!-- Quick Actions -->
            <div class="mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <h4 class="text-sm font-bold text-emerald-800 mb-2">🚀 Acciones Rápidas</h4>
                <div class="grid grid-cols-2 gap-2">
                    <button id="quick-edit-text" class="px-3 py-2 bg-white text-emerald-700 text-xs rounded-lg hover:bg-emerald-100 transition font-semibold border border-emerald-300">
                        📝 Editar Textos
                    </button>
                    <button id="quick-edit-images" class="px-3 py-2 bg-white text-emerald-700 text-xs rounded-lg hover:bg-emerald-100 transition font-semibold border border-emerald-300">
                        🖼️ Cambiar Imágenes
                    </button>
                    <button id="quick-edit-colors" class="px-3 py-2 bg-white text-emerald-700 text-xs rounded-lg hover:bg-emerald-100 transition font-semibold border border-emerald-300">
                        🎨 Colores
                    </button>
                    <button id="quick-preview" class="px-3 py-2 bg-white text-emerald-700 text-xs rounded-lg hover:bg-emerald-100 transition font-semibold border border-emerald-300">
                        👁️ Vista Previa
                    </button>
                </div>
            </div>
            
            <div class="flex flex-wrap items-center gap-3">
                <button id="btn-download-json" class="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:scale-105 transition font-bold text-base flex items-center justify-center gap-2">
                    💾 Guardar Cambios
                </button>
                <button id="btn-export-wix" class="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:scale-105 transition font-semibold text-sm">
                    📤 Wix
                </button>
                <button id="btn-help" class="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transition font-semibold text-sm">
                    ❓ Ayuda
                </button>
            </div>
            <p class="text-xs text-slate-400 mt-2 text-center">💡 Los cambios se guardan automáticamente. Descarga el archivo al final.</p>
            <div class="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        📝 Notas para soporte
                    </div>
                    <span class="text-[11px] text-slate-400">Se guardan en el JSON</span>
                </div>
                <textarea id="support-notes-input" rows="3" class="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-lg p-2 focus:border-purple-500 focus:outline-none" placeholder="Escribe aquí los cambios que no pudiste hacer o cualquier instrucción para soporte."></textarea>
            </div>
        `;
        document.body.appendChild(toolbar);
        
        document.getElementById('btn-download-json').onclick = () => this.downloadAndSaveChanges();
        document.getElementById('btn-export-wix').onclick = () => this.exportForWix();
        this.initializeNotesField();
        document.getElementById('collapse-toolbar-btn').onclick = () => this.collapseToolbar();
    }
    
    hideEditorToolbar() {
        document.getElementById('editor-main-toolbar')?.remove();
        document.getElementById('editor-toolbar-collapsed')?.remove();
        this.toolbarCollapsed = false;
    }

    initializeNotesField() {
        const notesInput = document.getElementById('support-notes-input');
        if (notesInput) {
            notesInput.value = this.clientNotes;
            notesInput.addEventListener('input', (e) => this.handleNotesInput(e.target.value));
        }
    }

    handleNotesInput(value) {
        this.clientNotes = value;
        this.persistNotesLocally();
    }

    persistNotesLocally() {
        if (!this.notesStorageKey) return;
        try {
            localStorage.setItem(this.notesStorageKey, this.clientNotes);
        } catch (e) {
            console.log('ℹ️ No se pudo guardar nota local:', e.message);
        }
    }

    collapseToolbar() {
        if (this.toolbarCollapsed) return;
        this.toolbarCollapsed = true;
        document.getElementById('editor-main-toolbar')?.remove();
        this.renderCollapsedToolbarButton();
    }

    renderCollapsedToolbarButton() {
        if (document.getElementById('editor-toolbar-collapsed')) return;
        const btn = document.createElement('button');
        btn.id = 'editor-toolbar-collapsed';
        btn.className = 'fixed bottom-28 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-xl hover:scale-105 transition z-[99998] flex items-center gap-2 text-sm font-semibold';
        btn.innerHTML = `
            <span>🎨 Editor Visual</span>
            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full">Mostrar</span>
        `;
        btn.onclick = () => this.expandToolbar();
        document.body.appendChild(btn);
    }

    expandToolbar() {
        this.toolbarCollapsed = false;
        document.getElementById('editor-toolbar-collapsed')?.remove();
        this.showEditorToolbar();
    }
    
    showI18nWarning(element) {
        const i18nKey = element.getAttribute('data-i18n');
        const rect = element.getBoundingClientRect();
        
        const warning = document.createElement('div');
        warning.id = 'i18n-warning';
        warning.className = 'fixed z-[99999] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-xl shadow-2xl max-w-sm animate-scale-in';
        warning.style.left = `${rect.left + window.scrollX}px`;
        warning.style.top = `${rect.top + window.scrollY - 80}px`;
        warning.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="text-2xl">⚠️</div>
                <div class="flex-1">
                    <div class="font-bold text-sm mb-1">Texto Multilenguaje</div>
                    <div class="text-xs text-white/90 mb-2">Este texto cambia automáticamente según el idioma (ES/EN).</div>
                    <div class="text-xs bg-white/20 px-2 py-1 rounded font-mono">data-i18n="${i18nKey}"</div>
                    <div class="text-xs mt-2 text-white/80">Si lo editas aquí, se guardará solo para el idioma actual.</div>
                </div>
                <button onclick="this.closest('#i18n-warning').remove()" class="text-white/70 hover:text-white text-xl leading-none">&times;</button>
            </div>
        `;
        document.body.appendChild(warning);
        
        // Auto-cerrar después de 8 segundos
        setTimeout(() => warning?.remove(), 8000);
    }
    
    saveAllChanges() {
        this.saveChanges();
        this.showNotification('💾 Todos los cambios guardados', 'success');
    }
    
    downloadChangesJSON() {
        const data = {
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            changes: this.changes
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cambios_${this.pageId}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('📁 Archivo JSON descargado', 'success');
    }
    
    resetAllChanges() {
        if (confirm('¿Estás seguro de que quieres borrar TODOS los cambios de esta página? Esta acción no se puede deshacer.')) {
            this.changes = {};
            this.showNotification('🗑️ Cambios borrados de la memoria. Recarga la página para ver el contenido original.', 'info');
        }
    }
    
    exportForWix() {
        if (Object.keys(this.changes).length === 0) {
            this.showNotification('⚠️ No hay cambios para exportar. Edita algo primero.', 'info');
            return;
        }
        
        // Crear modal con instrucciones claras para Wix
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center';
        
        let changesHTML = '';
        let changeNumber = 1;
        
        Object.keys(this.changes).forEach(selector => {
            const change = this.changes[selector];
            
            if (change.text !== undefined) {
                changesHTML += `
                    <div class="bg-slate-50 p-4 rounded-xl mb-3">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">${changeNumber}</span>
                            <span class="font-bold text-slate-700">Cambiar texto</span>
                        </div>
                        <div class="bg-white p-3 rounded-lg border-2 border-purple-200">
                            <p class="text-sm text-slate-500 mb-1">Nuevo texto:</p>
                            <p class="font-semibold text-slate-900">"${change.text}"</p>
                        </div>
                        <button onclick="navigator.clipboard.writeText('${change.text.replace(/'/g, "\\'")}'); visualEditor.showNotification('📋 Texto copiado', 'success');" class="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition">
                            📋 Copiar texto
                        </button>
                    </div>
                `;
                changeNumber++;
            }
            
            if (change.color) {
                changesHTML += `
                    <div class="bg-slate-50 p-4 rounded-xl mb-3">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">${changeNumber}</span>
                            <span class="font-bold text-slate-700">Cambiar color</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg border-2 border-slate-300" style="background-color: ${change.color}"></div>
                            <code class="bg-white px-3 py-2 rounded-lg border text-sm font-mono">${change.color}</code>
                            <button onclick="navigator.clipboard.writeText('${change.color}'); visualEditor.showNotification('📋 Color copiado', 'success');" class="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition">
                                📋 Copiar
                            </button>
                        </div>
                    </div>
                `;
                changeNumber++;
            }
            
            if (change.src) {
                changesHTML += `
                    <div class="bg-slate-50 p-4 rounded-xl mb-3">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">${changeNumber}</span>
                            <span class="font-bold text-slate-700">Cambiar imagen</span>
                        </div>
                        <img src="${change.src}" class="w-32 h-20 object-cover rounded-lg border-2 border-slate-300 mb-2">
                        <p class="text-xs text-slate-500">Sube esta imagen a Wix y úsala en el elemento correspondiente.</p>
                    </div>
                `;
                changeNumber++;
            }
        });
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        📤 Exportar para Wix
                    </h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-slate-500 hover:text-slate-700 text-2xl">&times;</button>
                </div>
                
                <div class="bg-blue-50 p-4 rounded-xl mb-4">
                    <h3 class="font-bold text-blue-800 mb-2">📋 Cómo aplicar estos cambios en Wix:</h3>
                    <ol class="text-blue-700 text-sm space-y-1">
                        <li><strong>1.</strong> Abre tu sitio en el Editor de Wix</li>
                        <li><strong>2.</strong> Busca el elemento que quieres cambiar</li>
                        <li><strong>3.</strong> Copia el texto/color de abajo y pégalo en Wix</li>
                        <li><strong>4.</strong> Publica los cambios en Wix</li>
                    </ol>
                </div>
                
                <div class="flex-1 overflow-y-auto">
                    <h3 class="font-bold text-slate-700 mb-3">Cambios a aplicar:</h3>
                    ${changesHTML}
                </div>
                
                <button onclick="this.closest('.fixed').remove()" class="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition">
                    ¡Entendido!
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handleOverlays(enable) {
        // Desactivar pointer-events en overlays decorativos para poder clickear imágenes
        const overlays = document.querySelectorAll('div.absolute, div.overlay');
        overlays.forEach(el => {
            // Si es un overlay vacío (probablemente decorativo/gradiente)
            if (!el.textContent.trim() && !el.querySelector('img')) {
                el.style.pointerEvents = enable ? 'none' : '';
            }
        });
    }

    enableEditing() {
        // Seleccionar textos, imágenes y combos
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, img, li, td, th, label, strong, em, b, i, figcaption, cite, blockquote, code, pre, select');
        
        // También seleccionar divs que tengan texto directo (no solo hijos)
        const allDivs = document.querySelectorAll('div');
        const divsWithDirectText = Array.from(allDivs).filter(div => {
            // Verificar si el div tiene texto directo (no solo en hijos)
            const hasDirectText = Array.from(div.childNodes).some(node => 
                node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
            );
            // O si solo tiene texto y no tiene muchos hijos (es un div de texto simple)
            const isSimpleTextDiv = div.children.length === 0 && div.textContent.trim().length > 0;
            return hasDirectText || isSimpleTextDiv;
        });
        
        const editableElements = [...textElements, ...divsWithDirectText];
        
        editableElements.forEach(el => {
            // Excluir elementos del editor
            if (el.closest('#toggle-edit-mode') || 
                el.closest('#floating-edit-menu') ||
                el.closest('#inline-color-toolbar') ||
                el.closest('#color-picker-modal') ||
                el.closest('#image-uploader-modal') ||
                el.id === 'edit-overlay' ||
                el.id === 'toggle-edit-mode') return;
            
            // Excluir navbar
            if (el.closest('nav')) return;
            
            // Excluir inputs y textareas, pero permitir SELECT para editar opciones
            if (el.tagName === 'INPUT' || 
                el.tagName === 'TEXTAREA' ||
                el.id === 'calculate-btn' ||
                el.id === 'calc-results' ||
                el.closest('#calc-results')) return;
            
            el.style.cursor = 'pointer';
            el.style.transition = 'all 0.3s ease';
            
            el.addEventListener('mouseenter', this.highlightElement);
            el.addEventListener('mouseleave', this.unhighlightElement);
            el.addEventListener('click', (e) => this.selectElement(e, el));
            
            // Agregar drag and drop para imágenes
            if (el.tagName === 'IMG') {
                el.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    el.style.outline = '3px dashed #10b981';
                    el.style.opacity = '0.7';
                });
                el.addEventListener('dragleave', (e) => {
                    el.style.outline = '';
                    el.style.opacity = '1';
                });
                el.addEventListener('drop', (e) => this.handleImageDrop(e, el));
            }
        });
    }

    disableEditing() {
        const editableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, img, li, td, th, label, strong, em, b, i, figcaption, cite, blockquote, code, pre');
        
        editableElements.forEach(el => {
            el.style.cursor = '';
            el.style.outline = '';
            el.style.backgroundColor = '';
            el.contentEditable = 'false';
            el.removeEventListener('mouseenter', this.highlightElement);
            el.removeEventListener('mouseleave', this.unhighlightElement);
        });
        
        this.removeFloatingMenu();
        document.getElementById('inline-save-btn')?.remove();
        document.getElementById('inline-cancel-btn')?.remove();
        document.getElementById('inline-color-toolbar')?.remove();
        
        this.selectedElement = null;
    }

    highlightElement(e) {
        if (e.target.closest('#visual-editor-toolbar') || e.target.closest('#toggle-edit-mode')) return;
        e.target.style.outline = '3px dashed #8b5cf6';
        e.target.style.outlineOffset = '4px';
    }

    unhighlightElement(e) {
        if (e.target !== visualEditor.selectedElement) {
            e.target.style.outline = '';
        }
    }

    selectElement(e, element) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.selectedElement === element) return;
        
        if (this.selectedElement) {
            this.selectedElement.style.outline = '';
            this.selectedElement.style.backgroundColor = '';
            this.selectedElement.contentEditable = 'false';
        }
        
        document.getElementById('inline-save-btn')?.remove();
        document.getElementById('inline-cancel-btn')?.remove();
        document.getElementById('inline-color-toolbar')?.remove();
        document.getElementById('select-options-editor')?.remove();
        
        this.selectedElement = element;
        element.style.outline = '3px solid #8b5cf6';
        element.style.outlineOffset = '4px';
        
        this.showElementInfo(element);
        
        const isImage = element.tagName === 'IMG';
        const isSelect = element.tagName === 'SELECT';
        const hasText = element.textContent && element.textContent.trim().length > 0;
        
        if (isSelect) {
            setTimeout(() => {
                this.editSelectOptions(element);
            }, 100);
        } else if (isImage) {
            setTimeout(() => {
                this.showImageUploader();
            }, 100);
        } else if (hasText) {
            setTimeout(() => {
                this.editTextWithColorPalette();
            }, 100);
        }
    }

    disableEditing() {
        const editableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, img, li, td, th, label, strong, em, b, i, figcaption, cite, blockquote, code, pre');
        
        editableElements.forEach(el => {
            el.style.cursor = '';
            el.style.outline = '';
            el.style.backgroundColor = '';
            el.contentEditable = 'false';
            el.removeEventListener('mouseenter', this.highlightElement);
            el.removeEventListener('mouseleave', this.unhighlightElement);
        });
        
        document.getElementById('inline-save-btn')?.remove();
        document.getElementById('inline-cancel-btn')?.remove();
        document.getElementById('inline-color-toolbar')?.remove();
        
        this.selectedElement = null;
    }

    highlightElement(e) {
        if (e.target.closest('#visual-editor-toolbar') || e.target.closest('#toggle-edit-mode')) return;
        e.target.style.outline = '3px dashed #8b5cf6';
        e.target.style.outlineOffset = '4px';
    }

    unhighlightElement(e) {
        if (e.target !== visualEditor.selectedElement) {
            e.target.style.outline = '';
        }
    }

    selectElement(e, element) {
        e.preventDefault();
        e.stopPropagation();
    
    if (this.selectedElement === element) return;
    
    if (this.selectedElement) {
        this.selectedElement.style.outline = '';
        this.selectedElement.style.backgroundColor = '';
        this.selectedElement.contentEditable = 'false';
    }
    
    document.getElementById('inline-save-btn')?.remove();
    document.getElementById('inline-cancel-btn')?.remove();
    document.getElementById('inline-color-toolbar')?.remove();
    document.getElementById('select-options-editor')?.remove();
    
    this.selectedElement = element;
    element.style.outline = '3px solid #8b5cf6';
    element.style.outlineOffset = '4px';
    
    this.showElementInfo(element);
    
    const isImage = element.tagName === 'IMG';
    const isSelect = element.tagName === 'SELECT';
    const hasText = element.textContent && element.textContent.trim().length > 0;
    
    if (isSelect) {
        setTimeout(() => {
            this.editSelectOptions(element);
        }, 100);
    } else if (isImage) {
        setTimeout(() => {
            this.showImageUploader();
        }, 100);
    } else if (hasText) {
        setTimeout(() => {
            this.editTextWithColorPalette();
        }, 100);
    }
}

editSelectOptions(selectElement) {
    document.getElementById('inline-color-toolbar')?.remove();
    
    const rect = selectElement.getBoundingClientRect();
    
    const editor = document.createElement('div');
    editor.id = 'select-options-editor';
    editor.className = 'bg-white rounded-xl shadow-2xl p-4 border-2 border-purple-200';
    editor.style.cssText = `
        position: fixed;
        z-index: 99999;
        left: ${rect.left}px;
        top: ${rect.bottom + 10}px;
        min-width: 300px;
        max-height: 400px;
        overflow-y: auto;
    `;
    
    const title = document.createElement('div');
    title.className = 'text-sm font-bold text-slate-700 mb-3 flex items-center gap-2';
    title.innerHTML = '📋 Editar Opciones del Combo';
    editor.appendChild(title);
    
    const optionsList = document.createElement('div');
    optionsList.id = 'options-list';
    optionsList.className = 'space-y-2 mb-3';
    
    // Mostrar opciones actuales
    Array.from(selectElement.options).forEach((option, index) => {
        const optionRow = this.createOptionRow(option.value, option.text, index, selectElement);
        optionsList.appendChild(optionRow);
    });
    
    editor.appendChild(optionsList);
    
    // Botón para agregar nueva opción
    const addBtn = document.createElement('button');
    addBtn.className = 'w-full px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:scale-105 transition font-semibold text-sm mb-2';
    addBtn.innerHTML = '➕ Agregar Opción';
    addBtn.onclick = () => this.addNewOption(selectElement, optionsList);
    editor.appendChild(addBtn);
    
    // Botones de acción
    const actionsRow = document.createElement('div');
    actionsRow.className = 'flex gap-2';
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition font-semibold text-sm';
    saveBtn.innerHTML = '✅ Guardar';
    saveBtn.onclick = () => {
        // Guardar las opciones del SELECT
        const options = Array.from(selectElement.options).map(opt => ({
            value: opt.value,
            text: opt.text
        }));
        this.trackChange(selectElement, 'options', options);
        document.getElementById('select-options-editor')?.remove();
        this.showNotification('✅ Opciones actualizadas', 'success');
    };
    actionsRow.appendChild(saveBtn);
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold text-sm';
    cancelBtn.innerHTML = '✖️ Cerrar';
    cancelBtn.onclick = () => document.getElementById('select-options-editor')?.remove();
    actionsRow.appendChild(cancelBtn);
    
    editor.appendChild(actionsRow);
    document.body.appendChild(editor);
}

    editSelectOptions(selectElement) {
        document.getElementById('inline-color-toolbar')?.remove();
        
        const rect = selectElement.getBoundingClientRect();
        
        const editor = document.createElement('div');
        editor.id = 'select-options-editor';
        editor.className = 'bg-white rounded-xl shadow-2xl p-4 border-2 border-purple-200';
        editor.style.cssText = `
            position: fixed;
            z-index: 99999;
            left: ${rect.left}px;
            top: ${rect.bottom + 10}px;
            min-width: 300px;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        const title = document.createElement('div');
        title.className = 'text-sm font-bold text-slate-700 mb-3 flex items-center gap-2';
        title.innerHTML = '📋 Editar Opciones del Combo';
        editor.appendChild(title);
        
        const optionsList = document.createElement('div');
        optionsList.id = 'options-list';
        optionsList.className = 'space-y-2 mb-3';
        
        // Mostrar opciones actuales
        Array.from(selectElement.options).forEach((option, index) => {
            const optionRow = this.createOptionRow(option.value, option.text, index, selectElement);
            optionsList.appendChild(optionRow);
        });
        
        editor.appendChild(optionsList);
        
        // Botón para agregar nueva opción
        const addBtn = document.createElement('button');
        addBtn.className = 'w-full px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:scale-105 transition font-semibold text-sm mb-2';
        addBtn.innerHTML = '➕ Agregar Opción';
        addBtn.onclick = () => this.addNewOption(selectElement, optionsList);
        editor.appendChild(addBtn);
        
        // Botones de acción
        const actionsRow = document.createElement('div');
        actionsRow.className = 'flex gap-2';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition font-semibold text-sm';
        saveBtn.innerHTML = '✅ Guardar';
        saveBtn.onclick = () => {
            // Guardar las opciones del SELECT
            const options = Array.from(selectElement.options).map(opt => ({
                value: opt.value,
                text: opt.text
            }));
            this.trackChange(selectElement, 'options', options);
            document.getElementById('select-options-editor')?.remove();
            this.showNotification('✅ Opciones actualizadas', 'success');
        };
        actionsRow.appendChild(saveBtn);
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold text-sm';
        cancelBtn.innerHTML = '✖️ Cerrar';
        cancelBtn.onclick = () => document.getElementById('select-options-editor')?.remove();
        actionsRow.appendChild(cancelBtn);
        
        editor.appendChild(actionsRow);
        document.body.appendChild(editor);
    }
    
    createOptionRow(value, text, index, selectElement) {
        const row = document.createElement('div');
        row.className = 'flex items-center gap-2 p-2 bg-slate-50 rounded-lg';
        
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = text;
        textInput.className = 'flex-1 px-2 py-1 border border-slate-300 rounded text-sm focus:border-purple-500 focus:outline-none';
        textInput.placeholder = 'Texto de la opción';
        textInput.onchange = () => {
            selectElement.options[index].text = textInput.value;
            selectElement.options[index].value = valueInput.value || textInput.value;
        };
        
        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.value = value;
        valueInput.className = 'w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:border-purple-500 focus:outline-none';
        valueInput.placeholder = 'Valor';
        valueInput.onchange = () => {
            selectElement.options[index].value = valueInput.value;
        };
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition text-sm';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => {
            selectElement.remove(index);
            row.remove();
            this.showNotification('🗑️ Opción eliminada', 'info');
        };
        
        row.appendChild(textInput);
        row.appendChild(valueInput);
        row.appendChild(deleteBtn);
        
        return row;
    }
    
    addNewOption(selectElement, optionsList) {
        const newOption = document.createElement('option');
        newOption.value = 'nuevo';
        newOption.text = 'Nueva opción';
        selectElement.add(newOption);
        
        const newRow = this.createOptionRow('nuevo', 'Nueva opción', selectElement.options.length - 1, selectElement);
        optionsList.appendChild(newRow);
        
        // Enfocar el input de texto
        newRow.querySelector('input').focus();
        newRow.querySelector('input').select();
    }
    
    editTextWithColorPalette() {
        if (!this.selectedElement) return;
        
        const element = this.selectedElement;
        const originalText = element.textContent;
        
        element.contentEditable = 'true';
        element.focus();
        
        element.style.outline = '3px solid #10b981';
        element.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        const rect = element.getBoundingClientRect();
        
        // Crear barra de herramientas flotante con colores
        const toolbar = document.createElement('div');
        toolbar.id = 'inline-color-toolbar';
        toolbar.className = 'bg-white rounded-xl shadow-2xl p-3 border-2 border-purple-200';
        toolbar.style.cssText = `
            position: fixed;
            z-index: 99999;
            left: ${rect.left}px;
            top: ${rect.bottom + 10}px;
            animation: scaleIn 0.2s ease;
        `;
        
        document.body.appendChild(toolbar);
        
        // Crear botones de colores dinámicamente
        const colorsRow = document.createElement('div');
        colorsRow.className = 'flex items-center gap-2 mb-2';
        
        const label = document.createElement('span');
        label.className = 'text-xs font-bold text-slate-600';
        label.textContent = 'Color:';
        colorsRow.appendChild(label);
        
        const colorsContainer = document.createElement('div');
        colorsContainer.className = 'flex gap-1';
        
        const quickColors = ['#000000', '#ffffff', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f43f5e', '#fbbf24', '#84cc16'];
        
        quickColors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'w-6 h-6 rounded border-2 border-slate-300 hover:scale-125 transition';
            btn.style.backgroundColor = color;
            btn.title = color;
            btn.onclick = () => this.applyQuickTextColor(color);
            colorsContainer.appendChild(btn);
        });
        
        colorsRow.appendChild(colorsContainer);
        
        // Input para color personalizado
        const customColor = document.createElement('input');
        customColor.type = 'color';
        customColor.className = 'w-8 h-6 rounded cursor-pointer border-2 border-slate-300';
        customColor.value = '#000000';
        customColor.onchange = (e) => this.applyQuickTextColor(e.target.value);
        colorsRow.appendChild(customColor);
        
        toolbar.appendChild(colorsRow);
        
        // Botones de acción
        const actionsRow = document.createElement('div');
        actionsRow.className = 'flex gap-2';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:scale-105 transition font-semibold text-sm';
        saveBtn.innerHTML = '✅ Guardar';
        saveBtn.onclick = () => this.saveTextEdit();
        actionsRow.appendChild(saveBtn);
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold text-sm';
        cancelBtn.innerHTML = '✖️ Cancelar';
        cancelBtn.onclick = () => this.cancelTextEdit();
        actionsRow.appendChild(cancelBtn);
        
        toolbar.appendChild(actionsRow);
        
        this.originalText = originalText;
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.saveTextEdit();
            }
            if (e.key === 'Escape') {
                this.cancelTextEdit();
            }
        });
    }
    
    applyQuickTextColor(color) {
        if (this.selectedElement) {
            this.selectedElement.style.color = color;
            // Guardar el cambio de color
            this.trackChange(this.selectedElement, 'color', color);
        }
    }
    
    saveTextEdit() {
        console.log('🔵 saveTextEdit() llamado');
        console.log('🔵 selectedElement:', this.selectedElement);
        
        if (!this.selectedElement) {
            console.log('❌ No hay elemento seleccionado');
            return;
        }
        
        console.log('🔵 Texto a guardar:', this.selectedElement.textContent);
        
        // Guardar el cambio de texto
        this.trackChange(this.selectedElement, 'text', this.selectedElement.textContent);
        
        this.selectedElement.contentEditable = 'false';
        this.selectedElement.style.outline = '3px solid #8b5cf6';
        this.selectedElement.style.backgroundColor = '';
        
        document.getElementById('inline-color-toolbar')?.remove();
        
        this.showNotification('✅ Cambios guardados', 'success');
    }
    
    cancelTextEdit() {
        if (!this.selectedElement) return;
        
        this.selectedElement.contentEditable = 'false';
        this.selectedElement.textContent = this.originalText;
        this.selectedElement.style.outline = '3px solid #8b5cf6';
        this.selectedElement.style.backgroundColor = '';
        
        document.getElementById('inline-color-toolbar')?.remove();
    }

    showFloatingMenu(element) {
        this.removeFloatingMenu();
        
        const rect = element.getBoundingClientRect();
        const isImage = element.tagName === 'IMG';
        
        const menu = document.createElement('div');
        menu.id = 'floating-edit-menu';
        // Cambiado fixed a absolute
        menu.className = 'absolute z-[80] bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-2xl flex gap-2 p-2 animate-scale-in';
        
        // Calcular posición
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        
        let topPos = rect.top + scrollY - 60;
        // Si está muy arriba (cerca del borde superior), mostrarlo abajo del elemento
        if (rect.top < 70) {
            topPos = rect.bottom + scrollY + 10;
        }
        
        menu.style.left = `${rect.left + scrollX}px`;
        menu.style.top = `${topPos}px`;
        menu.style.transition = 'all 0.3s ease';
        
        let buttons = '';
        
        if (isImage) {
            buttons = `
                <div class="text-white text-xs font-semibold px-2 mb-2">📸 Editar Imagen</div>
                <div class="flex gap-2 mb-2">
                    <label class="flex-1 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer border border-white/30 hover:border-white/50">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        Subir Foto
                    </label>
                </div>
            `;
        } else {
            buttons = `
                <button onclick="visualEditor.showColorPickerInline()" class="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition flex items-center gap-2 text-sm font-semibold" title="Cambiar color">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                    </svg>
                    🎨 Color
                </button>
            `;
        }
        
        menu.innerHTML = buttons;
        document.body.appendChild(menu);
        
        window.addEventListener('scroll', () => this.updateFloatingMenuPosition(), { once: true });
    }

    updateFloatingMenuPosition() {
        const menu = document.getElementById('floating-edit-menu');
        if (!menu || !this.selectedElement) return;
        
        const rect = this.selectedElement.getBoundingClientRect();
        menu.style.left = `${rect.left + window.scrollX}px`;
        menu.style.top = `${rect.top + window.scrollY - 60}px`;
    }

    removeFloatingMenu() {
        const existingMenu = document.getElementById('floating-edit-menu');
        if (existingMenu) {
            existingMenu.style.opacity = '0';
            existingMenu.style.transform = 'scale(0.8)';
            setTimeout(() => existingMenu.remove(), 150);
        }
    }
    
    handleImageDrop(e, imgElement) {
        e.preventDefault();
        e.stopPropagation();
        
        imgElement.style.outline = '';
        imgElement.style.opacity = '1';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imgElement.src = event.target.result;
                // Guardar el cambio de imagen
                this.trackChange(imgElement, 'src', event.target.result);
                this.showNotification('🖼️ Imagen actualizada', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            // Intentar obtener URL de texto arrastrado
            const url = e.dataTransfer.getData('text/plain');
            if (url && (url.startsWith('http') || url.startsWith('data:'))) {
                imgElement.src = url;
                // Guardar el cambio de imagen
                this.trackChange(imgElement, 'src', url);
                this.showNotification('🖼️ Imagen actualizada', 'success');
            }
        }
    }

    handleFileUpload(input, imgElement) {
        const file = input.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imgElement.src = e.target.result;
                // Guardar el cambio de imagen
                this.trackChange(imgElement, 'src', e.target.result);
                this.showNotification('🖼️ Imagen actualizada', 'success');
                this.removeFloatingMenu();
            };
            reader.readAsDataURL(file);
        }
    }

    editTextInline() {
        if (!this.selectedElement) return;
        
        const element = this.selectedElement;
        const originalText = element.textContent;
        
        element.contentEditable = 'true';
        element.focus();
        
        element.style.outline = '3px solid #10b981';
        element.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        this.removeFloatingMenu();
        
        const saveButton = document.createElement('button');
        saveButton.id = 'inline-save-btn';
        saveButton.className = 'fixed z-[80] px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-xl hover:scale-105 transition font-semibold text-sm animate-scale-in';
        const rect = element.getBoundingClientRect();
        saveButton.style.left = `${rect.left + window.scrollX}px`;
        saveButton.style.top = `${rect.bottom + window.scrollY + 10}px`;
        saveButton.innerHTML = '✅ Guardar';
        saveButton.onclick = () => this.saveInlineEdit(element, originalText);
        
        document.body.appendChild(saveButton);
        
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'inline-cancel-btn';
        cancelBtn.className = 'fixed z-[80] px-4 py-2 bg-slate-200 text-slate-700 rounded-lg shadow-xl hover:bg-slate-300 transition font-semibold text-sm animate-scale-in';
        cancelBtn.style.left = `${rect.left + window.scrollX + 100}px`;
        cancelBtn.style.top = `${rect.bottom + window.scrollY + 10}px`;
        cancelBtn.innerHTML = '✖️ Cancelar';
        cancelBtn.onclick = () => this.cancelInlineEdit(element, originalText);
        
        document.body.appendChild(cancelBtn);
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.saveInlineEdit(element, originalText);
            }
            if (e.key === 'Escape') {
                this.cancelInlineEdit(element, originalText);
            }
        });
    }

    saveInlineEdit(element, originalText) {
        element.contentEditable = 'false';
        element.style.outline = '3px solid #8b5cf6';
        element.style.backgroundColor = '';
        
        document.getElementById('inline-save-btn')?.remove();
        document.getElementById('inline-cancel-btn')?.remove();
        
        this.showNotification('✅ Texto actualizado', 'success');
        
        setTimeout(() => {
            this.showFloatingMenu(element);
        }, 200);
    }

    cancelInlineEdit(element, originalText) {
        element.contentEditable = 'false';
        element.textContent = originalText;
        element.style.outline = '3px solid #8b5cf6';
        element.style.backgroundColor = '';
        
        document.getElementById('inline-save-btn')?.remove();
        document.getElementById('inline-cancel-btn')?.remove();
        
        setTimeout(() => {
            this.showFloatingMenu(element);
        }, 200);
    }

    showColorPickerInline() {
        this.showColorPicker();
    }

    showImageUploaderInline() {
        this.showImageUploader();
    }

    updateToolbarButtons() {
        const editBtn = document.getElementById('edit-text-btn');
        const colorBtn = document.getElementById('change-color-btn');
        const imageBtn = document.getElementById('change-image-btn');
        
        if (!this.selectedElement) {
            editBtn.disabled = true;
            colorBtn.disabled = true;
            imageBtn.disabled = true;
            return;
        }
        
        const isText = this.selectedElement.tagName !== 'IMG';
        const isImage = this.selectedElement.tagName === 'IMG';
        
        editBtn.disabled = !isText;
        colorBtn.disabled = !isText;
        imageBtn.disabled = !isImage;
    }

    showElementInfo(element) {
        const info = document.createElement('div');
        info.className = 'fixed top-32 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm animate-slide-in';
        info.textContent = `✨ ${element.tagName} seleccionado`;
        document.body.appendChild(info);
        setTimeout(() => info.remove(), 2000);
    }

    editText() {
        if (!this.selectedElement) return;
        
        const currentText = this.selectedElement.textContent;
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl animate-scale-in">
                <h3 class="text-xl font-bold text-slate-900 mb-4">✏️ Editar Texto</h3>
                <textarea id="text-editor-input" class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-600 focus:outline-none resize-none" rows="4">${currentText}</textarea>
                <div class="flex gap-3 mt-4">
                    <button onclick="visualEditor.applyTextEdit()" class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:scale-105 transition">
                        ✅ Aplicar
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="px-4 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition">
                        Cancelar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('text-editor-input').focus();
    }

    applyTextEdit() {
        const newText = document.getElementById('text-editor-input').value;
        if (this.selectedElement) {
            this.selectedElement.textContent = newText;
            this.trackChange(this.selectedElement, 'text', newText);
            this.showNotification('✅ Texto actualizado', 'success');
        }
        document.querySelector('.fixed.inset-0.bg-black\\/50').remove();
    }

    createColorPicker() {
        const pickerHTML = `
            <div id="color-picker-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] hidden flex items-center justify-center">
                <div class="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl">
                    <h3 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        🎨 Selector de Color Profesional
                    </h3>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div class="bg-slate-50 p-4 rounded-xl">
                                <label class="block text-sm font-bold text-slate-700 mb-3">Vista Previa</label>
                                <div class="flex gap-3 mb-4">
                                    <div class="flex-1">
                                        <div id="color-preview-text" class="h-20 rounded-lg border-2 border-slate-300 flex items-center justify-center font-bold text-lg" style="background: white; color: #000000;">
                                            Texto
                                        </div>
                                        <p class="text-xs text-slate-500 mt-1 text-center">Color de Texto</p>
                                    </div>
                                    <div class="flex-1">
                                        <div id="color-preview-bg" class="h-20 rounded-lg border-2 border-slate-300" style="background: #ffffff;">
                                        </div>
                                        <p class="text-xs text-slate-500 mt-1 text-center">Color de Fondo</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">Color del Texto</label>
                                <div class="flex gap-2">
                                    <input type="color" id="text-color-picker" class="w-16 h-12 rounded-lg cursor-pointer border-2 border-slate-300">
                                    <input type="text" id="text-color-hex" class="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg font-mono text-sm focus:border-purple-600 focus:outline-none" placeholder="#000000" maxlength="7">
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-2">Color de Fondo</label>
                                <div class="flex gap-2">
                                    <input type="color" id="bg-color-picker" class="w-16 h-12 rounded-lg cursor-pointer border-2 border-slate-300">
                                    <input type="text" id="bg-color-hex" class="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg font-mono text-sm focus:border-purple-600 focus:outline-none" placeholder="#ffffff" maxlength="7">
                                </div>
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-3">Colores Populares</label>
                                <div id="popular-colors-grid" class="grid grid-cols-6 gap-2"></div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-3">Gradientes de Grises</label>
                                <div id="gray-colors-grid" class="grid grid-cols-10 gap-1"></div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-3">Paleta Arcoíris</label>
                                <div id="rainbow-colors-grid" class="grid grid-cols-12 gap-1"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 mt-6">
                        <button onclick="visualEditor.applyColorChange()" class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:scale-105 transition shadow-lg">
                            ✅ Aplicar Colores
                        </button>
                        <button onclick="visualEditor.closeColorPicker()" class="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', pickerHTML);
        
        // Generar botones de colores dinámicamente
        this.generateColorButtons();
        
        // Configurar event listeners
        this.setupColorPickerEvents();
    }
    
    setupColorPickerEvents() {
        const textColorPicker = document.getElementById('text-color-picker');
        const bgPicker = document.getElementById('bg-color-picker');
        const textHex = document.getElementById('text-color-hex');
        const bgHex = document.getElementById('bg-color-hex');
        
        if (textColorPicker) {
            textColorPicker.addEventListener('input', (e) => {
                const hex = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(hex)) {
                    textHex.value = hex;
                    this.updateColorPreview();
                }
            });
        }
        
        if (bgPicker) {
            bgPicker.addEventListener('input', (e) => {
                const hex = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(hex)) {
                    bgHex.value = hex;
                    this.updateColorPreview();
                }
            });
        }
        
        if (textHex) {
            textHex.addEventListener('input', (e) => {
                const hex = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(hex)) {
                    document.getElementById('text-color-picker').value = hex;
                    this.updateColorPreview();
                }
            });
        }
        
        if (bgHex) {
            bgHex.addEventListener('input', (e) => {
                const hex = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(hex)) {
                    document.getElementById('bg-color-picker').value = hex;
                    this.updateColorPreview();
                }
            });
        }
    }
    
    generateColorButtons() {
        // Colores populares
        const popularColors = ['#000000', '#ffffff', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#6366f1', '#f43f5e', '#14b8a6', '#f97316', '#84cc16', '#64748b', '#1e293b', '#fbbf24', '#a855f7'];
        const popularGrid = document.getElementById('popular-colors-grid');
        
        popularColors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'w-full h-10 rounded-lg hover:scale-110 transition border-2 border-slate-200 hover:border-purple-500';
            btn.style.backgroundColor = color;
            btn.title = color;
            btn.onclick = () => this.selectPresetColor(color);
            popularGrid.appendChild(btn);
        });
        
        // Grises
        const grayGrid = document.getElementById('gray-colors-grid');
        for (let i = 0; i < 10; i++) {
            const gray = Math.round(255 * (i / 9));
            const hex = '#' + gray.toString(16).padStart(2, '0').repeat(3);
            const btn = document.createElement('button');
            btn.className = 'w-full h-8 rounded hover:scale-110 transition border border-slate-300';
            btn.style.backgroundColor = hex;
            btn.title = hex;
            btn.onclick = () => this.selectPresetColor(hex);
            grayGrid.appendChild(btn);
        }
        
        // Arcoíris
        const rainbowGrid = document.getElementById('rainbow-colors-grid');
        for (let i = 0; i < 12; i++) {
            const hue = Math.round(360 * (i / 12));
            const hex = this.hslToHex(hue, 70, 50);
            const btn = document.createElement('button');
            btn.className = 'w-full h-8 rounded hover:scale-110 transition border border-slate-300';
            btn.style.backgroundColor = hex;
            btn.title = hex;
            btn.onclick = () => this.selectPresetColor(hex);
            rainbowGrid.appendChild(btn);
        }
    }
    
    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }
    
    updateColorPreview() {
        const textColor = document.getElementById('text-color-hex').value || '#000000';
        const bgColor = document.getElementById('bg-color-hex').value || '#ffffff';
        
        document.getElementById('color-preview-text').style.color = textColor;
        document.getElementById('color-preview-text').style.background = bgColor;
        document.getElementById('color-preview-bg').style.background = bgColor;
    }
    
    selectPresetColor(color) {
        document.getElementById('text-color-picker').value = color;
        document.getElementById('text-color-hex').value = color;
        this.updateColorPreview();
    }
    
    closeColorPicker() {
        document.getElementById('color-picker-modal').classList.add('hidden');
    }

    showColorPicker() {
        if (!this.selectedElement) return;
        
        const modal = document.getElementById('color-picker-modal');
        const textPicker = document.getElementById('text-color-picker');
        const bgPicker = document.getElementById('bg-color-picker');
        const textHex = document.getElementById('text-color-hex');
        const bgHex = document.getElementById('bg-color-hex');
        
        const currentColor = window.getComputedStyle(this.selectedElement).color;
        const currentBg = window.getComputedStyle(this.selectedElement).backgroundColor;
        
        const textColor = this.rgbToHex(currentColor);
        const bgColor = this.rgbToHex(currentBg);
        
        textPicker.value = textColor;
        bgPicker.value = bgColor;
        textHex.value = textColor;
        bgHex.value = bgColor;
        
        this.updateColorPreview();
        
        modal.classList.remove('hidden');
    }

    applyColorChange() {
        const textColor = document.getElementById('text-color-hex').value;
        const bgColor = document.getElementById('bg-color-hex').value;
        
        if (this.selectedElement) {
            if (textColor && /^#[0-9A-F]{6}$/i.test(textColor)) {
                this.selectedElement.style.color = textColor;
                this.trackChange(this.selectedElement, 'color', textColor);
            }
            if (bgColor && /^#[0-9A-F]{6}$/i.test(bgColor)) {
                this.selectedElement.style.backgroundColor = bgColor;
                this.trackChange(this.selectedElement, 'backgroundColor', bgColor);
            }
            this.showNotification('🎨 Colores aplicados exitosamente', 'success');
        }
        
        this.closeColorPicker();
    }

    rgbToHex(rgb) {
        const result = rgb.match(/\d+/g);
        if (!result) return '#000000';
        return '#' + result.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }

    createImageUploader() {
        const uploaderHTML = `
            <div id="image-uploader-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] hidden flex items-center justify-center">
                <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                    <h3 class="text-xl font-bold text-slate-900 mb-4">🖼️ Cambiar Imagen</h3>
                    <div class="border-4 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-purple-500 transition cursor-pointer" id="image-drop-zone">
                        <div class="text-5xl mb-3">📸</div>
                        <p class="text-slate-700 font-semibold mb-2">Arrastra una imagen aquí</p>
                        <p class="text-sm text-slate-500">o pega una URL</p>
                    </div>
                    <input type="url" id="image-url-input" placeholder="https://..." class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-600 focus:outline-none mt-4">
                    <div class="flex gap-3 mt-4">
                        <button onclick="visualEditor.applyImageChange()" class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:scale-105 transition">
                            ✅ Aplicar
                        </button>
                        <button onclick="document.getElementById('image-uploader-modal').classList.add('hidden')" class="px-4 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', uploaderHTML);
        
        const dropZone = document.getElementById('image-drop-zone');
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-purple-500', 'bg-purple-50');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-purple-500', 'bg-purple-50');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-purple-500', 'bg-purple-50');
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('image-url-input').value = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    showImageUploader() {
        if (!this.selectedElement || this.selectedElement.tagName !== 'IMG') return;
        
        const modal = document.getElementById('image-uploader-modal');
        document.getElementById('image-url-input').value = this.selectedElement.src;
        modal.classList.remove('hidden');
    }

    applyImageChange() {
        const newUrl = document.getElementById('image-url-input').value;
        
        if (this.selectedElement && this.selectedElement.tagName === 'IMG') {
            this.selectedElement.src = newUrl;
            this.trackChange(this.selectedElement, 'src', newUrl);
            this.showNotification('🖼️ Imagen actualizada', 'success');
        }
        
        document.getElementById('image-uploader-modal').classList.add('hidden');
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!this.editMode) return;
            
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveChanges();
            }
            
            if (e.key === 'Escape') {
                if (this.selectedElement) {
                    this.selectedElement.style.outline = '';
                    this.selectedElement = null;
                    this.updateToolbarButtons();
                }
            }
        });
    }

    saveChanges() {
        console.log('💾 Guardando cambios...');
        this.downloadAndSaveChanges();
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'from-emerald-500 to-teal-500',
            error: 'from-red-500 to-pink-500',
            info: 'from-blue-500 to-purple-500'
        };
        
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl z-[60] animate-slide-in font-semibold`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

let visualEditor;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        visualEditor = new VisualEditor();
    }, 1500);
});
