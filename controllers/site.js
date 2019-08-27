'use strict'
function home (req, h) {
    //return h.file('index.html')//h.file= el archivo del html en este se usa innert
    return h.view('index', {//h.view= sigifica la vista es lo que esta en el archivo index de views
        title: 'home',// es la variable que esta en el archivo layout
        user: req.state.user
    })
  }
  
  function register (req, h) {
    if (req.state.user) {
      return h.redirect('/')
    }      
    return h.view('register', {
      title: 'Registro',
      user: req.state.user//es otra varialbe le manda la información de usuario
    })
  }
  
  function login (req, h) {
    if (req.state.user) {
      return h.redirect('/')
    }
    
    return h.view('login', {
      title: 'Ingrese',
      user: req.state.user
    })
  }
  
  module.exports = {
    home: home,
    login: login,
    register: register
  }