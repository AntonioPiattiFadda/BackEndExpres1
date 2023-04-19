const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');

//Importamos las funciones de manejo de errores
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require('./middlewares/error.handler');

const app = express(); //Express es un metodo que va a crear nuestra app.
const port = process.env.PORT || 3000;

// Tenemos que implementar un “middleware” que tiene NodeJs.
app.use(express.json());
// Cors permite dar acceso a nuestro servidor a las request de lso dominios que yo elija.
app.use(cors());

//Quiero definir una ruta y le vamos a pasar un callback que es la respuesta que le vamos a dar a nuestro cliente.
app.get('/api', (req, res) => {
  res.send('Hola, soy el server en express');
});

//Vamos a ver los parametros query
app.get('/api/users', (req, res) => {
  // Como son opcionales no los vamos a obtener de la ruta sino de otro lado. En este caso vamos a usar una estrategia de paginacion.
  const { limit, offset } = req.query;
  //Como son opcionales tengo que hacer una validacion.
  if (limit && offset) {
    res.json({
      limit,
      offset,
    });
  } else {
    res.send('No encontramos nada');
  }
});

routerApi(app);

// Utilizamos los middleware. Siempre deben ir después del routing:
app.use(logErrors);
// EL boom va segundo porque en caso de que detecte que el error noo es de tipo boom lo manda al errorHandler normal
app.use(boomErrorHandler);
app.use(errorHandler);

// Le tenemos que decir a la app donde tiene que escuchar. Lo podemos poner un cb que, cuando ya esto se este ejecutando me avise que se esta escuchando bien
app.listen(port, () => {
  console.log('Se esta escuchando bien en el 3000');
});

console.log('MyApp');
