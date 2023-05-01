// create router, export router and wire up to index.js
const express = require('express');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');

const router = express.Router();

// route handlers
router.get('/admin/produts', (req, res) => {});
// show products
router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({})); // empty obj for possible errors
});
// create new products

// submit products

// allow editing

// submit and edit

// deletion of products

module.exports = router;
