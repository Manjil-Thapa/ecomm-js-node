const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// receive a post req to add an item to a cart
router.post('/cart/products', async (req, res) => {
  // figure out cart
  let cart;
  if (!req.session.cartId) {
    // req.session managed by cookie session
    // no cart, hence create cart and store cart id on req.session.cartId property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // cart exist, get it from repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  const existingItem = cart.items.find(item => item.id === req.body.productId);
  if (existingItem) {
    // increment quantity and save cart
    existingItem.quantity++;
  } else {
    // add new product id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  // save the new update or save new item
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });
  // either quantity for existing product
  // or add new product to items array
  res.send('Item added to cart');
});
// receive get req to show all items in cart
router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    // if somehow user ends up on cart bfo getting cart id, redirect
    return res.redirect('/');
  }
  const cart = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);

    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});
// receive post req to delete an item from cart

module.exports = router;
