// Calculadora de Costos de Importación
class CostCalculator {
    constructor() {
        this.rates = {
            aereo: {
                china: 21.5,  // USD por kg + IVA
                usa: 18.5
            },
            maritimo: {
                china: 980,  // USD por m³
                usa: 750
            }
        };
        this.ivaRate = 0.16; // 16% IVA México
        
        this.init();
    }
    
    init() {
        const calcButton = document.getElementById('calc-button');
        const calcModal = document.getElementById('calc-modal');
        const closeCalc = document.getElementById('close-calc');
        const calculateBtn = document.getElementById('calculate-btn');
        
        if (calcButton) {
            calcButton.addEventListener('click', () => this.openCalculator());
        }
        
        if (closeCalc) {
            closeCalc.addEventListener('click', () => this.closeCalculator());
        }
        
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
        }
        
        // Cerrar al hacer clic fuera
        if (calcModal) {
            calcModal.addEventListener('click', (e) => {
                if (e.target === calcModal) {
                    this.closeCalculator();
                }
            });
        }
    }
    
    openCalculator() {
        const modal = document.getElementById('calc-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }
    
    closeCalculator() {
        const modal = document.getElementById('calc-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }
    
    calculate() {
        const weight = parseFloat(document.getElementById('calc-weight').value) || 0;
        const volume = parseFloat(document.getElementById('calc-volume').value) || 0;
        const origin = document.getElementById('calc-origin').value;
        
        if (weight <= 0 && volume <= 0) {
            if (typeof toast !== 'undefined') {
                toast.warning('Por favor ingresa el peso o volumen de tu carga');
            }
            return;
        }
        
        // Calcular costos
        const aereoRate = this.rates.aereo[origin];
        const maritimoRate = this.rates.maritimo[origin];
        
        const costAereoBase = weight * aereoRate;
        const costAereoIVA = costAereoBase * this.ivaRate;
        const costAereo = costAereoBase + costAereoIVA;
        const costMaritimo = volume * maritimoRate;
        
        // Calcular tiempos
        const timeAereo = origin === 'china' ? '5-7 días' : '3-5 días';
        const timeMaritimo = origin === 'china' ? '25-35 días' : '15-20 días';
        
        // Mostrar resultados
        this.showResults({
            aereo: {
                cost: costAereo,
                costBase: costAereoBase,
                costIVA: costAereoIVA,
                time: timeAereo,
                perUnit: aereoRate
            },
            maritimo: {
                cost: costMaritimo,
                time: timeMaritimo,
                perUnit: maritimoRate
            },
            weight,
            volume,
            origin
        });
    }
    
    showResults(data) {
        const resultsDiv = document.getElementById('calc-results');
        const inputsDiv = document.getElementById('calc-inputs');
        
        if (!resultsDiv || !inputsDiv) return;
        
        inputsDiv.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        
        // Formatear moneda
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        };
        
        const originText = data.origin === 'china' ? 'China' : 'Estados Unidos';
        
        resultsDiv.innerHTML = `
            <div class="text-center mb-6">
                <h3 class="text-2xl font-bold text-white mb-2">Estimación de Costos</h3>
                <p class="text-blue-200">Desde ${originText} • ${data.weight}kg • ${data.volume}m³</p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl border-2 border-blue-400">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl">✈️</span>
                        <span class="text-xs bg-blue-500 px-2 py-1 rounded-full">Más Rápido</span>
                    </div>
                    <h4 class="text-lg font-bold text-white mb-2">Envío Aéreo</h4>
                    <div class="text-3xl font-black text-white mb-2">${formatCurrency(data.aereo.cost)}</div>
                    <p class="text-blue-100 text-sm mb-1">Tiempo: ${data.aereo.time}</p>
                    <p class="text-xs text-blue-200 mb-1">Tarifa: $${data.aereo.perUnit} USD/kg + IVA</p>
                    <p class="text-xs text-blue-300">Base: ${formatCurrency(data.aereo.costBase)} | IVA: ${formatCurrency(data.aereo.costIVA)}</p>
                </div>
                
                <div class="bg-gradient-to-br from-cyan-600 to-cyan-700 p-6 rounded-xl border-2 border-cyan-400">
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl">🚢</span>
                        <span class="text-xs bg-cyan-500 px-2 py-1 rounded-full">Más Económico</span>
                    </div>
                    <h4 class="text-lg font-bold text-white mb-2">Envío Marítimo</h4>
                    <div class="text-3xl font-black text-white mb-2">${formatCurrency(data.maritimo.cost)}</div>
                    <p class="text-cyan-100 text-sm mb-3">Tiempo: ${data.maritimo.time}</p>
                    <p class="text-xs text-cyan-200">Tarifa: $${data.maritimo.perUnit} USD/m³</p>
                </div>
            </div>
            
            <div class="bg-blue-900/50 p-4 rounded-lg mb-6">
                <p class="text-sm text-blue-200 mb-2">💡 <strong>Ahorro potencial:</strong> ${formatCurrency(Math.abs(data.aereo.cost - data.maritimo.cost))}</p>
                <p class="text-xs text-blue-300">* Precios estimados. Envío marítimo no incluye aduanas ni seguros. Envío aéreo incluye IVA del 16%. Cotización final puede variar.</p>
            </div>
            
            <div class="flex gap-3">
                <button onclick="costCalculator.reset()" class="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition">
                    Nueva Cotización
                </button>
                <a href="cotizaciones.html" class="flex-1 px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:scale-105 transition text-center">
                    Solicitar Cotización Oficial
                </a>
            </div>
        `;
    }
    
    reset() {
        const resultsDiv = document.getElementById('calc-results');
        const inputsDiv = document.getElementById('calc-inputs');
        
        if (resultsDiv && inputsDiv) {
            resultsDiv.classList.add('hidden');
            inputsDiv.classList.remove('hidden');
            
            // Limpiar inputs
            document.getElementById('calc-weight').value = '';
            document.getElementById('calc-volume').value = '';
        }
    }
}

// Inicializar calculadora
let costCalculator;
document.addEventListener('DOMContentLoaded', () => {
    costCalculator = new CostCalculator();
});
