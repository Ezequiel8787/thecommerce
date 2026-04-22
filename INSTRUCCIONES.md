# 📖 Manual de Usuario - Panel de Administración THM Company

## 🎯 ¿Qué es esto?

Este es un sistema que te permite **editar todo el contenido de tu sitio web sin tocar código**. Puedes cambiar textos, imágenes, precios, testimonios y más desde un panel visual muy fácil de usar.

---

## 🚀 Cómo Acceder al Panel

1. **Abre tu navegador** (Chrome, Firefox, Edge, etc.)
2. **Ve a la carpeta de tu sitio web** y abre el archivo: `admin.html`
   - O si ya está publicado en internet: `https://tusitio.com/admin.html`

3. **Ingresa la contraseña**
   - **Primera vez**: La contraseña es `admin123`
   - **IMPORTANTE**: Cámbiala inmediatamente después de entrar (ver sección "Cambiar Contraseña")

---

## 📝 Cómo Editar el Contenido

### Paso 1: Iniciar Sesión
- Abre `admin.html`
- Escribe la contraseña
- Haz clic en "Acceder"

### Paso 2: Activar Vista Previa en Vivo 👁️
**¡NUEVA FUNCIONALIDAD SÚPER COOL!**
- Verás un botón flotante morado en la esquina inferior derecha: **"👁️ Ver Preview"**
- Haz clic para abrir el panel de vista previa
- **Ahora edita cualquier campo** y verás los cambios **EN TIEMPO REAL** 🎨
- ¡Es como magia! Los cambios aparecen al instante mientras escribes

### Paso 3: Navegar por las Secciones
El panel tiene **7 pestañas** en la parte superior. Cada pestaña tiene un **indicador 📍** que te dice dónde aparece esa información en el sitio web:

1. **📋 Información General**: Email, teléfonos, ubicaciones (aparece en todas las páginas)
2. **🎯 Página Principal**: Título, subtítulo, estadísticas (primera sección del sitio)
3. **🚚 Servicios**: Nombres e imágenes de servicios (página principal y página de servicios)
4. **⭐ Casos de Éxito**: Historias de clientes exitosos (página principal)
5. **💬 Testimonios**: Opiniones de clientes (página principal)
6. **👥 Nosotros**: Historia, misión y visión (página "Nosotros")
7. **🔒 Seguridad**: Cambiar contraseña

### Paso 3: Editar Información
1. **Haz clic en la pestaña** que quieres editar
2. **Lee el indicador 📍** para saber dónde aparece esa información
3. **Modifica los campos** que necesites cambiar
4. **Verás vista previa** de las imágenes automáticamente
5. **Haz clic en "💾 Guardar Cambios"** (botón verde arriba a la derecha)

### Paso 3.1: Agregar o Eliminar Servicios
En la pestaña **🚚 Servicios**:
- **Agregar**: Haz clic en el botón verde "Agregar Servicio"
- **Eliminar**: Haz clic en el ícono de basura 🗑️ junto al servicio
- **Editar**: Cambia el nombre o la imagen directamente
- **Vista previa**: Verás cómo se ve la imagen antes de guardar

### Paso 4: Aplicar los Cambios
Cuando hagas clic en "Guardar Cambios":
1. Se descargará un archivo llamado `content.json`
2. **Reemplaza el archivo viejo** `content.json` en tu sitio web con este nuevo
3. Los cambios se verán **inmediatamente** en el sitio web

---

## 🖼️ Cómo Cambiar Imágenes

¡Ahora es súper fácil! Tienes **3 formas** de agregar imágenes:

### Opción 1: Arrastrar y Soltar (Drag & Drop) 🎯
1. **Descarga** una imagen a tu computadora
2. **Arrastra** la imagen directamente al campo de imagen en el panel
3. **¡Listo!** La imagen se cargará automáticamente
4. Verás un **preview** de la imagen debajo del campo

