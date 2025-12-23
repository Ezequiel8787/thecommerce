let siteContent = {};

async function loadSiteContent() {
    try {
        const response = await fetch('content.json');
        siteContent = await response.json();
        updatePageContent();
    } catch (error) {
        console.error('Error cargando contenido:', error);
    }
}

function updatePageContent() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    updateContactInfo();
    
    if (currentPage === 'index.html' || currentPage === '') {
        updateHomePage();
    } else if (currentPage === 'nosotros.html') {
        updateNosotrosPage();
    } else if (currentPage === 'servicios.html') {
        updateServiciosPage();
    }
    
    // Aplicar cambios guardados del editor visual después de cargar content.json
    applyVisualEditorChanges();
}

async function applyVisualEditorChanges() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageId = currentPage.replace('.html', '_html');
    
    console.log('🔍 Cargando cambios desde editor-changes.json para:', pageId);
    
    try {
        const response = await fetch('editor-changes.json');
        if (!response.ok) {
            console.log('📦 No hay archivo de cambios');
            return;
        }
        
        const allChanges = await response.json();
        const changes = allChanges[pageId] || {};
        
        if (Object.keys(changes).length === 0) {
            console.log('📦 No hay cambios para esta página');
            return;
        }
        
        console.log('🎨 Aplicando', Object.keys(changes).length, 'cambios');
        
        Object.keys(changes).forEach(selector => {
            const change = changes[selector];
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
                if (change.src && element.tagName === 'IMG') {
                    element.src = change.src;
                }
                console.log('✅ Cambio aplicado a:', selector);
            }
        });
    } catch (e) {
        console.log('📦 Error cargando cambios:', e.message);
    }
}

function updateContactInfo() {
    const emailElements = document.querySelectorAll('[data-contact="email"]');
    emailElements.forEach(el => el.textContent = `📧 ${siteContent.sitio.email}`);
    
    const phone1Elements = document.querySelectorAll('[data-contact="telefono1"]');
    phone1Elements.forEach(el => el.textContent = `📞 ${siteContent.sitio.telefono1}`);
    
    const phone2Elements = document.querySelectorAll('[data-contact="telefono2"]');
    phone2Elements.forEach(el => el.textContent = `📞 ${siteContent.sitio.telefono2}`);
    
    const ubicacionElements = document.querySelectorAll('[data-contact="ubicaciones"]');
    ubicacionElements.forEach(el => el.textContent = `📍 ${siteContent.sitio.ubicaciones}`);
}

function updateHomePage() {
    const badgeEl = document.querySelector('[data-hero="badge"]');
    if (badgeEl) badgeEl.textContent = siteContent.hero.badge;
    
    const tituloEl = document.querySelector('[data-hero="titulo"]');
    if (tituloEl) tituloEl.innerHTML = `${siteContent.hero.titulo} <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">${siteContent.hero.tituloDestacado}</span>`;
    
    const subtituloEl = document.querySelector('[data-hero="subtitulo"]');
    if (subtituloEl) subtituloEl.textContent = siteContent.hero.subtitulo;
    
    const imagenEl = document.querySelector('[data-hero="imagen"]');
    if (imagenEl) imagenEl.src = siteContent.hero.imagenFondo;
    
    const experienciaEl = document.querySelector('[data-stat="experiencia"]');
    if (experienciaEl) experienciaEl.textContent = siteContent.hero.estadisticas.experiencia;
    
    const clientesEl = document.querySelector('[data-stat="clientes"]');
    if (clientesEl) clientesEl.textContent = siteContent.hero.estadisticas.clientes;
    
    const oficinasEl = document.querySelector('[data-stat="oficinas"]');
    if (oficinasEl) oficinasEl.textContent = siteContent.hero.estadisticas.oficinas;
    
    updateServicios();
    updateCertificaciones();
    updateCasosExito();
    updateTestimonios();
}

function updateServicios() {
    const serviciosContainer = document.querySelector('[data-servicios-grid]');
    if (!serviciosContainer) return;
    
    serviciosContainer.innerHTML = '';
    
    siteContent.servicios.forEach(servicio => {
        const servicioHTML = `
            <div class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
                <div class="aspect-[3/4] overflow-hidden">
                    <img src="${servicio.imagen}" alt="${servicio.nombre}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 class="text-lg font-bold mb-2">${servicio.nombre}</h3>
                    <a href="servicios.html" class="inline-flex items-center text-sm font-semibold hover:text-blue-300 transition">
                        Ver más →
                    </a>
                </div>
            </div>
        `;
        serviciosContainer.insertAdjacentHTML('beforeend', servicioHTML);
    });
}

