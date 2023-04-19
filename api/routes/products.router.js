const express = require('express');

const ProductsService = require('../services/product.service');
// En este archivo nuevo no tenemos acceso a la aplicacion por lo que vamos a crear un router.

const { createProductSchema, updateProductSchema, getProductSchema } = require ('../schemas/product.schema');
const validatorHandler = require ('../middlewares/validator.handler');



const router = express.Router();
// A la ruta producto la va a controlar otra parte del codigo asique tengo que reemplazar app por router y eliminar los products

// Tenemos que crear una insancia de la clase productService
const service = new ProductsService();

router.get('/', async (req, res) => {
  const products = await service.find();
  res.json(products);
});

router.get('/filter', (req, res) => {
  res.send('Yo soy un filter');
});


// Todos los parametros que envia get, asi sea un numero los envia como string.
router.get('/:id',
  // en realidad lo que esta despues de async es un middlewere, por lo tanto puedo concaternarle antes el validateHandler para que controle antes de que se haga la peticion.
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await service.findOne(id)
    res.json(product);
  } catch (error) {
    next(error)
  }

});

router.post('/',
validatorHandler(createProductSchema, 'body'),
  async (req,res)=>{
    const body = req.body;
    const newProduct = await service.create(body);
    res.json(newProduct)
})

router.patch('/:id',
// Tenemos dos elemenots para validar asique lo hacemos de forma secuencial a los dos middleweres validadores.
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req,res)=>{
    try {
      const { id } = req.params;
      const body = req.body;
      const product = await service.update(id, body);
      res.json(product);
    }
    // Tenemos que actualizar esto porque no esta parando por nuestros middlewares capturadores de errores
    catch (error) {
      next();
     /* res.status(404).json({
        message: 'No hemos encontrado el articulo que buscas'
      }) Esto es lo viejo */
    }
})


// Delete no tiene cuerpo porque no lo necesita
router.delete('/:id', async (req,res)=>{
  const { id } = req.params;
  const product = await service.delete(id)
  res.json(product)
})

// vamos a exportar el modulo
module.exports = router;
