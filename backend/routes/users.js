const usersRouter = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getUserById,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((url) => {
      if (!validator.isURL(url)) {
        throw new CelebrateError('Неверный URL');
      }
      return url;
    }),
  }),
});

usersRouter.get('/users', auth, getUsers);
usersRouter.get('/users/me', auth, getUser);
usersRouter.get('/users/:_id', auth, validateId, getUserById);
usersRouter.patch('/users/me', auth, validateUserUpdate, updateUser);
usersRouter.patch('/users/me/avatar', auth, validateUserAvatar, updateAvatar);

module.exports = usersRouter;
