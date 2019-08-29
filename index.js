'use strict'

const Hapi = require('hapi')
const inert = require('inert')//permite agregar un archivo como ruta
const path = require('path')//para agregar la ruta de forma mas segura
const handlerbars = require('handlebars')
const vision = require('vision')
const routes = require('./routes')//he creado el archivo rutas
const site = require('./controllers/site')

// se conecta el servidor al puerto que elijamos
const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'public')// se usa path para no tener que especificar la ruta, mejorando la seguridad
    }
  }
})

//inicialización del servidor
async function init () {
  try {
    await server.register(inert)//siempre que se use inert=h.file hay que registrarlo por que no quda local
    await server.register(vision)//tambien vision es un plugin, tambien hay que registrar
    /**Inicio de Cookie */
    server.state('user', {//se pone obligatoriamente para activar una cookie
      ttl: 1000 * 60 * 60 * 24 * 7,//la sesion durara abierta por 7 dias
      isSecure: process.env.NODE_ENV === 'prod',//el enviroment es de producción es seguro si es desarrollo
      encoding: 'base64json',//hay que ponerlo
      path:'/'
    })

    server.views({
      engines: {
        hbs: handlerbars},//hbs como handelbars, tipo de motor de plantillas
      relativeTo: __dirname,//se envia al directorio actual
      path: 'views',
      layout: true,//no hay que repetir los mismo pedasos de html en todas las vistas
      layoutPath: 'views'
    })
    
    
    server.ext('onPreResponse', site.fileNotFound)/**ext= escucha el lifeCicle, onPreResponse= antes de que se envie la 
    respuestas analice si se actifa el controlador filenotfound */
    server.route(routes)//route quiere decir que la ruta que va a usar el sevidor son las que estan al el archivo routes
    

    await server.start()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  console.log(`Servidor lanzado en: ${server.info.uri}`)
}

process.on('unhandledRejection', error => {//recibe todas las promesas no controladas
  console.error('UnhandledRejection', error.message, error)// 
})

process.on('unhandledException', error => {//error general de todo el sistema
  console.error('unhandledException', error.message, error)
})

init()