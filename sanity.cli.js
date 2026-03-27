import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '0phr0pv8',
    dataset: 'production'
  },
  server: {
    hostname: 'localhost',
    port: 3333
  },
  // This is where you would add your Vercel URL
  // but typically this is configured in the Sanity dashboard
  // for deployment settings
})
