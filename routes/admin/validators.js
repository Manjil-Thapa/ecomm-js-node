const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  requireTitle: check('title') //validators for title and price
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 to 40 characters'),
  requirePrice: check('price')
    .trim()
    .toFloat() // remb server will always return str, this 'parsing' to num. // whole num or float
    .isFloat({ min: 1 }) // validation step to make sure its a num. min price of $1
    .withMessage('Must be a number greater than 1'),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async email => {
      const existingUser = await usersRepo.getOneBy({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match');
      } else {
        return true;
      }
    }),
  requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email')
    .custom(async email => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error('Email not found');
      }
    }),
  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email });
      if (!user) {
        throw new Error('Invalid password');
      }
      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      );
      if (!validPassword) {
        throw new Error('Invalid password');
      }
    }),
  requireImage: check('image').custom((image, { req }) => {
    const file = req.file;
    if (!file) {
      throw new Error('Please upload file');
    }
    return (req, res, next) => {
      next();
    };
  }),
};
