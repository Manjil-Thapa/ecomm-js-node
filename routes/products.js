const express = require('express');
const productsRepo = require('../repositories/products');
const productsIndexTemplate = require('../views/products/index');

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await productsRepo.getAll(); // quick reminder: reach into file and read everything and return back as array(title,price,id)
  res.send(productsIndexTemplate({ products }));
});

module.exports = router;
