const express = require('express');
const bodyParser = require('body-parser'); // outside lib
const cookieSession = require('cookie-session'); //outside lib
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
// from exp lib
app.use(express.static('public')); // from current working directory, find pub folder and make it available to outside world
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['23vcKJhyuG34QGFSD832RQWDW12'],
  })
);
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

//exp everytime will look into pub folder -> request -> send it back to user -> continue to other middlewares
