// Sistema de Notificaciones Modernas
class ToastNotification {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Crear contenedor de notificaciones si no existe
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'fixed top-4 right-4 z-[10000] space-y-3 max-w-[calc(100vw-2rem)] md:max-w-md';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }
    
    show(message, type = 'info', duration = 4000) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        
        // Animación de entrada
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
            toast.classList.add('translate-x-0', 'opacity-100');
        }, 10);
        
        // Auto-remover después de la duración
        setTimeout(() => {
            this.remove(toast);
        }, duration);
        
        return toast;
    }
    
    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = 'transform translate-x-full opacity-0 transition-all duration-500 ease-out max-w-md w-full';
        
        const config = this.getConfig(type);
        
        toast.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl border-l-4 ${config.borderColor} p-4 flex items-start gap-3 backdrop-blur-sm">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center">
                        ${config.icon}
                    </div>
                </div>
                <div class="flex-1 pt-0.5">
                    <p class="text-sm font-semibold ${config.textColor} mb-1">${config.title}</p>
                    <p class="text-sm text-slate-600">${message}</p>
                </div>
                <button class="flex-shrink-0 text-slate-400 hover:text-slate-600 transition" onclick="this.closest('.transform').remove()">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        return toast;
    }
    
    getConfig(type) {
        const configs = {
            success: {
                title: '¡Éxito!',
                icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>`,
                bgColor: 'bg-emerald-500',
                borderColor: 'border-emerald-500',
                textColor: 'text-emerald-700'
            },
            error: {
                title: 'Error',
                icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>`,
                bgColor: 'bg-red-500',
                borderColor: 'border-red-500',
                textColor: 'text-red-700'
            },
            warning: {
                title: 'Advertencia',
                icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>`,
                bgColor: 'bg-amber-500',
                borderColor: 'border-amber-500',
                textColor: 'text-amber-700'
            },
            info: {
                title: 'Información',
                icon: `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>`,
                bgColor: 'bg-blue-500',
                borderColor: 'border-blue-500',
                textColor: 'text-blue-700'
            }
        };
        
        return configs[type] || configs.info;
    }
    
    remove(toast) {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }
    
    success(message, duration) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Inicializar sistema de notificaciones
let toast;
document.addEventListener('DOMContentLoaded', () => {
    toast = new ToastNotification();
});

// Función global para compatibilidad
function showNotification(message, type = 'info', duration = 4000) {
    if (toast) {
        return toast.show(message, type, duration);
    }
}
