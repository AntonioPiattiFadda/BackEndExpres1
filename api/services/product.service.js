const faker = require('faker');
const boom = require('@hapi/boom');

class ProductsService {
// Aca vamos a empezar a definir toda la logica que tiene que ver con la tienda. Definimos todas las interacciones que se van a dar en la pagina. Crear productos, editarlos, buscarlos, etc.
  constructor(){// Como no tengo conectado a un base de datos vamos a usar la memoria local
    this.products = [];
    this.generate();
  }

  async generate() {
    const limit = 5;
    for (let index = 0; index < limit; index++) {
      this.products.push({
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.imageUrl(),
        //Esto me va a tirar un true false randomicamente.
        isBlock: faker.datatype.boolean(),
      });
    }
  }

  // vamos a recibir al informacion de crear que va a venir en data
  async  create(data) {
    const newProduct = { // El producto nuevo tiene las caracteristiccas de los otros
      id: faker.datatype.uuid(),
      ...data
      // vamos a usar el spread operator para concatenar lo que venga de la peticion del cliente a data.
    }
    this.products.push(newProduct);
    // Los endopooint de tipo create una vez crean los productos lo retornan
    return newProduct;
  }

  async  find() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.products);
      }, 1000);
    })
    // return this.products; // Solo tiene que retornar el array porque esta la vamos a llamar en el router.
  }

  async findOne(id) {
    const product = this.products.find(item => item.id === id);
    if (!product){
      throw boom.notFound('product not found')
    }
    if (product.isBlock) {
      // Le vamos a configurar un error de tipo conflict-
      throw boom.conflict('El producto esta bloqueado momentaneamente')
    }
    return product;
    // Find me devuelve el obejto encontrado y findIndex me devuelve la posicion en el array.
  }

  async update(id, changes) {
    // Primero queremos encontrar la posicion en el array del objeto que quiero modificar. El id me lo va a mandar el cliente y los cambios tmb.
    const index = this.products.findIndex(item => item.id === id);
    if (index === -1){ // Esto es por las dudas no encuentre ningun producto con este id.
      //Vamos a lanzar el error con Boom. La dependencia va a saber que not found es un 404
      throw boom.notFound('Product not found');
    }
    // Tengo que crear un nuevo objeto que persista los elementos de product pero que le sume los de changes
    const product = this.products [index]
    this.products [index] = {
        ...product,
        ...changes,
      }
      // Tenemos que retornar el objeto modificado
      return this.products [index];
  }

  async delete(id) {
    // Tengo la logica similar a update
    const index = this.products.findIndex(item => item.id === id);
    if (index === -1){
      throw console.error("Also salio mal");
    }
    this.products.splice(index, 1);
    // Las APIs envian un mensaje de si salio todo bien
    return {
      message: "Todo salio fero y se elimino el elemento",
      message : true,
      id
    }
  }

}

module.exports = ProductsService;
