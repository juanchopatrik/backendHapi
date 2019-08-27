'use strict'
// Calls "hasOwnProperty" on queryData, even if queryData has
// no prototype:

const bcrypt = require('bcrypt')// se usa para encriptar el password

class Users {//se crea a traves de la clase users un nuevo usuario
  constructor (db) {//recibe la base de datos ya inicializada
    this.db = db
    this.ref = this.db.ref('/')//firebase trabaja con referencias al poner '/' estamos referenciando la raiz de la base de datos
    this.collection = this.ref.child('users')// creando una nueva collección que sale de la raiz='/'. el child se va a llamar users 
  }

  async create (data) {//data= es la informacion a crear
    data.password = await 
    this.constructor.encrypt(data.password)/*data.password se transnforma al activar la función encrypt quien ahora recibe 
    el password del set data    */ 
    const newUser = this.collection.push()//se crea una nueva referencia dentro de la colección
    newUser.set(data)//se guarda la información

    return newUser.key//se devuelve el objeto creado en la propiedad .key donde se almacena
  }
  async validateUser (data) {
    const userQuery = await 
    this.collection.orderByChild('email').equalTo(data.email).once('value')//se esta haciendo una consulta en firebase donde se busque el mismo email en las colleciones
    //once('value') devuelve un valor correcto o incorrecto
    const userFound = userQuery.val()//transforma el valor en un string
    if (userFound) {//identificamos si hay un usuario
      const userId = Object.keys(userFound)[0]//obtener el Id, object.keys por que es un objeto
      const passwdRight = await bcrypt.compare(data.password, userFound[userId].password)//comparar un password con el objeto encontrado
      const result = (passwdRight) ? userFound[userId] : false//si el pasword esta bien resolvemos el objeto

      return result
    }

    return false
  }

  static async encrypt (passwd) {
    const saltRounds = 10// parametro por defecto de bcrytp
    const hashedPassword = await bcrypt.hash(passwd, saltRounds)
    return hashedPassword
  }
}

module.exports = Users