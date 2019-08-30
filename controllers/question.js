'use strict'

const questions = require('../models/index').questions

async function createQuestion (req, h) {
  let result
  try {
    result = await questions.create(req.payload, req.state.user)/**drecibe la información del formulario y tambien el usario qu eesta en el usuario */
    console.log(`Pregunta creada con el ID ${result}`)
  } catch (error) {
    console.error(`Ocurrio un error: ${error}`)

    return h.view('ask', {
      title: 'Crear pregunta',
      error: 'Problemas creando la pregunta'
    }).code(500).takeover()
  }

  return h.response(`Pregunta creada con el ID ${result}`)
}

async function answerQuestion (req, h) {
  let result
  try {
    result = await questions.answer(req.payload, req.state.user)/**requiere el payload que viene x routes y el usario que viene de la cookie */
    console.log(`Respuesta creada: ${result}`)
  } catch (error) {
    console.error(error)
  }

  return h.redirect(`/question/${req.payload.id}`)/**redirecionamos el usuario a la pregunta que contesto */
}

module.exports = {
  createQuestion: createQuestion,
  answerQuestion: answerQuestion
}