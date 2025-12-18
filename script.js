document.addEventListener('DOMContentLoaded', function() {
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
