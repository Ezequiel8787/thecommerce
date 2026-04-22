import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemas'

export default defineConfig({
  projectId: '0phr0pv8',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('THM Company Content')
          .items([
            S.listItem()
              .title('🏠 Página Principal')
              .child(
                S.list()
                  .title('Secciones Principal')
                  .items([
                    S.documentTypeListItem('hero').title('🎯 Hero Section'),
                    S.documentTypeListItem('servicios').title('🛠️ Servicios'),
                    S.documentTypeListItem('about').title('📖 Acerca de'),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title('📊 Estadísticas y Analytics')
              .child(
                S.document()
                  .title('Analytics Dashboard')
                  .documentId('analytics')
                  .schema({
                    type: 'object',
                    name: 'analytics',
                    fields: [
                      {
                        name: 'visits',
                        type: 'number',
                        title: 'Visitas Totales',
                      },
                      {
                        name: 'conversions',
                        type: 'number',
                        title: 'Conversiones',
                      },
                      {
                        name: 'lastUpdated',
                        type: 'datetime',
                        title: 'Última Actualización',
                        initialValue: () => new Date().toISOString(),
                      },
                    ],
                  })
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
