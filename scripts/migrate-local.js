import fs from 'fs'

// Leer contenido actual
const currentContent = JSON.parse(fs.readFileSync('./content.json', 'utf8'))

async function migrateToLocal() {
  try {
    console.log('🚀 Creando estructura local para Sanity...')
    
    // Crear directorio para datos locales
    if (!fs.existsSync('./sanity-data')) {
      fs.mkdirSync('./sanity-data')
    }
    
    // Migrar Hero
    if (currentContent.hero) {
      const heroDoc = {
        _id: 'hero-main',
        _type: 'hero',
        title: currentContent.hero.titulo || 'Título Principal',
        subtitle: currentContent.hero.subtitulo || 'Subtítulo',
        badge: currentContent.hero.badge || '🌍 Operando en 3 Continentes',
        backgroundImage: {
          _type: 'image',
          asset: {
            _ref: 'image-temp-ref',
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
      
      fs.writeFileSync('./sanity-data/hero.json', JSON.stringify(heroDoc, null, 2))
      console.log('✅ Hero guardado localmente')
    }
    
    // Migrar Servicios
    if (currentContent.servicios && currentContent.servicios.length > 0) {
      const serviciosDoc = {
        _id: 'servicios-main',
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
      
      fs.writeFileSync('./sanity-data/servicios.json', JSON.stringify(serviciosDoc, null, 2))
      console.log('✅ Servicios guardados localmente')
    }
    
    // Crear documento About básico
    const aboutDoc = {
      _id: 'about-main',
      _type: 'about',
      title: 'Acerca de THM Company',
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
    
    fs.writeFileSync('./sanity-data/about.json', JSON.stringify(aboutDoc, null, 2))
    console.log('✅ About guardado localmente')
    
    console.log('🎉 Migración local completada!')
    console.log('📁 Datos guardados en ./sanity-data/')
    
  } catch (error) {
    console.error('❌ Error en migración local:', error)
  }
}

migrateToLocal()
