const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require('./validators');

// sub router - essentially replace app.get/post/delete etc to router
const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   //if error is not empty
    //   return res.send(signupTemplate({ req, errors }));
    // }

    const { email, password, passwordConfirmation } = req.body;
    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id; // added by cookie-session
    res.send('Account created');
  }
);

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('You have logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate({})); // pass in empty obj. cannot destructure if there nothing to destructure which will cause an error
});

router.post(
  '/signin',
  [requireEmailExists, requireValidPasswordForUser],
  async (req, res) => {
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      return res.send(signinTemplate({ errors }));
    }

    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id; // authenticated

    res.send('You are signed in');
  }
);

module.exports = router; // makes this available to other files
