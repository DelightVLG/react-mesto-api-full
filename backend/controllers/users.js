// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const BadRequestError = require('../errors/BadRequestError');
// const NotFoundError = require('../errors/NotFoundError');
// const ConflictError = require('../errors/ConflictError');
// const UnauthorizedError = require('../errors/UnauthorizedError');
//
// const { NODE_ENV, JWT_SECRET } = process.env;
//
// const login = (req, res, next) => {
//   const { email, password } = req.body;
//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       if (!user) {
//         throw new UnauthorizedError('Авторизация не пройдена!');
//       }
//       const token = jwt.sign(
//         { _id: user._id },
//         NODE_ENV === 'production'
//           ? JWT_SECRET
//           : 'dev-jwt-secret',
//         { expiresIn: '7d' },
//       );
//
//       res.send({ token });
//     })
//     .catch(next);
// };
//
// const getUsers = (req, res, next) => {
//   User.find()
//     .then((users) => {
//       if (!users) {
//         throw new NotFoundError('Пользователи не найдены');
//       } else {
//         res.status(200).send({ data: users });
//       }
//     })
//     .catch(next);
// };
//
// const getCurrentUser = (req, res, next) => {
//   User.findById(req.user._id)
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Нет пользователя с таким id');
//       } else {
//         res.send(user);
//       }
//     })
//     .catch((err) => {
//       if (err.kind === 'ObjectId') {
//         next(new UnauthorizedError('Неверно введен id'));
//       }
//       next(err);
//     });
// };
//
// const getUserById = (req, res, next) => {
//   User.findById(req.params._id)
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Нет пользователя с таким id');
//       } else {
//         res.send(user);
//       }
//     })
//     .catch((err) => {
//       if (err.kind === 'ObjectId') {
//         next(new UnauthorizedError('Неверно введен id'));
//       }
//       next(err);
//     });
// };
//
// const createUser = (req, res, next) => {
//   const {
//     name,
//     about,
//     avatar,
//     email,
//     password,
//   } = req.body;
//
//   if (req.body.password.length < 8) {
//     throw new BadRequestError('Пароль менее 8 символов');
//   } else {
//     bcrypt.hash(password, 10)
//       .then((hash) => User.create({
//         name,
//         about,
//         avatar,
//         email,
//         password: hash,
//       }))
//       .then((newUser) => {
//         if (!newUser) {
//           throw new NotFoundError('Неправильно переданы данные');
//         } else {
//           res.send({
//             name: newUser.name,
//             about: newUser.about,
//             avatar: newUser.avatar,
//             email: newUser.email,
//           });
//         }
//       })
//       .catch((err) => {
//         if (err.name === 'ValidationError') {
//           next(new BadRequestError('Ошибка валидации. Введены некорректные данные'));
//         } else if (err.code === 11000) {
//           next(new ConflictError('Пользователь с таким email уже существует'));
//         }
//         next(err);
//       });
//   }
// };
//
// const updateUser = (req, res, next) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Нет пользователя с таким id');
//       } else {
//         res.status(200).send({ name: user.name, about: user.about });
//       }
//     })
//     .catch(next);
// };
//
// const updateAvatar = (req, res, next) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Нет пользователя с таким id');
//       } else {
//         res.status(200).send({ avatar: user.avatar });
//       }
//     })
//     .catch(next);
// };
//
// module.exports = {
//   getUsers,
//   getCurrentUser,
//   getUserById,
//   createUser,
//   updateUser,
//   login,
//   updateAvatar,
// };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Нет пользователей');
      } else {
        res.status(200).send({ data: users });
      }
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new UnauthError('Неверно введен id'));
      }
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new UnauthError('Неверно введен id'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
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
        } else if (err.code === 11000 || err.name === 'MongoError') {
          next(new ConflictError('Данный email уже зарегистрирован'));
        }
        next(err);
      });
  }
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.status(200).send({ name: user.name, about: user.about });
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthError('Авторизация не пройдена!');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production'
          ? JWT_SECRET
          : 'dev-jwt-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.status(200).send({ avatar: user.avatar });
      }
    })
    .catch(next);
};
