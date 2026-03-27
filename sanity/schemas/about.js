export default {
  title: 'Acerca de',
  name: 'about',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Título',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      type: 'text',
      title: 'Descripción Principal',
      validation: Rule => Rule.required()
    },
    {
      name: 'mission',
      type: 'text',
      title: 'Misión'
    },
    {
      name: 'vision',
      type: 'text',
      title: 'Visión'
    },
    {
      name: 'values',
      type: 'array',
      title: 'Valores',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Valor'
            },
            {
              name: 'description',
              type: 'text',
              title: 'Descripción'
            }
          ]
        }
      ]
    },
    {
      name: 'team',
      type: 'array',
      title: 'Equipo',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Nombre'
            },
            {
              name: 'position',
              type: 'string',
              title: 'Cargo'
            },
            {
              name: 'photo',
              type: 'image',
              title: 'Foto'
            }
          ]
        }
      ]
    }
  ]
}