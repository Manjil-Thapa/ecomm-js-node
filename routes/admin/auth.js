const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

// sub router - essentially replace app.get/post/delete etc to router
const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  [
    check('email')
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
    check('password').trim().isLength({ min: 4, max: 20 }),
    check('passwordConfirmation')
      .trim()
      .isLength({ min: 4, max: 20 })
      .custom((passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
          throw new Error('Passwords must match');
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const { email, password, passwordConfirmation } = req.body;
    //   console.log(req.body);

    if (password !== passwordConfirmation) {
      return res.send('Passwords must match');
    }
    //create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });
    // store id of that user inside users cookie
    req.session.userId = user.id; // added by cookie-session
    res.send('Account created');
  }
);

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You have logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send('Email not found');
  }
  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send('Invalid password');
  }
  req.session.userId = user.id; // authenticated

  res.send('You are signed in');
});

module.exports = router; // makes this available to other files
