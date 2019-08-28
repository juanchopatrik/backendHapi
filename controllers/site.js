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

  function notFound (req, h) {
    return h.view('404', {}, { layout: 'error-layout' }).code(404)/*todo error 404 usara el diseño 404 y a traves de vision enviará 
    como diseño la plantilla error-layout.code(404)cuando el error es 404*/ 
  }

  function fileNotFound (req, h) {
    const response = req.response/**obteniendo el objeto response del req.  */
    if (response.isBoom && response.output.statusCode === 404) {/** es  la forma de interceptar el error*/
      return h.view('404', {}, { layout: 'error-layout' }).code(404)
    }
  
    return h.continue /** continuar el programa si esto no se cumple hay que ponerlo o sino genera error*/
  }
  
  module.exports = {
    home: home,
    fileNotFound: fileNotFound,
    login: login,
    notFound: notFound,
    register: register
  }