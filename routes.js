'use strict'
const Joi = require('joi')// se usa par poner esquemas a los datos que ingresan
const site = require('./controllers/site')
const user = require('./controllers/user')
const question = require('./controllers/question')

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
    path: '/question/{id}',//id me permite con params extraer los valores de esa variable
    handler: site.viewQuestion
  },
  
  {
    method: 'GET',
    path: '/logout',
    handler: user.logout
  },

  {
    method: 'GET',
    path: '/ask',
    handler: site.ask
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
    path: '/create-question',
    method: 'POST',
    options: {
      validate: {
        payload: {
          title: Joi.string().required(),
          description: Joi.string().required()
        },
        failAction: user.failValidation
      }
    },
    handler: question.createQuestion
  },

  {
    path: '/answer-question',
    method: 'POST',
    options: {
      validate: {
        payload: {
          answer: Joi.string().required(),
          id: Joi.string().required()
        },
        failAction: user.failValidation
      }
    },
    handler: question.answerQuestion
  },
  
  {
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: '.',
        index: ['index.html']
      }
    }
  },

  {
    method: ['GET', 'POST'],//donde se va a amanejar el error  404 not.Found
    path: '/{any*}',//es un comodin que optiene cualquier parametro, las rutas resuelven en orden
    handler: site.notFound
  }
]