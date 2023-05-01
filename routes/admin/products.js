// create router, export router and wire up to index.js
const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// route handlers
router.get('/admin/produts', (req, res) => {});
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
  [requireTitle, requirePrice], // then to require middlewares which will have access to title and price and be able to check for errors correctly
  async (req, res) => {
    // user submitting info from form
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(productsNewTemplate({ errors }));
    }

    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
    res.send('submitted');
  }
);

module.exports = router;
