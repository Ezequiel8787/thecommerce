# 🌟 Integración de Google Reviews Automáticos

## 📋 Pasos para configurar la integración con Google Maps API:

### 1. Obtener API Key de Google Places
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Places API**
4. Crea una **API Key**
5. Restringe la API Key a tu dominio Vercel

### 2. Configurar el Place ID
El Place ID para THM Commerce ya está configurado:
```
ChdDSUhNMG9nS0VJQ0FnSUNMcXJDQjZnRRAB
```

### 3. Actualizar el archivo de configuración
Edita `google-reviews.js` y reemplaza:
```javascript
const GOOGLE_PLACES_API_KEY = 'TU_API_KEY_AQUI';
```
Con tu API Key real.

### 4. Añadir el script a tu HTML
Añade esta línea antes de `</body>` en `index.html`:
```html
<script src="google-reviews.js"></script>
```

## 🚀 Características de la integración:

### ✅ Funciones automáticas:
- **Rating en tiempo real**: Se actualiza automáticamente desde Google Maps
- **Nuevas reseñas**: Las reseñas nuevas aparecen automáticamente
- **Filtrado inteligente**: Solo muestra reseñas de 4-5 estrellas
- **Actualización periódica**: Se actualiza cada 24 horas

### 📊 Datos que se obtienen:
- ⭐ Calificación general (ej: 4.8/5.0)
- 📈 Número total de reseñas
- 💬 Texto de las reseñas
- 👤 Nombre del autor
- 🕐 Fecha de la reseña
- 🖼️ Foto de perfil (opcional)

### 🎨 Personalización:
- **Colores automáticos**: Cada reseña tiene un color diferente
- **Iniciales automáticas**: Genera iniciales desde el nombre
- **Estrellas dinámicas**: Muestra la calificación real
- **Texto seguro**: Escapa HTML para prevenir XSS

## 💰 Costos de la API:
- **Gratis**: Hasta 1,000 solicitudes por día
- **$2.50 USD**: Por cada 1,000 solicitudes adicionales
- **Uso estimado**: 1-2 solicitudes por día = ~$0 USD/mes

## 🔧 Configuración avanzada:

### Personalizar el filtrado:
```javascript
// En google-reviews.js, modifica esta línea:
const positiveReviews = reviews.filter(review => review.rating >= 4);
// Cambia el 4 por 3 para incluir reseñas de 3 estrellas
```

### Cambiar frecuencia de actualización:
```javascript
// Modifica este valor (en milisegundos):
setInterval(() => {
    reviewsManager.updateTestimonials();
}, 24 * 60 * 60 * 1000); // 24 horas
```

### Limitar número de reseñas:
```javascript
const selectedReviews = positiveReviews.slice(0, 6); // Cambia 4 por 6
```

## 🚨 Consideraciones importantes:

1. **Seguridad**: Nunca expongas tu API Key en el cliente en producción
2. **Cuotas**: Monitorea tu uso para evitar costos inesperados
3. **Cache**: Considera implementar cache del lado del servidor
4. **Fallback**: Mantén las reseñas estáticas como respaldo

## 🔄 Alternativa: Server-side

Para mayor seguridad, considera implementar un endpoint del lado del servidor:

```javascript
// Ejemplo en Node.js/Express
app.get('/api/reviews', async (req, res) => {
    const reviews = await fetchGoogleReviews();
    res.json(reviews);
});
```

## 📞 Soporte:
Si necesitas ayuda con la configuración, contacta al equipo de desarrollo.
