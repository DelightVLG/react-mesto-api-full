const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((err) => res.status(500).send({ message: `Запрашиваемый ресурс не найден ${err}` }));

const getUserById = (req, res) => User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      res.status(404).send({ message: 'Нет пользователя с таким id' });
      return;
    }
    res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: `Передан невалидный id: ${req.params.id}` });
      return;
    }
    res.status(500).send({ message: `Ошибка сервера: ${err}` });
  });

// const createUser = (req, res) => {
//   const { name, about, avatar } = req.body;
//   return User.create({ name, about, avatar })
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return res.status(400).send({ message: 'Ошибка валидации' });
//       }
//       return res.status(500).send({ message: `Ошибка сервера: ${err}` });
//     });
// };

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (req.body.password.length < 8) {
    throw new BadRequestError('Пароль менее 8 символов');
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then((newUser) => {
        if (!newUser) {
          throw new NotFoundError('Неправильно переданы данные');
        } else {
          res.send({
            name: newUser.name,
            about: newUser.about,
            avatar: newUser.avatar,
            email: newUser.email,
          });
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Ошибка валидации. Введены некорректные данные'));
        } else if (err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже существует'));
        }
        next(err);
      });
  }
};

module.exports = {
  getUsers, getUserById, createUser,
};
