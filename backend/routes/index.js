const router = require('express').Router();

const usersRouter = require('./users');

const cardsRouter = require('./cards');

module.exports = router.use(
  usersRouter,
  cardsRouter,
);
