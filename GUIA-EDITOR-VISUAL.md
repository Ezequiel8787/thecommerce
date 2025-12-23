# 🎨 Guía del Editor Visual Tipo Wix

## 🚀 ¿Qué es el Editor Visual?

Es un sistema de edición **WYSIWYG** (What You See Is What You Get) que te permite editar tu sitio web **directamente en el contenido**, igual que Wix, sin tocar código.

---

## ✨ Funcionalidades Principales

### **1. Modo Edición Visual** ✏️
- Botón flotante rosa/morado: **"✏️ Modo Edición"**
- Al activarlo, TODOS los elementos se vuelven editables
- Haz clic en cualquier texto, imagen o elemento
- Se resalta con un borde morado cuando lo seleccionas

### **2. Editar Textos** 📝
- **Clic en cualquier texto** (títulos, párrafos, botones)
- Aparece un editor de texto
- Escribe el nuevo contenido
- Clic en "✅ Aplicar"
- **¡Listo!** El cambio se ve al instante

### **3. Cambiar Colores** 🎨
- Selecciona un elemento de texto
- Clic en **"🎨 Cambiar Color"**
- Opciones:
  - **Selector de color** para texto
  - **Selector de color** para fondo
  - **12 colores rápidos** predefinidos
- Los cambios se aplican inmediatamente

### **4. Cambiar Imágenes** 🖼️
- Haz clic en cualquier imagen
- Clic en **"🖼️ Cambiar Imagen"**
- Opciones:
  - **Arrastra** una imagen desde tu computadora
  - **Pega una URL** de imagen
  - Se actualiza al instante

### **5. Guardar Cambios** 💾
- Botón **"💾 Guardar Cambios"** en la barra de herramientas
- O presiona **Ctrl + S**
- Se guarda todo automáticamente
- ¡Confetti de celebración! 🎉

---

## 🎯 Cómo Usar el Editor Visual

### **Paso 1: Activar Modo Edición**
1. Abre la página de demostración: `editor-demo.html`
2. Verás un botón flotante rosa en la esquina: **"✏️ Modo Edición"**
3. Haz clic para activar
4. Aparece un mensaje de bienvenida con instrucciones

### **Paso 2: Seleccionar Elemento**
1. **Pasa el mouse** sobre cualquier elemento
2. Se resalta con un borde morado punteado
3. **Haz clic** para seleccionarlo
4. El borde se vuelve sólido
5. Aparece una notificación: "✨ [ELEMENTO] seleccionado"

### **Paso 3: Editar**
**Para Textos:**
- Botón **"✏️ Editar Texto"** se activa
- Clic → Aparece editor
- Escribe → Aplica

**Para Colores:**
- Botón **"🎨 Cambiar Color"** se activa
- Clic → Aparece selector
- Elige color → Aplica

**Para Imágenes:**
- Botón **"🖼️ Cambiar Imagen"** se activa
- Clic → Aparece uploader
- Arrastra o pega → Aplica

### **Paso 4: Guardar**
- Clic en **"💾 Guardar Cambios"**
- O presiona **Ctrl + S**
- ¡Listo!

---

## 🎮 Atajos de Teclado

- **Ctrl + S**: Guardar cambios
- **Esc**: Deseleccionar elemento actual
- **Clic en elemento**: Seleccionar
- **Hover**: Vista previa de selección

---

## Características Visuales

### **Selección de Elementos:**
- **Hover**: Borde morado punteado
- **Clic**: Borde morado sólido (seleccionado)
- **Menú flotante**: Aparece automáticamente sobre el elemento
- **Notificación**: " [ELEMENTO] seleccionado"
- **Esc**: Deseleccionar

### **Menú Flotante de Edición:**
Cuando seleccionas un elemento, aparece un **menú flotante morado** justo encima con botones de acción rápida:

**Para Textos:**
- **Editar** - Edita el texto directamente (inline)
- **Color** - Cambia colores

**Para Imágenes:**
- **Cambiar Imagen** - Arrastra o pega nueva imagen

### **Barra de Herramientas:**
- Posición: Esquina superior derecha
- Siempre visible en modo edición
- Botones se activan según el elemento seleccionado

### **Botones Contextuales:**
- **Deshabilitados** (gris) cuando no aplican
- **Activos** (color) cuando puedes usarlos
- **Hover** para ver efecto de escala

---

## 🛡️ Protecciones Implementadas

### **No Modifica el Layout:**
- ✅ Solo edita contenido (textos, colores, imágenes)
- ❌ NO permite mover elementos
- ❌ NO permite cambiar estructura
- ❌ NO permite eliminar secciones

