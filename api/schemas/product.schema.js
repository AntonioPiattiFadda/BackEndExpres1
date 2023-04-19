const Joi = require('joi');
const joi = require('joi');


// La siguiente linea lo que dice es Joi tiene que validar datos. Despues la pasamos el tipo de campo que quiero validar y al final, la validacion. La froma que tiene que tener ese dato.
const id = Joi.string().uuid();
const name = Joi.string().min(3).max(30);
const price = Joi.number().integer().min(10);
const image = Joi.string().uri();

// Tenemos que crear el esquema
const createProductSchema = Joi.object({
  //Le paso los datos que necesito para la validacion y ademas si es requerido o no
  name: name.required(),
  price: price.required(),
  image: image.required(),
})

const updateProductSchema = Joi.object({
  //En el caso de update no son requeridos los datos. Porque podemos actualizar solo una parte.
  name: name,
  price: price,
  image: image,
})

const getProductSchema = Joi.object({
  // Lo que quiero validar es que la consulta tenga bien escrita la id para que busque en la base de datos
  id: id.required(),
  // A pesar que tenga un solo elemento lo mejor es dejarlo como objeto para manejarlo mas facil cuando pase por el validador
})

module.exports = { createProductSchema, updateProductSchema, getProductSchema };

