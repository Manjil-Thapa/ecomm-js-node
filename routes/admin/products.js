// create router, export router and wire up to index.js
const express = require('express');
// const { validationResult } = require('express-validator'); moved to middlewares.js
const multer = require('multer');

const { handleErrors } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const { requireTitle, requirePrice, requireImage } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// route handlers
router.get('/admin/products', async (req, res) => {
  // look into prods repos - find them and render and send back to user
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});
// show products
router.get('/admin/products/new', (req, res) => {
  // retrieve just the form
  res.send(productsNewTemplate({})); // empty obj for possible errors
});
// create new products

// submit products

// allow editing

// submit and edit

// deletion of products

router.post(
  '/admin/products/new',
  upload.single('image'), //parsed and access to img and req.body
  [requireTitle, requirePrice, requireImage], // then to require middlewares which will have access to title and price and be able to check for errors correctly
  handleErrors(productsNewTemplate),
  async (req, res) => {
    // user submitting info from form
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    res.redirect('/admin/products');
  }
);

module.exports = router;
