'use strict'

const questions = require('../models/index').questions

async function createQuestion (req, h) {
  if (!req.state.user) {
    return h.redirect('/login')
  }
  
  let result
  try {
    result = await questions.create(req.payload, req.state.user)/**drecibe la información del formulario y tambien el usario qu eesta en el usuario */
    console.log(`Pregunta creada con el ID ${result}`)
  } catch (error) {
    req.log('error', `Ocurrio un error: ${error}`)

    return h.view('ask', {
      title: 'Crear pregunta',
      error: 'Problemas creando la pregunta'
    }).code(500).takeover()
  }

  return h.response(`Pregunta creada con el ID ${result}`)
}

async function answerQuestion (req, h) {
  if (!req.state.user) {
    return h.redirect('/login')
  }
  
  let result
  try {
    result = await questions.answer(req.payload, req.state.user)/**requiere el payload que viene x routes y el usario que viene de la cookie */
    req.log('info', `Respuesta creada: ${result}`)
  } catch (error) {
    console.error(error)
  }

  return h.redirect(`/question/${req.payload.id}`)/**redirecionamos el usuario a la pregunta que contesto */
}

async function setAnswerRight (req, h) {
  if (!req.state.user) {
    return h.redirect('/login')
  }

  let result
  try {
    result = await req.server.methods.setAnswerRight(req.params.questionId, 
    req.params.answerId, req.state.user)/**usamos metodo del servidor, los parametros que require de la ruta*/
    req.log('info', result)
  } catch (error) {
    req.log('error', error)
  }

  return h.redirect(`/question/${req.params.questionId}`)/**redireciónamos a la ruta de la pregunta */
}

module.exports = {
  createQuestion: createQuestion,
  answerQuestion: answerQuestion,
  setAnswerRight: setAnswerRight
}