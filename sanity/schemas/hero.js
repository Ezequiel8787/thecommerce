export default {
  title: 'Hero Section',
  name: 'hero',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Título Principal',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      type: 'text',
      title: 'Subtítulo',
      validation: Rule => Rule.required()
    },
    {
      name: 'badge',
      type: 'string',
      title: 'Badge (emoji + texto)',
      description: 'Ej: 🌍 Operando en 3 Continentes'
    },
    {
      name: 'backgroundImage',
      type: 'image',
      title: 'Imagen de Fondo',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo'
        }
      ]
    },
    {
      name: 'ctaButtons',
      type: 'array',
      title: 'Botones CTA',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              type: 'string',
              title: 'Texto del Botón'
            },
            {
              name: 'href',
              type: 'string',
              title: 'URL'
            },
            {
              name: 'style',
              type: 'string',
              title: 'Estilo',
              options: {
                list: [
                  {title: 'Primario (Emerald)', value: 'primary'},
                  {title: 'Secundario (Blue)', value: 'secondary'},
                  {title: 'Terciario (White)', value: 'tertiary'}
                ]
              }
            }
          ]
        }
      ]
    },
    {
      name: 'stats',
      type: 'array',
      title: 'Estadísticas',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              type: 'string',
              title: 'Valor'
            },
            {
              name: 'label',
              type: 'string',
              title: 'Etiqueta'
            }
          ]
        }
      ]
    }
  ]
}