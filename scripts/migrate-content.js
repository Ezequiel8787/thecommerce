import dotenv from 'dotenv';
import path from 'path';

// Load .env.local (or .env) manually
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import {client} from '../sanity/lib/sanity.js'
import fs from 'fs'

// Cargar variables de entorno
dotenv.config()

// Leer contenido actual
const currentContent = JSON.parse(fs.readFileSync('./content.json', 'utf8'))

async function migrateContent() {
  try {
    console.log('🚀 Iniciando migración a Sanity...')
    
    // Migrar Hero
    if (currentContent.hero) {
      const heroDoc = {
        _type: 'hero',
        title: currentContent.hero.titulo || 'Título Principal',
        subtitle: currentContent.hero.subtitulo || 'Subtítulo',
        badge: currentContent.hero.badge || '🌍 Operando en 3 Continentes',
        backgroundImage: {
          _type: 'image',
          asset: {
            _ref: 'image-temp-ref', // Placeholder hasta subir imagen
            _type: 'reference'
          }
        },
        stats: [
          {
            value: currentContent.hero.estadisticas.experiencia || '15+',
            label: currentContent.hero.estadisticas.experienciaTexto || 'Años de Experiencia'
          },
          {
            value: currentContent.hero.estadisticas.clientes || '500+',
            label: currentContent.hero.estadisticas.clientesTexto || 'Clientes Satisfechos'
          },
          {
            value: currentContent.hero.estadisticas.oficinas || '3',
            label: currentContent.hero.estadisticas.oficinasTexto || 'Oficinas Globales'
          }
        ],
        ctaButtons: [
          {
            text: 'Calcular Costo Ahora',
            href: '#',
            style: 'primary'
          },
          {
            text: 'Solicitar Cotización',
            href: 'cotizaciones.html',
            style: 'secondary'
          }
        ]
      }
      
      const heroResult = await client.create(heroDoc)
      console.log('✅ Hero migrado:', heroResult._id)
    }
    
    // Migrar Servicios
    if (currentContent.servicios && currentContent.servicios.length > 0) {
      const serviciosDoc = {
        _type: 'servicios',
        title: 'Nuestros Servicios',
        subtitle: 'Soluciones integrales para tu cadena de suministro',
        services: currentContent.servicios.map(servicio => ({
          name: servicio.nombre,
          description: `Descripción de ${servicio.nombre}`,
          icon: '📦',
          features: ['Característica 1', 'Característica 2', 'Característica 3']
        }))
      }
      
      const serviciosResult = await client.create(serviciosDoc)
      console.log('✅ Servicios migrados:', serviciosResult._id)
    }
    
    // Crear documento About básico
    const aboutDoc = {
      _type: 'about',
      title: 'Acerca de THM Commerce',
      description: 'Tu socio estratégico en importaciones internacionales',
      mission: 'Facilitar el comercio internacional para empresas',
      vision: 'Ser el líder en soluciones logísticas',
      values: [
        {
          title: 'Confianza',
          description: 'Construyendo relaciones duraderas'
        },
        {
          title: 'Eficiencia',
          description: 'Procesos optimizados para mejores resultados'
        }
      ],
      team: []
    }
    
    const aboutResult = await client.create(aboutDoc)
    console.log('✅ About migrado:', aboutResult._id)
    
    console.log('🎉 Migración completada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error en migración:', error)
  }
}

migrateContent()
