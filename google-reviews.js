// Google Reviews API Integration
// Requiere: Google Places API Key

class GoogleReviewsManager {
    constructor(apiKey, placeId) {
        this.apiKey = apiKey;
        this.placeId = placeId;
        this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
    }

    async getPlaceDetails() {
        try {
            const response = await fetch(
                `${this.baseUrl}/details/json?place_id=${this.placeId}&fields=reviews,rating,user_ratings_total&key=${this.apiKey}`
            );
            
            const data = await response.json();
            
            if (data.status === 'OK') {
                return {
                    rating: data.result.rating,
                    totalReviews: data.result.user_ratings_total,
                    reviews: this.formatReviews(data.result.reviews)
                };
            } else {
                console.error('Error fetching place details:', data.status);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    formatReviews(reviews) {
        return reviews.map(review => ({
            author: review.author_name,
            rating: review.rating,
            text: review.text,
            time: review.relative_time_description,
            profilePhoto: review.profile_photo_url
        }));
    }

    async updateTestimonials() {
        const data = await this.getPlaceDetails();
        if (data) {
            this.updateUI(data);
        }
    }

    updateUI(data) {
        // Actualizar rating general
        const ratingElement = document.querySelector('[data-cert_rating]');
        if (ratingElement) {
            ratingElement.textContent = `${data.rating}/5.0`;
        }

        // Actualizar número de reseñas
        const reviewsCountElement = document.querySelector('[data-cert_rating_desc]');
        if (reviewsCountElement) {
            reviewsCountElement.textContent = `${data.totalReviews} Reseñas`;
        }

        // Actualizar carrusel de testimonios
        this.updateTestimonialsCarousel(data.reviews);
    }

    updateTestimonialsCarousel(reviews) {
        const carousel = document.getElementById('testimonials-carousel');
        if (!carousel) return;

        // Filtrar solo reseñas de 4-5 estrellas
        const positiveReviews = reviews.filter(review => review.rating >= 4);
        
        // Tomar las primeras 4 reseñas positivas
        const selectedReviews = positiveReviews.slice(0, 4);

        let carouselHTML = '';
        selectedReviews.forEach((review, index) => {
            const initials = this.getInitials(review.author);
            const colors = ['blue', 'cyan', 'purple', 'emerald'];
            const color = colors[index % colors.length];

            carouselHTML += `
                <div class="min-w-full md:min-w-0 md:w-1/3 px-2">
                    <div class="bg-slate-800 p-8 rounded-2xl hover:bg-slate-750 transition-all hover:scale-105 h-full">
                        <div class="flex items-center mb-4">
                            <div class="flex text-yellow-400 text-xl">${this.getStars(review.rating)}</div>
                        </div>
                        <p class="text-slate-300 mb-6 italic">"${this.escapeHtml(review.text)}"</p>
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-${color}-600 rounded-full flex items-center justify-center font-bold mr-3">
                                ${initials}
                            </div>
                            <div>
                                <p class="font-bold">${review.author}</p>
                                <p class="text-sm text-slate-400">${review.time}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        carousel.innerHTML = carouselHTML;
    }

    getInitials(name) {
        return name.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    getStars(rating) {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Configuración y uso
const GOOGLE_PLACES_API_KEY = 'TU_API_KEY_AQUI';
const PLACE_ID = 'ChdDSUhNMG9nS0VJQ0FnSUNMcXJDQjZnRRAB'; // Place ID de THM Company

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (GOOGLE_PLACES_API_KEY !== 'TU_API_KEY_AQUI') {
        const reviewsManager = new GoogleReviewsManager(GOOGLE_PLACES_API_KEY, PLACE_ID);
        
        // Cargar reseñas
        reviewsManager.updateTestimonials();
        
        // Actualizar cada 24 horas
        setInterval(() => {
            reviewsManager.updateTestimonials();
        }, 24 * 60 * 60 * 1000);
    } else {
        console.log('Configura tu Google Places API Key en google-reviews.js');
    }
});
