'use strict'

const authBasic = require('hapi-auth-basic')//modulo de autenticación de la api
const Boom = require('boom')
const Joi = require('joi')
const questions = require('../models/index').questions/** requiere creación de nueva pregunata */
const users = require('../models/index').users

module.exports = {
  name: 'api-rest',
  version: '1.0.0',
  async register (server, options) {
    const prefix = options.prefix || 'api'//nombre de la ruta

    await server.register(authBasic)//registrando el basic
    server.auth.strategy('simple', 'basic', { validate: validateAuth })/**basic es e modulo */

    server.route({
      method: 'GET',
      path: `/${prefix}/question/{key}`,
      options: {
        auth: 'simple',//se debe autenticar con simple
        validate: {
          params: {
            key: Joi.string().required()
          },
          failAction: failValidation
        }
      },
      handler: async (req, h) => {
        let result
        try {
          result = await questions.getOne(req.params.key)
          if (!result) {
            return Boom.notFound(`No se pudo encontrar la pregunta ${req.params.key}`)
          }
        } catch (error) {
          return Boom.badImplementation(`Hubo un error buscando ${req.params.key} - ${error}`)
        }

        return result
      }
    })

    server.route({
      method: 'GET',
      path: `/${prefix}/questions/{amount}`,
      options: {
        auth: 'simple',
        validate: {
          params: {
            amount: Joi.number().integer().min(1).max(20).required()
          },
          failAction: failValidation
        }
      },
      handler: async (req, h) => {
        let result
        try {
          result = await questions.getLast(req.params.amount)
          if (!result) {
            return Boom.notFound(`No se pudo recuperar las preguntas`)
          }
        } catch (error) {
          return Boom.badImplementation(`Hubo un error buscando las preguntas - ${error}`)
        }

        return result
      }
    })

    function failValidation (req, h, err) { 
      return Boom.badRequest('Por favor use los parámetros correctos')
    }

    async function validateAuth (req, username, passwd, h) {
        let user
        try {
          user = await users.validate({ email: username, passwdord: passwd })/**se valida que el usario halla sido creado  */
        } catch (error) {
          server.log('error', error)
        }
  
        return {
          credentials: user || {},//
          isValid: (user !== false)//si user es diferente si existe usuario
        }
    }
  }
}