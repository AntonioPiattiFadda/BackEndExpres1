const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Estas en la ruta users');
});

router.get('/filter', (req, res) => {
  res.send('Yo soy un filter');
});


module.exports = router;
