'use strict'

const firebase = require('firebase-admin')
const serviceAccount = require('../config/firebase.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://platzioverflow-167f5.firebaseio.com/' // url en la consola de firebase
})

const db = firebase.database()//se inicializa la base de datos, crea la colección

const Users = require('./users')//es donde se crea un nuevo usuario

module.exports = {
  users: new Users(db)//nuevo usuario encriptado y se activa cuando se crea la colección
}