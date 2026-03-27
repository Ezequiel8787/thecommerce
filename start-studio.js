#!/usr/bin/env node

import {createRequire} from 'module'
const require = createRequire(import.meta.url)

// Configurar para ignorar certificados SSL en entorno corporativo
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Iniciar Sanity Studio
require('@sanity/cli/lib/cli')
