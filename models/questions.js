'use strict'

class Questions {
  constructor (db) {/**recibe3 la instancia de firebase */
    this.db = db
    this.ref = this.db.ref('/')/** se esta referenciando una raiz de referencia */
    this.collection = this.ref.child('questions')/** se crea una nueva colección en la base de datos de firebase */
  }

  async create (data, user) {
    data.owner = user/**se obtiene la información del usuario de la cookie */
    const question = this.collection.push()
    question.set(data)/**es la incerción de los datos en la variable questions */

    return question.key//
  }
  async getLast (amount) {/**ultima pregunta */
    const query = await this.collection.limitToLast(amount).once('value')/**limitTolast= ultima pregunta hecha. once('value')
    =esperamos un valor cuando se resuelva la promesa   */
    const data = query.val()//convertimos la consulta en un valor
    return data
  }

  async getOne (id) {
    const query = await this.collection.child(id).once('value')
    const data = query.val()
    return data
  }

  async answer (data, user) {/** */
    const answers = await this.collection.child(data.id).child('answers').push()/**data.id= apunta al payload que tiene answer y id 
    Answers= es le cuerpo de la respuesta*/
    answers.set({text: data.answer, user: user})/** data.answer es un parametro de la ruta y user= al dato de la cookie*/
    return answers/** insertamos la respuesta*/
  }

  async setAnswerRight (questionId, answerId, user) {
    const query = await this.collection.child(questionId).once('value')/**le asignamos un Id a la pregunta */
    const question = query.val()/**asingmaos un valor al query */
    const answers = question.answers

    if (!user.email === question.owner.email) {/**si el email del usuario no es el mismo de la cookie retorna falso */
      return false
    }

    for (let key in answers) {
      answers[key].correct = (key === answerId)//marca la propiedad correct para la respuesta correcta
    }

    const update = await this.collection.child(questionId).child('answers').update(answers) /**va a el Id de la pregunta, entra a la sección respuestas
    actualiza la respuesta */
    return update
  }
}

module.exports = Questions