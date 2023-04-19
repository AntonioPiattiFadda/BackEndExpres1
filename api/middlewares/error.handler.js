//Creamos función que nos hará capturar cualquer error
function logErrors(err, req, res, next) {
  console.error(err); //Esto es util para hacer tracking y monitorear los errores. Hay sistemas que nombro para hacerlo.
  next(err); // Importante para saber que se esta enviando a un middleware de tipo error, si no tiene el error como parametro entonces se esta mandando a un middlewere normal.
}

// Va a detectar el error pero tambien vamos a crear un formato para devolverlo al cliente que se complementa con la función anterior:
function errorHandler(err, req, res, next) { //así no se utilice next en el código se debe poner aqui, ya que un middleware de error tiene los cuatro parámetros. No pongo un next porque despues del error no quiero ejecutar ningun middlewere mas
  res.status(500).json({ //indicar que el error es estatus 500 Internal Server Error
    message: err.message, //mostrar al cliente el mensaje de error
    stack: err.stack, //mostrar info del error y para saber donde ocurrio.
  })
}

/* Vamos a crear un error handler para los errores de tipo Boom*/
function boomErrorHandler(err, req, res, next) {
  // Cuando el error es de tipo boom adquiere una propiedad que es .isBoom
  if (err.isBoom) {
    //Boom tiene toda la informacion relacionada a ese error en un objeto llamado output
    const { output } = err;
    // El tipo de error lo vemos en output.statuscode y el cuerpo del error viene en output.payload.
    res.status(output.statusCode).json(output.payload);
  }
  //Aca le decimos que si no es un error tipo Boom que siga por los otros Middlewares.
  next(err);
}



module.exports = { logErrors, errorHandler, boomErrorHandler }; //exportarlo como modulo
