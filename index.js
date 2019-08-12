'use strict'

const Hapi = require('hapi')
const inert = require('inert')//permite agregar un archivo como ruta
const path = require('path')//para agregar la ruta de forma mas segura

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')
    }
  }
})

async function init () {
  try {
    await server.register(inert)//siempre que se use inert=h.file hay que registrarlo por que no quda local

    server.route({
      method: 'GET',
      path: '/home',
      handler: (req, h) => {
        return h.file('index.html')//h.file= el archivo del html
      }
    })

    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',// directorio public que ya lo elegimos antes
          index: ['index.html']
        }
      }
    })

    await server.start()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  console.log(`Servidor lanzado en: ${server.info.uri}`)
}

init()