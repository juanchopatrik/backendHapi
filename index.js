'use strict'

const Hapi = require('hapi')
const inert = require('inert')//permite agregar un archivo como ruta
const path = require('path')//para agregar la ruta de forma mas segura
const handlerbars = require('handlebars')
const vision = require('vision')

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
    await server.register(vision)//tambien vision es un plugin, tambien hay que registrar

    server.views({
      engines: {//tipo de motor de plantillas
        hbs: handlerbars},//hbs como handelbars, 
      relativeTo: __dirname,//se envia al directorio actual
      path: 'views',
      layout: true,//no hay que repetir los mismo pedasos de html en todas las vistas
      layoutPath: 'views'
    })
    
    server.route({
      method: 'GET',
      path: '/',
      handler: (req, h) => {
        //return h.file('index.html')//h.file= el archivo del html en este se usa innert
        return h.view('index', {//h.view= sigifica la vista es lo que esta en el archivo index de views
          title: 'home'// es la variable que esta en el archivo layout
        })
      
      }
    })

    server.route({
      method: 'GET',
      path: '/register',
      handler: (req, h) => {
        return h.view('register', {//
          title: 'Registro'
        })
      }
    })

    server.route({
      method: 'POST',//envia datos al servidor
      path: '/create-user',
      handler: (req, h) => {
        console.log(req.payload)//obtiene los datos de metho=post de la ruta/create-user
        return 'Usuario creado'
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