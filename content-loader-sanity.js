import {client} from '../sanity/lib/sanity.js'
import fs from 'fs'
import path from 'path'

// Modo: 'sanity' o 'local'
const MODE = 'local' // Cambiar a 'sanity' cuando tengas token válido

// Cargar datos locales como fallback
function loadLocalData(type) {
  try {
    const filePath = path.join(process.cwd(), 'sanity-data', `${type}.json`)
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }
  } catch (error) {
    console.warn(`No se pudo cargar ${type}.json local:`, error.message)
  }
  return null
}

// Fetch desde Sanity con fallback local
async function fetchWithFallback(type, query = `*[_type == "${type}"][0]`) {
  if (MODE === 'sanity') {
    try {
      const data = await client.fetch(query)
      if (data) return data
    } catch (error) {
      console.warn(`Error fetching ${type} from Sanity:`, error.message)
    }
  }
  
  // Fallback a datos locales
  return loadLocalData(type)
}

// Funciones de carga de contenido
export async function loadHeroContent() {
  const hero = await fetchWithFallback('hero')
  if (hero) {
    // Mapear datos al formato esperado por el frontend
    return {
      badge: hero.badge || '🌍 Operando en 3 Continentes',
      titulo: hero.title || 'Título Principal',
      tituloDestacado: hero.title?.split(' ').pop() || 'Mundo',
      subtitulo: hero.subtitle || 'Subtítulo',
      imagenFondo: hero.backgroundImage?.asset?._ref ? 
        `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID || '0phr0pv8'}/production/${hero.backgroundImage.asset._ref.split('-')[1]}-${hero.backgroundImage.asset._ref.split('-')[2]}.${hero.backgroundImage.asset._ref.split('-')[3]}` :
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80',
      estadisticas: hero.stats?.reduce((acc, stat, index) => {
        const keys = ['experiencia', 'clientes', 'oficinas']
        const textKeys = ['experienciaTexto', 'clientesTexto', 'oficinasTexto']
        if (keys[index]) {
          acc[keys[index]] = stat.value
          acc[textKeys[index]] = stat.label
        }
        return acc
      }, {}) || {
        experiencia: '15+',
        experienciaTexto: 'Años de Experiencia',
        clientes: '500+',
        clientesTexto: 'Clientes Satisfechos',
        oficinas: '3',
        oficinasTexto: 'Oficinas Globales'
      }
    }
  }
  return null
}

export async function loadServiciosContent() {
  const servicios = await fetchWithFallback('servicios')
  if (servicios) {
    return {
      title: servicios.title || 'Nuestros Servicios',
      subtitle: servicios.subtitle || 'Soluciones integrales para tu cadena de suministro',
      servicios: servicios.services?.map(serv => ({
        id: serv.name?.toLowerCase().replace(/\s+/g, '-') || 'servicio',
        nombre: serv.name || 'Servicio',
        descripcion: serv.description || 'Descripción del servicio',
        imagen: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80',
        caracteristicas: serv.features || []
      })) || []
    }
  }
  return null
}

export async function loadAboutContent() {
  const about = await fetchWithFallback('about')
  if (about) {
    return {
      title: about.title || 'Acerca de THM Commerce',
      description: about.description || 'Descripción',
      mission: about.mission || 'Misión',
      vision: about.vision || 'Visión',
      values: about.values || [],
      team: about.team || []
    }
  }
  return null
}

// Función principal para cargar todo el contenido
export async function loadAllContent() {
  try {
    const [hero, servicios, about] = await Promise.all([
      loadHeroContent(),
      loadServiciosContent(),
      loadAboutContent()
    ])

    return {
      hero,
      servicios: servicios?.servicios || [],
      about,
      sitio: {
        nombre: 'THM Commerce',
        email: 'thmlogisticsimports@gmail.com',
        telefono1: '(614) 219-0607',
        telefono2: '(614) 152-6240',
        ubicaciones: 'Chihuahua, El Paso, Shenzhen'
      }
    }
  } catch (error) {
    console.error('Error loading content:', error)
    return null
  }
}

// Función para actualizar contenido (solo con Sanity)
export async function updateContent(type, data) {
  if (MODE === 'sanity') {
    try {
      const result = await client.createOrUpdate({
        _type: type,
        ...data
      })
      return result
    } catch (error) {
      console.error(`Error updating ${type}:`, error)
      return null
    }
  } else {
    // Guardar localmente
    const filePath = path.join(process.cwd(), 'sanity-data', `${type}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return data
  }
}

console.log(`🔧 Content loader iniciado en modo: ${MODE}`)
