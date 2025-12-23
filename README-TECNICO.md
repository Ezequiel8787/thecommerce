# 🛠️ Documentación Técnica - Sistema CMS THM Commerce

## 📌 Descripción General

Sistema de gestión de contenido (CMS) simple basado en JSON para el sitio web de THM Commerce. Permite a usuarios sin conocimientos técnicos editar contenido e imágenes a través de un panel de administración visual.

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

1. **`content.json`**: Base de datos en formato JSON con todo el contenido editable
2. **`admin.html`**: Interfaz de administración con formularios
3. **`admin.js`**: Lógica del panel de administración
4. **`content-loader.js`**: Script que carga dinámicamente el contenido en las páginas
5. **Páginas HTML**: `index.html`, `nosotros.html`, `servicios.html` con atributos `data-*`

### Flujo de Datos

```
Usuario → admin.html → Edita formularios → admin.js → 
Genera content.json → Usuario sube al servidor → 
content-loader.js lee content.json → Actualiza páginas HTML
```

---

## 🔐 Sistema de Autenticación

### Seguridad Implementada (Nivel 1 - Cliente)

- **Contraseña predeterminada**: `admin123`
- **Almacenamiento**: `localStorage` (navegador)
- **Sesión**: `sessionStorage` (se cierra al cerrar pestaña)

### Limitaciones de Seguridad

⚠️ **IMPORTANTE**: La seguridad actual es básica (lado del cliente). Para producción se recomienda:

1. **Autenticación HTTP**: Proteger `admin.html` con `.htaccess` o similar
2. **Backend real**: Implementar API con Node.js/PHP para guardar cambios
3. **Ocultar admin.html**: No incluir en el sitemap ni menús públicos

---

## 📂 Estructura de Archivos

```
thecommerce/
├── admin.html              # Panel de administración
├── admin.js                # Lógica del panel
├── content.json            # Base de datos de contenido
├── content-loader.js       # Cargador dinámico
├── index.html              # Página principal
├── nosotros.html           # Página Nosotros
├── servicios.html          # Página Servicios
├── direcciones.html        # Página Direcciones
├── cotizaciones.html       # Página Cotizaciones
├── styles.css              # Estilos globales
├── script.js               # Scripts generales
├── calculadora.js          # Calculadora de costos
├── chatbot.js              # Chatbot
├── notifications.js        # Sistema de notificaciones
├── INSTRUCCIONES.md        # Manual de usuario
└── README-TECNICO.md       # Este archivo
```

---

## 🎨 Atributos Data Utilizados

### Atributos para Contenido Dinámico

```html
<!-- Información de contacto -->
<li data-contact="email">📧 email@example.com</li>
<li data-contact="telefono1">📞 (123) 456-7890</li>
<li data-contact="telefono2">📞 (098) 765-4321</li>
<li data-contact="ubicaciones">📍 Ciudad, País</li>

<!-- Hero Section -->
<span data-hero="badge">Badge Text</span>
<h2 data-hero="titulo">Título Principal</h2>
<p data-hero="subtitulo">Subtítulo</p>
<img data-hero="imagen" src="...">
<div data-stat="experiencia">15+</div>
<div data-stat="clientes">500+</div>
<div data-stat="oficinas">3</div>

<!-- Contenedores dinámicos -->
<div data-servicios-grid></div>
<div data-certificaciones-grid></div>
<div data-casos-grid></div>
<div data-testimonios-grid></div>
<div data-servicios-adicionales></div>

<!-- Página Nosotros -->
<p data-nosotros="p1">Párrafo 1</p>
<p data-nosotros="p2">Párrafo 2</p>
<p data-nosotros="p3">Párrafo 3</p>
<p data-nosotros="mision">Misión</p>
<p data-nosotros="vision">Visión</p>
```

---

## 🔧 Funciones Principales

### admin.js

```javascript
// Autenticación
checkAuth()              // Verifica si el usuario está autenticado
handleLogin(e)           // Maneja el inicio de sesión
handleLogout()           // Cierra la sesión

// Gestión de contenido
loadContent()            // Carga content.json
populateForm()           // Llena los formularios con datos
collectFormData()        // Recopila datos de los formularios
saveContent()            // Guarda y descarga content.json

// Navegación
switchTab(tabId)         // Cambia entre pestañas

// Seguridad
changePassword()         // Cambia la contraseña del admin
```

### content-loader.js

```javascript
// Carga principal
loadSiteContent()        // Carga content.json al iniciar
updatePageContent()      // Detecta página actual y actualiza

// Actualizadores por sección
updateContactInfo()      // Actualiza info de contacto
updateHomePage()         // Actualiza página principal
updateServicios()        // Actualiza grid de servicios
updateCertificaciones()  // Actualiza certificaciones
updateCasosExito()       // Actualiza casos de éxito
updateTestimonios()      // Actualiza testimonios
updateNosotrosPage()     // Actualiza página Nosotros
updateServiciosPage()    // Actualiza página Servicios
```

