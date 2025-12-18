document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.md\\:hidden');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && !mobileMenu) {
        // Create mobile menu if it doesn't exist
        const nav = document.querySelector('nav');
        const menuHTML = `
            <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-slate-200 py-4 px-6">
                <a href="index.html" class="block py-3 text-slate-700 hover:text-blue-600 transition">Inicio</a>
                <a href="nosotros.html" class="block py-3 text-slate-700 hover:text-blue-600 transition">Nosotros</a>
                <a href="servicios.html" class="block py-3 text-slate-700 hover:text-blue-600 transition">Servicios</a>
                <a href="direcciones.html" class="block py-3 text-slate-700 hover:text-blue-600 transition">Direcciones</a>
                <a href="cotizaciones.html" class="block py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-center mt-2">Cotizar</a>
            </div>
        `;
        nav.insertAdjacentHTML('beforeend', menuHTML);
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        });
    }
    
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                counters.forEach(counter => animateCounter(counter));
                hasAnimated = true;
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });

    const animateOnScroll = document.querySelectorAll('.hover\\:shadow-2xl, .hover\\:scale-105');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animateOnScroll.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        scrollObserver.observe(el);
    });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        const successMsg = document.getElementById('successMsg');
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';

        if (name === "" || email === "") {
            if (typeof toast !== 'undefined') {
                toast.warning('Por favor, completa todos los campos requeridos.');
            }
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span class="inline-block animate-spin mr-2">⏳</span> Enviando...';
        btn.classList.add('opacity-70', 'cursor-not-allowed');

        setTimeout(() => {
            btn.classList.add('hidden');
            successMsg.classList.remove('hidden');
            successMsg.style.animation = 'fadeInUp 0.5s ease-out';
            
            contactForm.reset();

            console.log("Datos capturados:", {
                nombre: name,
                correo: email,
                mensaje: message
            });
        }, 2000);
    });
}
