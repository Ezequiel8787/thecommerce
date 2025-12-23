class ImageUploader {
    constructor(inputId, previewId) {
        this.input = document.getElementById(inputId);
        this.previewContainer = document.getElementById(previewId);
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.input) return;

        this.input.addEventListener('paste', (e) => this.handlePaste(e));
        this.input.addEventListener('input', () => this.updatePreview());
        
        const dropZone = this.input.parentElement;
        dropZone.classList.add('image-drop-zone');
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            this.handleDrop(e);
        });
    }

    handlePaste(e) {
        const items = e.clipboardData.items;
        
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = item.getAsFile();
                this.uploadImage(file);
                return;
            }
            
            if (item.type === 'text/plain') {
                item.getAsString((text) => {
                    if (this.isValidImageUrl(text)) {
                        this.input.value = text;
                        this.updatePreview();
                    }
                });
            }
        }
    }

    handleDrop(e) {
        const files = e.dataTransfer.files;
        const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
        
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                this.uploadImage(file);
            }
        } else if (url && this.isValidImageUrl(url)) {
            this.input.value = url;
            this.updatePreview();
        }
    }

    uploadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            this.input.value = base64;
            this.updatePreview();
            this.showUploadMessage('Imagen cargada. Considera subirla a un servicio como Imgur para mejor rendimiento.');
        };
        reader.readAsDataURL(file);
    }

    isValidImageUrl(url) {
        try {
            const urlObj = new URL(url);
            return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname) || 
                   url.includes('unsplash.com') || 
                   url.includes('images.') ||
                   url.startsWith('data:image/');
        } catch {
            return false;
        }
    }

    updatePreview() {
        if (!this.previewContainer) return;
        
        const url = this.input.value.trim();
        
        if (url && this.isValidImageUrl(url)) {
            this.previewContainer.innerHTML = `
                <div class="mt-3 relative">
                    <img src="${url}" alt="Preview" class="w-full max-w-md h-48 object-cover rounded-lg border-2 border-slate-200">
                    <button type="button" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition" onclick="this.closest('.mt-3').remove(); document.getElementById('${this.input.id}').value = '';">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `;
        } else if (url) {
            this.previewContainer.innerHTML = `
                <div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    ⚠️ La URL no parece ser una imagen válida
                </div>
            `;
        } else {
            this.previewContainer.innerHTML = '';
        }
    }

    showUploadMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800';
        msgDiv.textContent = message;
        this.input.parentElement.appendChild(msgDiv);
        
        setTimeout(() => msgDiv.remove(), 5000);
    }
}

function initializeImageUploaders() {
    new ImageUploader('hero-imagen', 'hero-imagen-preview');
}
