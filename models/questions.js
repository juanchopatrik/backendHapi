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
}

module.exports = Questions