'use strict'
const Joi = require('joi')// se usa par poner esquemas a los datos que ingresan
const site = require('./controllers/site')
const user = require('./controllers/user')

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: site.home
  },
  {
    method: 'GET',
    path: '/register',
    handler: site.register
  },
  {
    path: '/create-user',
    method: 'POST',
    options: {
      validate: {
        payload: {
          name: Joi.string().required().min(3),//string= tiene que ser letras, required= obligatorio,  mi
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6)
        },
        failAction: user.failValidation//actua si no se cumple el squema
      }
    },
    handler: user.createUser
  },

  {
    method: 'GET',
    path: '/login',
    handler: site.login
  },
  
  {
    method: 'GET',
    path: '/logout',
    handler: user.logout
  },
  {
    path: '/validate-user',
    method: 'POST',
    options: {
      validate: {
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required().min(6)
        },
        failAction: user.failValidation
      }
    },
    handler: user.validateUser
  },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        index: ['index.html']
      }
    }
  }
]