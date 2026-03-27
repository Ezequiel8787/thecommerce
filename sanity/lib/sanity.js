import {createClient} from '@sanity/client'

// Configurar para ignorar certificados SSL en entorno corporativo
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

export const client = createClient({
  projectId: '0phr0pv8', // Temporal: hardcoded para testing
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-01',
  // Token de API para permisos de escritura
  token: process.env.SANITY_API_TOKEN || 'sk_aqui_va_tu_token',
  // Ignorar certificados para entorno corporativo
  ignoreBrowserTokenWarning: true,
})

// Helper para imágenes
import imageUrlBuilder from '@sanity/image-url'
const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)