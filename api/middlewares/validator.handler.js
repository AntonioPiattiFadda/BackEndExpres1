// vamos a tener el mismo formato que middleware error pero va a ser de tipo normal
const boom = require('@hapi/boom');

 // EN realidad ahora la funcion va a retornar un middlewere de forma dinamica. No va a recibr los mismos parametros que cualuqeir middleware sino que va a recibir el esquema que quiero validar y las propiedades (Cada request tiene diferentes propiedades a evaluar. El body, el params, etc.) que trae dicho esquema.
function validatorHandler(schema, property) {
  //Esto utiliza la propiedad de closures. Retornamos un middleware de forma dinamica.
  return (req, res, next) => {
    //No se porque lo pone entre corchetes pero de esta forma si viene de body o de params los va a entender.
    const data = req[property];
    const { error } = schema.validate(data, {abortEarly:false});
   if (error){
    console.log('Hay un error boom')
    next(boom.badRequest(error));
   }
   next();
  }


}

module.exports = validatorHandler;
