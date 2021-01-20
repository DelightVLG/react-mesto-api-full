const User = require('../models/user');

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

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: `Ошибка сервера: ${err}` });
    });
};

module.exports = {
  getUsers, getUserById, createUser,
};
