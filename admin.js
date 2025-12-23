let contentData = {};
const DEFAULT_PASSWORD = 'admin123';

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
    if (typeof initializeImageUploaders === 'function') {
        setTimeout(initializeImageUploaders, 500);
    }
});

function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuth');
    if (isAuthenticated === 'true') {
        showAdminPanel();
        loadContent();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

function showAdminPanel() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
}

function setupEventListeners() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('save-btn').addEventListener('click', saveContent);
    document.getElementById('change-password-btn').addEventListener('click', changePassword);
    document.getElementById('add-servicio-btn').addEventListener('click', addServicio);
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password-input').value;
    const savedPassword = localStorage.getItem('adminPassword') || DEFAULT_PASSWORD;
    
    if (password === savedPassword) {
        sessionStorage.setItem('adminAuth', 'true');
        showAdminPanel();
        loadContent();
        document.getElementById('login-error').classList.add('hidden');
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
}

function handleLogout() {
    sessionStorage.removeItem('adminAuth');
    showLoginScreen();
    document.getElementById('password-input').value = '';
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

async function loadContent() {
    try {
        const response = await fetch('content.json');
        contentData = await response.json();
        populateForm();
    } catch (error) {
        alert('Error al cargar el contenido: ' + error.message);
    }
}

function populateForm() {
    document.getElementById('sitio-nombre').value = contentData.sitio.nombre;
    document.getElementById('sitio-email').value = contentData.sitio.email;
    document.getElementById('sitio-telefono1').value = contentData.sitio.telefono1;
    document.getElementById('sitio-telefono2').value = contentData.sitio.telefono2;
    document.getElementById('sitio-ubicaciones').value = contentData.sitio.ubicaciones;
    
    document.getElementById('hero-badge').value = contentData.hero.badge;
    document.getElementById('hero-titulo').value = contentData.hero.titulo;
    document.getElementById('hero-titulo-destacado').value = contentData.hero.tituloDestacado;
    document.getElementById('hero-subtitulo').value = contentData.hero.subtitulo;
    document.getElementById('hero-imagen').value = contentData.hero.imagenFondo;
    document.getElementById('hero-experiencia').value = contentData.hero.estadisticas.experiencia;
    document.getElementById('hero-clientes').value = contentData.hero.estadisticas.clientes;
    document.getElementById('hero-oficinas').value = contentData.hero.estadisticas.oficinas;
    
    populateServicios();
    populateCasos();
    populateTestimonios();
    
    document.getElementById('nosotros-p1').value = contentData.nosotros.historia.parrafo1;
    document.getElementById('nosotros-p2').value = contentData.nosotros.historia.parrafo2;
    document.getElementById('nosotros-p3').value = contentData.nosotros.historia.parrafo3;
    document.getElementById('nosotros-mision').value = contentData.nosotros.mision;
    document.getElementById('nosotros-vision').value = contentData.nosotros.vision;
}

function populateServicios() {
    const container = document.getElementById('servicios-list');
    container.innerHTML = '';
    
    if (contentData.servicios.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-slate-500">No hay servicios. Haz clic en "Agregar Servicio" para crear uno.</div>';
        return;
    }
    
    contentData.servicios.forEach((servicio, index) => {
        const div = document.createElement('div');
        div.className = 'bg-white border-2 border-slate-200 p-6 rounded-xl hover:shadow-lg transition-all relative';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="font-bold text-slate-900 text-lg">Servicio ${index + 1}</h3>
                <button onclick="removeServicio(${index})" class="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all" title="Eliminar servicio">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Nombre del Servicio</label>
                    <input type="text" data-servicio="${index}" data-field="nombre" value="${servicio.nombre}" class="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none" placeholder="Ej: Envíos Aéreos">
                </div>
                <div class="image-upload-zone">
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Imagen del Servicio</label>
                    <input type="url" id="servicio-img-${index}" data-servicio="${index}" data-field="imagen" value="${servicio.imagen}" class="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none" placeholder="Pega URL o arrastra imagen">
                    <div id="servicio-preview-${index}" class="image-preview"></div>
                </div>
            </div>
        `;
        container.appendChild(div);
        
        const uploader = new ImageUploader(`servicio-img-${index}`, `servicio-preview-${index}`);
        uploader.updatePreview();
    });
}

function addServicio() {
    const newServicio = {
        id: `servicio-${Date.now()}`,
        nombre: 'Nuevo Servicio',
        imagen: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80'
    };
    
    contentData.servicios.push(newServicio);
    populateServicios();
    
    const container = document.getElementById('servicios-list');
    container.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    showNotification('✅ Servicio agregado. No olvides guardar los cambios.', 'success');
}

function removeServicio(index) {
    if (contentData.servicios.length <= 1) {
        showNotification('⚠️ Debes tener al menos un servicio.', 'warning');
        return;
    }
    
    if (confirm(`¿Estás segura de eliminar "${contentData.servicios[index].nombre}"?`)) {
        contentData.servicios.splice(index, 1);
        populateServicios();
        showNotification('✅ Servicio eliminado. No olvides guardar los cambios.', 'success');
    }
}

function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 ${colors[type]} border-2 px-6 py-4 rounded-lg shadow-xl z-50 animate-slide-in`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function populateCasos() {
    const container = document.getElementById('casos-list');
    container.innerHTML = '';
    
    contentData.casosExito.forEach((caso, index) => {
        const div = document.createElement('div');
        div.className = 'bg-slate-50 p-4 rounded-lg';
        div.innerHTML = `
            <h3 class="font-bold text-slate-900 mb-3">Caso de Éxito ${index + 1}</h3>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Iniciales</label>
                    <input type="text" data-caso="${index}" data-field="iniciales" value="${caso.iniciales}" class="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre de Empresa</label>
                    <input type="text" data-caso="${index}" data-field="empresa" value="${caso.empresa}" class="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
                    <textarea data-caso="${index}" data-field="descripcion" rows="2" class="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none">${caso.descripcion}</textarea>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Badge (ej: -35% Costos)</label>
                    <input type="text" data-caso="${index}" data-field="badge" value="${caso.badge}" class="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Ahorro/Beneficio</label>
                    <input type="text" data-caso="${index}" data-field="ahorro" value="${caso.ahorro}" class="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none">
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function populateTestimonios() {
    const container = document.getElementById('testimonios-list');
    container.innerHTML = '';
    
    contentData.testimonios.forEach((testimonio, index) => {
        const div = document.createElement('div');
        div.className = 'bg-slate-50 p-4 rounded-lg';
        div.innerHTML = `
            <h3 class="font-bold text-slate-900 mb-3">Testimonio ${index + 1}</h3>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Iniciales</label>
                    <input type="text" data-testimonio="${index}" data-field="iniciales" value="${testimonio.iniciales}" class="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                    <input type="text" data-testimonio="${index}" data-field="nombre" value="${testimonio.nombre}" class="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Puesto/Empresa</label>
                    <input type="text" data-testimonio="${index}" data-field="puesto" value="${testimonio.puesto}" class="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Testimonio</label>
                    <textarea data-testimonio="${index}" data-field="testimonio" rows="3" class="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-600 focus:outline-none">${testimonio.testimonio}</textarea>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function collectFormData() {
    contentData.sitio.nombre = document.getElementById('sitio-nombre').value;
    contentData.sitio.email = document.getElementById('sitio-email').value;
    contentData.sitio.telefono1 = document.getElementById('sitio-telefono1').value;
    contentData.sitio.telefono2 = document.getElementById('sitio-telefono2').value;
    contentData.sitio.ubicaciones = document.getElementById('sitio-ubicaciones').value;
    
    contentData.hero.badge = document.getElementById('hero-badge').value;
    contentData.hero.titulo = document.getElementById('hero-titulo').value;
    contentData.hero.tituloDestacado = document.getElementById('hero-titulo-destacado').value;
    contentData.hero.subtitulo = document.getElementById('hero-subtitulo').value;
    contentData.hero.imagenFondo = document.getElementById('hero-imagen').value;
    contentData.hero.estadisticas.experiencia = document.getElementById('hero-experiencia').value;
    contentData.hero.estadisticas.clientes = document.getElementById('hero-clientes').value;
    contentData.hero.estadisticas.oficinas = document.getElementById('hero-oficinas').value;
    
    document.querySelectorAll('[data-servicio]').forEach(input => {
        const index = input.getAttribute('data-servicio');
        const field = input.getAttribute('data-field');
        contentData.servicios[index][field] = input.value;
    });
    
    document.querySelectorAll('[data-caso]').forEach(input => {
        const index = input.getAttribute('data-caso');
        const field = input.getAttribute('data-field');
        contentData.casosExito[index][field] = input.value;
    });
    
    document.querySelectorAll('[data-testimonio]').forEach(input => {
        const index = input.getAttribute('data-testimonio');
        const field = input.getAttribute('data-field');
        contentData.testimonios[index][field] = input.value;
    });
    
    contentData.nosotros.historia.parrafo1 = document.getElementById('nosotros-p1').value;
    contentData.nosotros.historia.parrafo2 = document.getElementById('nosotros-p2').value;
    contentData.nosotros.historia.parrafo3 = document.getElementById('nosotros-p3').value;
    contentData.nosotros.mision = document.getElementById('nosotros-mision').value;
    contentData.nosotros.vision = document.getElementById('nosotros-vision').value;
}

function saveContent() {
    const saveBtn = document.getElementById('save-btn');
    const originalText = saveBtn.innerHTML;
    
    saveBtn.innerHTML = '⏳ Guardando...';
    saveBtn.disabled = true;
    saveBtn.classList.add('opacity-50');
    
    collectFormData();
    
    setTimeout(() => {
        const dataStr = JSON.stringify(contentData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'content.json';
        link.click();
        
        saveBtn.innerHTML = '✅ ¡Guardado!';
        saveBtn.classList.remove('opacity-50');
        
        showConfetti();
        showSuccessModal();
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 2000);
    }, 500);
}

function showConfetti() {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-20px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confetti-fall ${2 + Math.random() * 2}s linear`;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade-in';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl transform animate-scale-in">
            <div class="text-center">
                <div class="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 class="text-3xl font-bold text-slate-900 mb-3 gradient-text">¡Cambios Guardados!</h2>
                <p class="text-slate-600 mb-6">El archivo <code class="bg-blue-50 text-blue-600 px-2 py-1 rounded">content.json</code> se ha descargado exitosamente.</p>
                <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-6 text-left">
                    <p class="text-sm text-slate-700 mb-2"><strong>📝 Próximos pasos:</strong></p>
                    <ol class="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                        <li>Busca el archivo descargado en tu carpeta de Descargas</li>
                        <li>Reemplaza el archivo viejo en tu sitio web</li>
                        <li>Recarga la página para ver los cambios</li>
                    </ol>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg">
                    ¡Entendido! 🚀
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    }, 8000);
}

function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageEl = document.getElementById('password-message');
    
    const savedPassword = localStorage.getItem('adminPassword') || DEFAULT_PASSWORD;
    
    if (currentPassword !== savedPassword) {
        messageEl.textContent = '❌ La contraseña actual es incorrecta';
        messageEl.className = 'text-sm text-red-600';
        messageEl.classList.remove('hidden');
        return;
    }
    
    if (newPassword.length < 6) {
        messageEl.textContent = '❌ La nueva contraseña debe tener al menos 6 caracteres';
        messageEl.className = 'text-sm text-red-600';
        messageEl.classList.remove('hidden');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        messageEl.textContent = '❌ Las contraseñas no coinciden';
        messageEl.className = 'text-sm text-red-600';
        messageEl.classList.remove('hidden');
        return;
    }
    
    localStorage.setItem('adminPassword', newPassword);
    messageEl.textContent = '✅ Contraseña cambiada exitosamente';
    messageEl.className = 'text-sm text-emerald-600';
    messageEl.classList.remove('hidden');
    
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 3000);
}
