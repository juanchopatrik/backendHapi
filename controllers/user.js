'use strict'

const Boom = require('boom')
const users = require('../models/index').users// importo toda la propiedad users

async function createUser (req, h) {
  let result// es un proceso asincrono
  try {
    result = await users.create(req.payload)// verifica que se cree el usario y recibe los parametros en el payload
  } catch (error) {
    console.error(error)
    return h.view('register', {//view es como se constesta con vista
      title: 'Registro',
      error: 'Error creando el usuario'
    })
  }

  return h.view('register', {//se implementa nueva vista, register es la varible que debe ingresar en la plantilla de hbs
    title: 'Registro',
    success: 'Usuario creado exitosamente'
  })
  }
  
  function logout (req, h) {
    return h.redirect('/login').unstate('user')//se redicciona al login y unstate remueve la cookie enviandole el nombre de la cookie
  }

  async function validateUser (req, h) {
    let result
    try {
      result = await users.validateUser(req.payload)// verifica que se valide el usuario el usario y recibe los parametros en el payload

      if (!result) {//si no es valido
        return h.view('login', {//los dos se llaman login por que lo dos errrores se controlaran de forma simultanea
          title: 'Login',
          error: 'Email y/o contraseña incorrecta'
        })
      }

    } catch (error) {
      console.error(error)
      return h.view('login', {
        title: 'Login',
        error: 'Problemas validando el usuario'
      })
    }
    //creación de cookie
    return h.redirect('/').state('user', {//si existe se enviá al home, state(user)user es el nombre de la cooke
      name: result.name, //la cookie tiene el nombre y el correo
      email: result.email
    })
  }
  function failValidation (req, h, err) {
    const templates = {
      '/create-user': 'register',/**la acción que se ejecuta en el registro */
      '/validate-user': 'login',/**acción del login */
      '/create-question': 'ask' //si hay problemas de validación nos manda ala plantilla preguntar
    }
  
    return h.view(templates[req.path], {//req.path = accedo a la ruta del error
      title: 'Error de validación',
      error: 'Por favor complete los campos requeridos'
    }).code(400).takeover()/*apica a que error se va a aplicar.takeover= me permite finalizar el ciclo de vida 
    del request y activar el handler de error.Se salta los otros pasos del lif cicle*/
  }

  module.exports = {
    createUser: createUser,
    logout: logout,
    failValidation: failValidation,
    validateUser: validateUser
  }
