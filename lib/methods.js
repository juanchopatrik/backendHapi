'use strict'

const questions = require('../models/index').questions

async function setAnswerRight (questionId, answerId, user) {/**los mismos parametros del modelo */
  let result/**vamos a usar el modelo */
  try {
    result = await questions.setAnswerRight(questionId, answerId, user)
  } catch (error) {
    console.error(error)
    return false
  }

  return result//es el metodo que usamos para que use el servidor
}

module.exports = {
  setAnswerRight: setAnswerRight
}