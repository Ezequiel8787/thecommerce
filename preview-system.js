class LivePreviewSystem {
    constructor() {
        this.previewWindow = null;
        this.setupPreviewPanel();
        this.setupLiveUpdates();
    }

    setupPreviewPanel() {
        const previewHTML = `
            <div id="live-preview-panel" class="fixed right-0 top-0 h-full w-1/2 bg-white shadow-2xl transform translate-x-full transition-transform duration-500 z-40 overflow-hidden">
                <div class="h-full flex flex-col">
                    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">👁️</span>
                            <div>
                                <h3 class="font-bold text-lg">Vista Previa en Vivo</h3>
                                <p class="text-xs text-purple-100">Los cambios se ven aquí al instante ✨</p>
                            </div>
                        </div>
                        <button id="close-preview" class="hover:bg-white/20 p-2 rounded-lg transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="flex-1 overflow-auto bg-slate-50 p-4">
                        <div id="preview-content" class="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div class="text-center py-20 text-slate-400">
                                <span class="text-6xl mb-4 block">🎨</span>
                                <p class="text-lg font-semibold">Empieza a editar para ver la magia</p>
                                <p class="text-sm mt-2">Los cambios aparecerán aquí en tiempo real</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 text-center text-sm">
                        💡 Tip: Edita cualquier campo y mira cómo cambia al instante
                    </div>
                </div>
            </div>
            
            <button id="toggle-preview" class="fixed right-4 bottom-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center gap-2 animate-bounce-slow">
                <span class="text-2xl">👁️</span>
                <span class="font-bold">Ver Preview</span>
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', previewHTML);
        
        document.getElementById('toggle-preview').addEventListener('click', () => this.togglePreview());
        document.getElementById('close-preview').addEventListener('click', () => this.togglePreview());
    }

    togglePreview() {
        const panel = document.getElementById('live-preview-panel');
        const button = document.getElementById('toggle-preview');
        
        if (panel.classList.contains('translate-x-full')) {
            panel.classList.remove('translate-x-full');
            button.innerHTML = '<span class="text-2xl">✖️</span><span class="font-bold">Cerrar</span>';
            button.classList.remove('animate-bounce-slow');
            this.updatePreview();
        } else {
            panel.classList.add('translate-x-full');
            button.innerHTML = '<span class="text-2xl">👁️</span><span class="font-bold">Ver Preview</span>';
            button.classList.add('animate-bounce-slow');
        }
    }

    setupLiveUpdates() {
        const inputs = [
            'hero-badge', 'hero-titulo', 'hero-titulo-destacado', 'hero-subtitulo',
            'hero-experiencia', 'hero-clientes', 'hero-oficinas',
            'sitio-nombre', 'sitio-email', 'sitio-telefono1'
        ];
        
        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.updatePreview();
                    this.showSparkles(element);
                });
            }
        });
    }

    showSparkles(element) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.left = element.offsetLeft + element.offsetWidth + 'px';
        sparkle.style.top = element.offsetTop + 'px';
        sparkle.style.fontSize = '24px';
        sparkle.style.animation = 'sparkle-float 1s ease-out';
        sparkle.style.pointerEvents = 'none';
        
        element.parentElement.style.position = 'relative';
        element.parentElement.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }

    updatePreview() {
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;
        
        const currentTab = document.querySelector('.tab-content.active');
        const tabId = currentTab ? currentTab.id : 'hero';
        
        if (tabId === 'hero') {
            this.previewHero(previewContent);
        } else if (tabId === 'servicios') {
            this.previewServicios(previewContent);
        } else if (tabId === 'info-general') {
            this.previewInfoGeneral(previewContent);
        }
    }

    previewHero(container) {
        const badge = document.getElementById('hero-badge')?.value || '🌍 Badge';
        const titulo = document.getElementById('hero-titulo')?.value || 'Título Principal';
        const destacado = document.getElementById('hero-titulo-destacado')?.value || 'Destacado';
        const subtitulo = document.getElementById('hero-subtitulo')?.value || 'Subtítulo descriptivo';
        const experiencia = document.getElementById('hero-experiencia')?.value || '15+';
        const clientes = document.getElementById('hero-clientes')?.value || '500+';
        const oficinas = document.getElementById('hero-oficinas')?.value || '3';
        const imagen = document.getElementById('hero-imagen')?.value || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80';
        
        container.innerHTML = `
            <div class="relative min-h-[400px] flex items-center overflow-hidden">
                <img src="${imagen}" class="absolute inset-0 w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80'">
                <div class="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/80 to-slate-900/90"></div>
                <div class="relative z-10 p-8 max-w-2xl">
                    <div class="inline-block px-3 py-1 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full mb-4">
                        <span class="text-blue-300 text-sm font-semibold">${badge}</span>
                    </div>
                    <h2 class="text-4xl font-black text-white mb-4 leading-tight">
                        ${titulo} <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">${destacado}</span>
                    </h2>
                    <p class="text-lg text-slate-300 mb-6">${subtitulo}</p>
                    <div class="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                        <div>
                            <div class="text-2xl font-bold text-white">${experiencia}</div>
                            <div class="text-xs text-slate-400">Años de Experiencia</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-white">${clientes}</div>
                            <div class="text-xs text-slate-400">Clientes Satisfechos</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-white">${oficinas}</div>
                            <div class="text-xs text-slate-400">Oficinas Globales</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-r from-emerald-400 to-teal-400 text-white p-3 text-center animate-pulse">
                ✨ ¡Así se verá en tu sitio web! ✨
            </div>
        `;
    }

    previewServicios(container) {
        const servicios = [];
        document.querySelectorAll('[data-servicio]').forEach((input, index) => {
            if (input.getAttribute('data-field') === 'nombre') {
                const nombre = input.value;
                const imagenInput = document.getElementById(`servicio-img-${input.getAttribute('data-servicio')}`);
                const imagen = imagenInput ? imagenInput.value : '';
                if (nombre && imagen) {
                    servicios.push({ nombre, imagen });
                }
            }
        });
        
        if (servicios.length === 0) {
            container.innerHTML = '<div class="p-8 text-center text-slate-400">Agrega servicios para ver el preview</div>';
            return;
        }
        
        const serviciosHTML = servicios.map(s => `
            <div class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all">
                <div class="aspect-[3/4] overflow-hidden">
                    <img src="${s.imagen}" alt="${s.nombre}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src='https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80'">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 class="text-base font-bold">${s.nombre}</h3>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = `
            <div class="p-6">
                <h3 class="text-2xl font-bold text-slate-900 mb-4 text-center">Tus Servicios</h3>
                <div class="grid grid-cols-2 gap-3">
                    ${serviciosHTML}
                </div>
            </div>
            <div class="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-3 text-center animate-pulse">
                🎨 ¡Así se verán en la página! 🎨
            </div>
        `;
    }

    previewInfoGeneral(container) {
        const nombre = document.getElementById('sitio-nombre')?.value || 'Nombre Empresa';
        const email = document.getElementById('sitio-email')?.value || 'email@empresa.com';
        const tel1 = document.getElementById('sitio-telefono1')?.value || '(123) 456-7890';
        
        container.innerHTML = `
            <div class="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-2xl font-bold text-slate-900 mb-6">Información de Contacto</h3>
                    <div class="space-y-4">
                        <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <span class="text-2xl">🏢</span>
                            <div>
                                <p class="text-xs text-slate-500">Empresa</p>
                                <p class="font-bold text-slate-900">${nombre}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                            <span class="text-2xl">📧</span>
                            <div>
                                <p class="text-xs text-slate-500">Email</p>
                                <p class="font-bold text-slate-900">${email}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                            <span class="text-2xl">📞</span>
                            <div>
                                <p class="text-xs text-slate-500">Teléfono</p>
                                <p class="font-bold text-slate-900">${tel1}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gradient-to-r from-blue-400 to-purple-400 text-white p-3 text-center animate-pulse">
                📱 ¡Así aparecerá en el footer! 📱
            </div>
        `;
    }
}

let livePreview;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        livePreview = new LivePreviewSystem();
    }, 1000);
});
