document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Testimonials Carousel
    const carousel = document.getElementById('testimonials-carousel');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const indicators = document.getElementById('testimonial-indicators');
    
    if (carousel && prevBtn && nextBtn && indicators) {
        let currentSlide = 0;
        const totalSlides = 4;
        let autoPlayInterval;
        
        function updateCarousel() {
            // Update carousel position
            if (window.innerWidth >= 768) {
                // Desktop: Show 3 slides, move by 1 slide
                carousel.style.transform = `translateX(-${currentSlide * 33.333}%)`;
            } else {
                // Mobile: Show 1 slide, move by 1 slide
                carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            }
            
            // Update indicators
            indicators.querySelectorAll('button').forEach((btn, index) => {
                if (index === currentSlide) {
                    btn.classList.remove('bg-slate-600');
                    btn.classList.add('bg-blue-600');
                } else {
                    btn.classList.remove('bg-blue-600');
                    btn.classList.add('bg-slate-600');
                }
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Event listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });
        
        // Indicator clicks
        indicators.querySelectorAll('button').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
                stopAutoPlay();
                startAutoPlay();
            });
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                nextSlide();
                stopAutoPlay();
                startAutoPlay();
            }
            if (touchEndX > touchStartX + 50) {
                prevSlide();
                stopAutoPlay();
                startAutoPlay();
            }
        }
        
        // Start autoplay
        startAutoPlay();
        
        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
        
        // Handle window resize
        window.addEventListener('resize', updateCarousel);
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