### **Elementos Protegidos:**
- Barra de herramientas del editor
- Botones del sistema
- Overlays y modales

### **Validaciones:**
- URLs de imágenes válidas
- Colores en formato correcto
- Textos no vacíos

---

## 📋 Elementos Editables

### **Textos:**
- ✅ Títulos (h1, h2, h3, h4, h5, h6)
- ✅ Párrafos (p)
- ✅ Spans
- ✅ Enlaces (a)
- ✅ Botones (button)

### **Imágenes:**
- ✅ Todas las imágenes (img)
- ✅ Fondos de sección (próximamente)

### **Colores:**
- ✅ Color de texto
- ✅ Color de fondo
- ✅ 12 colores predefinidos

---

## 🎯 Casos de Uso

### **Caso 1: Cambiar Título Principal**
1. Activa modo edición
2. Clic en el título grande
3. Clic en "✏️ Editar Texto"
4. Escribe nuevo título
5. Aplica y guarda

### **Caso 2: Cambiar Color de un Botón**
1. Activa modo edición
2. Clic en el botón
3. Clic en "🎨 Cambiar Color"
4. Selecciona color de texto y fondo
5. Aplica y guarda

### **Caso 3: Actualizar Imagen de Servicio**
1. Activa modo edición
2. Clic en la imagen
3. Clic en "🖼️ Cambiar Imagen"
4. Arrastra nueva imagen o pega URL
5. Aplica y guarda

### **Caso 4: Edición Rápida de Múltiples Elementos**
1. Activa modo edición
2. Edita elemento 1 → No guardes aún
3. Edita elemento 2 → No guardes aún
4. Edita elemento 3 → No guardes aún
5. Guarda TODO de una vez con Ctrl + S

---

## 🔧 Integración con Sistema Actual

### **Compatible con:**
- ✅ Panel de administración (`admin.html`)
- ✅ Sistema de preview en vivo
- ✅ Guardado con confetti
- ✅ Notificaciones animadas
- ✅ Drag & drop de imágenes

### **Archivos del Sistema:**
- `visual-editor.js` - Editor visual completo
- `editor-demo.html` - Página de demostración
- `admin.html` - Panel con editor integrado

---

## 💡 Tips y Trucos

### **Para la Administradora:**
1. **Usa el modo edición** para cambios rápidos visuales
2. **Usa el panel de admin** para cambios estructurales
3. **Combina ambos** para máxima eficiencia
4. **Guarda frecuentemente** con Ctrl + S

### **Mejores Prácticas:**
- ✅ Edita un elemento a la vez
- ✅ Revisa el preview antes de guardar
- ✅ Usa colores consistentes con la marca
- ✅ Prueba en diferentes dispositivos

### **Evita:**
- ❌ Editar elementos del sistema (barras, botones del editor)
- ❌ Usar colores muy brillantes o difíciles de leer
- ❌ Cambiar muchas cosas sin guardar

---

## 🎉 Ventajas del Editor Visual

### **Vs Panel Tradicional:**
- ⚡ **Más rápido**: Editas directamente
- 👁️ **Visual**: Ves los cambios al instante
- 🎨 **Intuitivo**: Como usar Wix o Canva
- 🎯 **Preciso**: Seleccionas exactamente lo que quieres editar

### **Vs Editar Código:**
- 🚫 **Sin código**: Cero conocimientos técnicos
- 🎨 **Visual**: Todo con clicks
- 🛡️ **Seguro**: No puedes romper el layout
- ✨ **Divertido**: Efectos visuales y animaciones

---

## 🚀 Próximas Mejoras (Futuro)

- [ ] Editar fondos de secciones
- [ ] Deshacer/Rehacer cambios (Ctrl + Z)
- [ ] Historial de cambios
- [ ] Modo responsive (editar para móvil)
- [ ] Copiar estilos entre elementos
- [ ] Biblioteca de colores de la marca
- [ ] Plantillas predefinidas

---

## 📞 Soporte

Si tienes dudas:
1. Revisa esta guía
2. Prueba en `editor-demo.html` primero
3. Usa el modo edición sin miedo (no rompe nada)
4. Guarda frecuentemente

---

## ✅ Checklist de Uso

Antes de empezar:
- [ ] Abre `editor-demo.html` o `admin.html`
- [ ] Activa modo edición
- [ ] Lee el mensaje de bienvenida
- [ ] Prueba seleccionar un elemento
- [ ] Prueba editar texto
- [ ] Prueba cambiar color
- [ ] Prueba cambiar imagen
- [ ] Guarda los cambios

---

**¡Disfruta editando tu sitio como un profesional!** 🎨✨

**Última actualización**: Diciembre 2025
