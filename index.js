'use strict'

const crumb = require('crumb')
const blankie = require('blankie')
const good = require('good')
const handlerbars = require('./lib/helpers')
const hapiDevErrors = require('hapi-dev-errors')
const Hapi = require('hapi')
const inert = require('inert')//permite agregar un archivo como ruta
const path = require('path')//para agregar la ruta de forma mas segura
const vision = require('vision')
const routes = require('./routes')//he creado el archivo rutas
const site = require('./controllers/site')
const methods = require('./lib/methods')
const scooter = require('@hapi/scooter')


handlerbars.registerHelper('answerNumber', (answers) => {/**contar el numero de las respuestas */
  const keys = Object.keys(answers)
  return keys.length/**numero de respuestas que ya tiene el objeto */
})

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
    await server.register({/* */
      plugin: good,
      options: {
        reporters: {/*imprimir en consola */
          console: [
            {
              module: 'good-console'
            },
            'stdout'//salida estandard
          ]
        }
      }
    })

    await server.register({
      plugin: crumb,
      options: {
        cookieOptions: {
          isSecure: process.env.NODE_ENV === 'prod'
        }
      }
    })

    await server.register([scooter, {
      plugin: blankie,
      options: {
        defaultSrc: `'self' 'unsafe-inline'`,
        styleSrc: `'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com`,
        fontSrc: `'self' 'unsafe-inline' data:`,
        scriptSrc: `'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com/ https://code.jquery.com/`,
        generateNonces: false
      }
    }])

    await server.register({
      plugin: require('./lib/api'),
      options: {
        prefix: 'api'
      }
    })

    await server.register({
      plugin: hapiDevErrors,
      options: {
        showErrors: process.env.NODE_ENV !== 'prod'
      }
    })
    
    
    server.method('setAnswerRight', methods.setAnswerRight)/**registrar con el nombre, el metodo de servidor registrado en los requires */
    server.method('getLast', methods.getLast, {
      cache: {/**cacheando el resultado de home por un minuto */
        expiresIn: 1000 * 60,
        generateTimeout: 2000
      }
    })

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

  server.log('info', `Servidor lanzado en: ${server.info.uri}`)
}

process.on('unhandledRejection', error => {//recibe todas las promesas no controladas
  server.log('UnhandledRejection', error)
})

process.on('unhandledException', error => {//error general de todo el sistema
  server.log('unhandledException', error)
})

init()