export default {
  title: 'Servicios',
  name: 'servicios',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Título de la Sección',
      validation: Rule => Rule.required()
    },
    {
      name: 'subtitle',
      type: 'text',
      title: 'Subtítulo'
    },
    {
      name: 'services',
      type: 'array',
      title: 'Lista de Servicios',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Nombre del Servicio',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              type: 'text',
              title: 'Descripción',
              validation: Rule => Rule.required()
            },
            {
              name: 'icon',
              type: 'string',
              title: 'Icono (SVG o emoji)'
            },
            {
              name: 'features',
              type: 'array',
              title: 'Características',
              of: [{type: 'string'}]
            }
          ]
        }
      ]
    }
  ]
}