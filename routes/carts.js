const express = require('express');
const cartsRepo = require('../repositories/carts');
const router = express.Router();

// receive a post req to add an item to a cart
router.post('/cart/products', async (req, res) => {
  console.log(req.body.productId);
  // figure out cart
  let cart;
  if (!req.session.cardId) {
    // req.session managed by cookie session
    // no cart, hence create cart and store cart id on req.session.cartId property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cardId;
  } else {
    // cart exist, get it from repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  console.log(cart);
  // either quantity for existing product
  // or add new product to items array
  res.send('Item added to cart');
});
// receive get req to show all items in cart

// receive post req to delete an item from cart

module.exports = router;