function updateCertificaciones() {
    const certContainer = document.querySelector('[data-certificaciones-grid]');
    if (!certContainer) return;
    
    certContainer.innerHTML = '';
    
    siteContent.certificaciones.forEach(cert => {
        const certHTML = `
            <div class="flex flex-col items-center">
                <div class="text-5xl mb-3">${cert.icono}</div>
                <h3 class="text-lg font-bold mb-2">${cert.titulo}</h3>
                <p class="text-sm text-blue-200">${cert.descripcion}</p>
            </div>
        `;
        certContainer.insertAdjacentHTML('beforeend', certHTML);
    });
}

function updateCasosExito() {
    const casosContainer = document.querySelector('[data-casos-grid]');
    if (!casosContainer) return;
    
    casosContainer.innerHTML = '';
    
    siteContent.casosExito.forEach(caso => {
        const casoHTML = `
            <div class="bg-gradient-to-br from-${caso.color}-50 to-white p-8 rounded-2xl border-2 border-${caso.color}-100 hover:shadow-2xl transition-all">
                <div class="flex items-center justify-between mb-6">
                    <div class="w-16 h-16 bg-${caso.color}-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">${caso.iniciales}</div>
                    <span class="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">${caso.badge}</span>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">${caso.empresa}</h3>
                <p class="text-slate-600 mb-4 text-sm">${caso.descripcion}</p>
                <div class="border-t border-slate-200 pt-4">
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-slate-500">Ahorro anual:</span>
                        <span class="font-bold text-${caso.color}-600">${caso.ahorro}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-500">Envíos realizados:</span>
                        <span class="font-bold">${caso.envios}</span>
                    </div>
                </div>
            </div>
        `;
        casosContainer.insertAdjacentHTML('beforeend', casoHTML);
    });
}

function updateTestimonios() {
    const testimoniosContainer = document.querySelector('[data-testimonios-grid]');
    if (!testimoniosContainer) return;
    
    testimoniosContainer.innerHTML = '';
    
    siteContent.testimonios.forEach(testimonio => {
        const testimonioHTML = `
            <div class="bg-slate-800 p-8 rounded-2xl hover:bg-slate-750 transition-all hover:scale-105">
                <div class="flex items-center mb-4">
                    <div class="flex text-yellow-400 text-xl">★★★★★</div>
                </div>
                <p class="text-slate-300 mb-6 italic">"${testimonio.testimonio}"</p>
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-${testimonio.color}-600 rounded-full flex items-center justify-center font-bold mr-3">${testimonio.iniciales}</div>
                    <div>
                        <p class="font-bold">${testimonio.nombre}</p>
                        <p class="text-sm text-slate-400">${testimonio.puesto}</p>
                    </div>
                </div>
            </div>
        `;
        testimoniosContainer.insertAdjacentHTML('beforeend', testimonioHTML);
    });
}

function updateNosotrosPage() {
    const p1El = document.querySelector('[data-nosotros="p1"]');
    if (p1El) p1El.textContent = siteContent.nosotros.historia.parrafo1;
    
    const p2El = document.querySelector('[data-nosotros="p2"]');
    if (p2El) p2El.textContent = siteContent.nosotros.historia.parrafo2;
    
    const p3El = document.querySelector('[data-nosotros="p3"]');
    if (p3El) p3El.textContent = siteContent.nosotros.historia.parrafo3;
    
    const misionEl = document.querySelector('[data-nosotros="mision"]');
    if (misionEl) misionEl.textContent = siteContent.nosotros.mision;
    
    const visionEl = document.querySelector('[data-nosotros="vision"]');
    if (visionEl) visionEl.textContent = siteContent.nosotros.vision;
}

function updateServiciosPage() {
    const serviciosContainer = document.querySelector('[data-servicios-adicionales]');
    if (!serviciosContainer) return;
    
    serviciosContainer.innerHTML = '';
    
    siteContent.servicios.forEach(servicio => {
        const servicioHTML = `
            <div class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
                <div class="aspect-[3/4] overflow-hidden">
                    <img src="${servicio.imagen}" alt="${servicio.nombre}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 class="text-lg font-bold mb-2">${servicio.nombre}</h3>
                    <a href="cotizaciones.html?servicio=${encodeURIComponent(servicio.nombre)}" class="inline-flex items-center text-sm font-semibold hover:text-blue-300 transition">
                        Cotizar →
                    </a>
                </div>
            </div>
        `;
        serviciosContainer.insertAdjacentHTML('beforeend', servicioHTML);
    });
}

document.addEventListener('DOMContentLoaded', loadSiteContent);
