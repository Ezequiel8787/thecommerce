class ChatbotAI {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.responses = {
            greeting: [
                "¡Hola! 👋 Soy el asistente virtual de THM Commerce. ¿En qué puedo ayudarte hoy?",
                "¡Bienvenido! Soy tu asistente de logística. ¿Tienes alguna pregunta sobre importaciones?"
            ],
            pricing: [
                "Nuestros precios son muy competitivos. Para envíos aéreos desde China, el costo promedio es de $4-6 USD por kg. Para envíos marítimos, desde $800 USD por m³. ¿Te gustaría una cotización personalizada?",
                "Los precios varían según el tipo de carga y origen. En promedio, nuestros clientes ahorran hasta 40% vs otros proveedores. ¿Quieres que te envíe una cotización?"
            ],
            time: [
                "Los tiempos de entrega son: ✈️ Aéreo: 5-7 días, 🚢 Marítimo: 25-35 días. Ambos incluyen gestión aduanal y entrega en tu almacén.",
                "Desde China: 5-7 días vía aérea, 25-35 días vía marítima. Desde USA: 3-5 días. Todos los tiempos incluyen despacho aduanal."
            ],
            verification: [
                "Nuestro servicio de verificación incluye: inspección de fábrica, revisión de calidad, certificaciones, fotos detalladas y reportes completos antes del embarque. Cuesta aproximadamente $300-500 USD.",
                "La verificación en China es clave para evitar problemas. Nuestro equipo en Shenzhen inspecciona tu mercancía antes del envío. ¿Te interesa este servicio?"
            ],
            invoice: [
                "Sí, ofrecemos facturación nacional con CFDI 4.0, 100% deducible de impuestos. Compramos tu mercancía en el extranjero y te facturamos en México.",
                "Nuestro servicio de comercializadora te permite obtener facturas nacionales. Es perfecto para empresas que necesitan deducibilidad fiscal completa."
            ],
            minimum: [
                "No tenemos mínimo de envío. Manejamos desde 1kg hasta contenedores completos. Cada proyecto es importante para nosotros.",
                "Trabajamos con cualquier volumen: desde pequeños paquetes hasta contenedores FCL de 40 pies. ¿Cuánto necesitas enviar?"
            ],
            contact: [
                "Puedes contactarnos por: 📱 WhatsApp: (614) 152-6240, 📧 Email: thmlogisticsimports@gmail.com, 📞 Teléfono: (614) 219-0607. ¿Prefieres que te contactemos nosotros?",
                "Estamos disponibles 24/7. Llámanos al (614) 219-0607 o escríbenos por WhatsApp al (614) 152-6240. ¿Quieres agendar una llamada?"
            ],
            process: [
                "El proceso es simple: 1) Nos envías los detalles de tu carga, 2) Te cotizamos en 24hrs, 3) Coordinamos el envío, 4) Gestionamos aduanas, 5) Entregamos en tu puerta. ¿Empezamos?",
                "Es muy fácil: cotización → aprobación → recolección → envío → aduanas → entrega. Todo lo manejamos nosotros. ¿Tienes lista la información de tu carga?"
            ],
            insurance: [
                "Sí, todos nuestros envíos incluyen seguro de carga sin costo adicional. Tu mercancía está protegida desde origen hasta destino.",
                "El seguro está incluido en nuestras tarifas. Cubrimos cualquier daño o pérdida durante el transporte. ¿Necesitas cobertura adicional?"
            ],
            tracking: [
                "Ofrecemos tracking 24/7 en tiempo real. Recibirás un código de seguimiento y podrás ver la ubicación exacta de tu carga en cualquier momento.",
                "Sí, tenemos sistema de rastreo completo. Te enviamos actualizaciones automáticas por email y WhatsApp en cada etapa del envío."
            ]
        };
        
        this.keywords = {
            greeting: ['hola', 'buenos días', 'buenas tardes', 'hey', 'saludos', 'qué tal'],
            pricing: ['precio', 'costo', 'cuánto', 'tarifa', 'cotización', 'cotizar', 'barato', 'económico'],
            time: ['tiempo', 'cuánto tarda', 'demora', 'días', 'rápido', 'entrega', 'plazo'],
            verification: ['verificación', 'inspección', 'calidad', 'revisar', 'fábrica', 'proveedor'],
            invoice: ['factura', 'cfdi', 'deducible', 'impuestos', 'comercializadora', 'nacional'],
            minimum: ['mínimo', 'mínima', 'poco', 'pequeño', 'cantidad'],
            contact: ['contacto', 'teléfono', 'whatsapp', 'email', 'llamar', 'comunicar'],
            process: ['proceso', 'cómo funciona', 'pasos', 'procedimiento', 'empezar'],
            insurance: ['seguro', 'protección', 'cobertura', 'garantía'],
            tracking: ['rastreo', 'seguimiento', 'tracking', 'ubicación', 'dónde está']
        };
        
        this.init();
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatWidget() {
        const chatHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <button id="chatbot-button" class="chatbot-button">
                    <svg class="chatbot-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                    <span class="chatbot-badge">1</span>
                </button>
                
                <div id="chatbot-window" class="chatbot-window">
                    <div class="chatbot-header">
                        <div class="chatbot-header-content">
                            <div class="chatbot-avatar">
                                <span>🤖</span>
                            </div>
                            <div>
                                <h3 class="chatbot-title">Asistente THM</h3>
                                <p class="chatbot-status">
                                    <span class="status-dot"></span>
                                    En línea
                                </p>
                            </div>
                        </div>
                        <button id="chatbot-close" class="chatbot-close">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <div id="chatbot-messages" class="chatbot-messages"></div>
                    
                    <div class="chatbot-suggestions" id="chatbot-suggestions">
                        <button class="suggestion-btn" data-message="¿Cuánto cuesta importar desde China?">💰 Precios</button>
                        <button class="suggestion-btn" data-message="¿Cuánto tiempo tarda el envío?">⏱️ Tiempos</button>
                        <button class="suggestion-btn" data-message="¿Ofrecen verificación de fábricas?">🔍 Verificación</button>
                        <button class="suggestion-btn" data-message="Quiero una cotización">📋 Cotizar</button>
                    </div>
                    
                    <div class="chatbot-input-container">
                        <input 
                            type="text" 
                            id="chatbot-input" 
                            class="chatbot-input" 
                            placeholder="Escribe tu pregunta..."
                            autocomplete="off"
                        />
                        <button id="chatbot-send" class="chatbot-send">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    attachEventListeners() {
        const button = document.getElementById('chatbot-button');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const suggestions = document.querySelectorAll('.suggestion-btn');

        button.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        suggestions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.getAttribute('data-message');
                document.getElementById('chatbot-input').value = message;
                this.sendMessage();
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        const button = document.getElementById('chatbot-button');
        const badge = document.querySelector('.chatbot-badge');
        
        if (this.isOpen) {
            window.classList.add('active');
            button.classList.add('active');
            if (badge) badge.style.display = 'none';
            document.getElementById('chatbot-input').focus();
        } else {
            window.classList.remove('active');
            button.classList.remove('active');
        }
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('bot', this.responses.greeting[0]);
        }, 1000);
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addMessage('user', message);
        input.value = '';
        
        setTimeout(() => {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                const response = this.generateResponse(message);
                this.addMessage('bot', response);
            }, 1500);
        }, 500);
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">${text}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${text}</div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ sender, text, timestamp: new Date() });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <span></span><span></span><span></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        for (const [category, keywords] of Object.entries(this.keywords)) {
            for (const keyword of keywords) {
                if (lowerMessage.includes(keyword)) {
                    const responses = this.responses[category];
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }
        
        const defaultResponses = [
            "Interesante pregunta. Para darte información más precisa, ¿podrías contarme más detalles sobre tu proyecto de importación?",
            "Entiendo tu consulta. Te recomiendo que solicites una cotización personalizada o nos contactes directamente al (614) 219-0607 para ayudarte mejor.",
            "Gracias por tu pregunta. Nuestro equipo puede darte una respuesta más detallada. ¿Quieres que te contactemos por WhatsApp o email?",
            "Para brindarte la mejor asesoría, te sugiero hablar con uno de nuestros especialistas. ¿Te gustaría agendar una llamada?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatbotAI();
});