---

## 🚀 Despliegue

### Opción 1: Hosting Estático (Netlify/Vercel)

1. **Crear cuenta** en [Netlify](https://netlify.com) o [Vercel](https://vercel.com)
2. **Conectar repositorio** Git o subir carpeta
3. **Configurar build**:
   - Build command: (ninguno)
   - Publish directory: `/`
4. **Desplegar**

### Opción 2: Wix

**Método A - Wix Code**:
1. Habilitar Wix Code en el sitio
2. Subir archivos a "Public" folder
3. Configurar rutas personalizadas

**Método B - Embed**:
1. Subir sitio a Netlify/Vercel
2. En Wix, agregar elemento "HTML Embed"
3. Insertar iframe con la URL del sitio

### Opción 3: Hosting Tradicional (cPanel)

1. Subir todos los archivos vía FTP
2. Asegurar que `index.html` esté en la raíz
3. Proteger `admin.html` con `.htaccess`:

```apache
<Files "admin.html">
    AuthType Basic
    AuthName "Área Restringida"
    AuthUserFile /path/to/.htpasswd
    Require valid-user
</Files>
```

---

## 🔄 Actualización de Contenido

### Proceso Manual (Actual)

1. Usuario edita en `admin.html`
2. Descarga `content.json`
3. Sube archivo al servidor manualmente
4. Cambios se reflejan al recargar

### Mejora Futura: API Backend

Para automatizar el guardado, implementar:

```javascript
// Ejemplo con Node.js + Express
app.post('/api/save-content', (req, res) => {
    const content = req.body;
    fs.writeFileSync('content.json', JSON.stringify(content, null, 2));
    res.json({ success: true });
});
```

---

## 🐛 Troubleshooting

### Problema: Los cambios no se reflejan

**Solución**:
1. Verificar que `content.json` se haya reemplazado correctamente
2. Limpiar caché del navegador (Ctrl + F5)
3. Verificar consola del navegador (F12) por errores

### Problema: No puedo acceder al admin

**Solución**:
1. Verificar que `admin.html` esté en la raíz del sitio
2. Probar con contraseña predeterminada: `admin123`
3. Si olvidaste la contraseña, eliminar `localStorage`:
   ```javascript
   localStorage.removeItem('adminPassword');
   ```

### Problema: Imágenes no cargan

**Solución**:
1. Verificar que la URL sea válida y termine en `.jpg`, `.png`, etc.
2. Usar URLs HTTPS (no HTTP)
3. Verificar que la imagen no esté bloqueada por CORS

---

## 📊 Estructura de content.json

```json
{
  "sitio": {
    "nombre": "string",
    "email": "string",
    "telefono1": "string",
    "telefono2": "string",
    "ubicaciones": "string"
  },
  "hero": {
    "badge": "string",
    "titulo": "string",
    "tituloDestacado": "string",
    "subtitulo": "string",
    "imagenFondo": "url",
    "estadisticas": {
      "experiencia": "string",
      "clientes": "string",
      "oficinas": "string"
    }
  },
  "servicios": [
    {
      "id": "string",
      "nombre": "string",
      "imagen": "url"
    }
  ],
  "certificaciones": [
    {
      "icono": "emoji",
      "titulo": "string",
      "descripcion": "string"
    }
  ],
  "casosExito": [
    {
      "iniciales": "string",
      "empresa": "string",
      "descripcion": "string",
      "badge": "string",
      "ahorro": "string",
      "envios": "string",
      "color": "blue|cyan|purple"
    }
  ],
  "testimonios": [
    {
      "iniciales": "string",
      "nombre": "string",
      "puesto": "string",
      "testimonio": "string",
      "color": "blue|cyan|purple"
    }
  ],
  "nosotros": {
    "historia": {
      "parrafo1": "string",
      "parrafo2": "string",
      "parrafo3": "string",
      "imagen": "url"
    },
    "mision": "string",
    "vision": "string"
  }
}
```

---

## 🔮 Mejoras Futuras

### Corto Plazo
- [ ] Agregar preview en tiempo real en el admin
- [ ] Validación de URLs de imágenes
- [ ] Botón para agregar/eliminar servicios y testimonios
- [ ] Exportar/importar respaldos

### Mediano Plazo
- [ ] Backend con API REST
- [ ] Autenticación con JWT
- [ ] Historial de cambios (versioning)
- [ ] Editor WYSIWYG para textos largos

### Largo Plazo
- [ ] Multi-idioma
- [ ] Roles de usuario (admin, editor, viewer)
- [ ] Integración con CDN para imágenes
- [ ] Analytics del panel de admin

---

## 📞 Soporte Técnico

Para dudas técnicas o problemas:
- Revisar consola del navegador (F12)
- Verificar que todos los archivos estén en el servidor
- Comprobar que las URLs sean correctas

---

## 📄 Licencia

Este sistema fue desarrollado específicamente para THM Commerce.

**Última actualización**: Diciembre 2025