### Opción 2: Pegar Link Directamente (Ctrl+V) 📋
1. Ve a [Unsplash.com](https://unsplash.com) o cualquier sitio de imágenes
2. Busca la imagen que quieras (ej: "logistics", "shipping", "warehouse")
3. Haz clic derecho → "Copiar dirección de imagen"
4. **Haz clic en el campo** de imagen en el panel
5. **Pega** con Ctrl+V (o Cmd+V en Mac)
6. La imagen aparecerá automáticamente en el preview

### Opción 3: Copiar y Pegar Imagen Directamente 🖼️
1. Haz clic derecho en cualquier imagen de internet
2. Selecciona "Copiar imagen"
3. Haz clic en el campo de imagen del panel
4. Pega con Ctrl+V
5. La imagen se convertirá automáticamente

### Opción 4: Escribir URL Manualmente
1. Copia la URL completa de la imagen
2. Escríbela o pégala en el campo
3. La imagen se validará automáticamente

**💡 Tips Importantes**:
- Verás un **preview** de la imagen antes de guardar
- Si la imagen no es válida, te aparecerá una advertencia
- Para imágenes grandes, considera subirlas a [Imgur.com](https://imgur.com) primero
- Las URLs de imágenes suelen terminar en `.jpg`, `.png`, `.webp` o `.gif`

---

## 🔒 Cambiar tu Contraseña (MUY IMPORTANTE)

1. Haz clic en la pestaña **"🔒 Seguridad"**
2. Ingresa tu contraseña actual
3. Escribe tu nueva contraseña (mínimo 6 caracteres)
4. Confirma la nueva contraseña
5. Haz clic en "Cambiar Contraseña"

**⚠️ IMPORTANTE**: 
- Guarda tu contraseña en un lugar seguro
- NO compartas el link de `admin.html` con nadie
- Si olvidas tu contraseña, contacta al desarrollador

---

## 📤 Cómo Publicar en Wix

### Método 1: Usando Wix Code (Recomendado)
1. En Wix, ve a **"Configuración" → "Archivos del Sitio"**
2. Sube todos los archivos de tu sitio:
   - `index.html`
   - `nosotros.html`
   - `servicios.html`
   - `direcciones.html`
   - `cotizaciones.html`
   - `content.json` (el archivo con tu contenido)
   - Todos los archivos `.js` y `.css`
3. Configura la página principal para que cargue `index.html`

### Método 2: Hosting Externo + Embed en Wix
1. Sube tu sitio a **Netlify** o **Vercel** (gratis):
   - [Netlify.com](https://www.netlify.com)
   - [Vercel.com](https://vercel.com)
2. Copia la URL que te dan
3. En Wix, agrega un elemento **"HTML Embed"**
4. Pega un iframe con tu sitio:
   ```html
   <iframe src="https://tu-sitio.netlify.app" width="100%" height="100%" frameborder="0"></iframe>
   ```

---

## ❓ Preguntas Frecuentes

### ¿Qué pasa si me equivoco al editar?
- No te preocupes, siempre puedes volver a editar
- Guarda una copia del archivo `content.json` original como respaldo

### ¿Los cambios son inmediatos?
- Sí, una vez que reemplaces el archivo `content.json` y recargues la página

### ¿Puedo agregar más servicios o testimonios?
- **SÍ**, ahora puedes agregar y eliminar servicios desde el panel
- Ve a la pestaña "🚚 Servicios" y haz clic en "Agregar Servicio"
- Para eliminar un servicio, haz clic en el ícono de basura (🗑️)

### ¿Necesito saber programación?
- **NO**, todo es visual y con formularios simples

### ¿Funciona en celular?
- El panel funciona mejor en computadora
- El sitio web sí se ve perfecto en celular

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa que hayas guardado los cambios correctamente
2. Verifica que hayas reemplazado el archivo `content.json`
3. Recarga la página con **Ctrl + F5** (Windows) o **Cmd + Shift + R** (Mac)
4. Si el problema persiste, contacta al desarrollador

---

## 📋 Lista de Archivos Importantes

- **`admin.html`**: Panel de administración (NO COMPARTIR)
- **`content.json`**: Archivo con todo el contenido editable
- **`index.html`**: Página principal del sitio
- **`nosotros.html`**: Página "Nosotros"
- **`servicios.html`**: Página de servicios
- **`content-loader.js`**: Script que carga el contenido (no tocar)

---

## ✅ Checklist Antes de Publicar

- [ ] He cambiado la contraseña predeterminada
- [ ] He revisado todos los textos y no hay errores
- [ ] He probado todas las imágenes y se ven bien
- [ ] He guardado una copia de respaldo de `content.json`
- [ ] He subido el archivo `content.json` actualizado al servidor
- [ ] He probado el sitio en celular y computadora

---

## 🎉 ¡Listo!

Ahora puedes editar tu sitio web cuando quieras sin necesidad de un programador. Si tienes dudas, no dudes en preguntar.

**Última actualización**: Diciembre 2025
