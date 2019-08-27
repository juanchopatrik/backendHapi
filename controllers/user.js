'use strict'

const Boom = require('boom')
const users = require('../models/index').users// importo toda la propiedad users

async function createUser (req, h) {
  let result// es un proceso asincrono
  try {
    result = await users.create(req.payload)// verifica que se cree el usario y recibe los parametros en el payload
  } catch (error) {
    console.error(error)
    return h.response('Problemas creando el usuario').code(500)
  }

  return h.response(`Usuario creado ID: ${result}`)
  }
  
  function logout (req, h) {
    return h.redirect('/login').unstate('user')//se redicciona al login y unstate remueve la cookie enviandole el nombre de la cookie
  }

  async function validateUser (req, h) {
    let result
    try {
      result = await users.validateUser(req.payload)// verifica que se valide el usuario el usario y recibe los parametros en el payload

      if (!result) {//si no es valido
        return h.response('Email y/o contraseña incorrecta').code(401)
      }

    } catch (error) {
      console.error(error)
      return h.response('Problemas validando el usuario').code(500)
    }
    return h.redirect('/').state('user', {//si existe se enviá al home, state(user)user es el nombre de la cooke
      name: result.name, //la cookie tiene el nombre y el correo
      email: result.email
    })
  }
  function failValidation (req, h, err) {
    return Boom.badRequest('Falló la validación', req.payload)//req.payload es lo que esta validado
  }

  module.exports = {
    createUser: createUser,
    logout: logout,
    failValidation: failValidation,
    validateUser: validateUser
  }
