const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards');

const { auth } = require('../middlewares/auth');

const validateCardId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .custom((url) => {
        if (!validator.isURL(url)) {
          throw new CelebrateError('Неверный URL');
        }
        return url;
      }),
  }),
});


router.get("/cards", getCards); // защитить auth
router.post("/cards", validateCard, createCard); // защитить auth
router.delete("/cards/:id", validateCardId, deleteCard); // защитить auth
router.put("/cards/:id/likes", validateCardId, likeCard); // защитить auth
router.delete("/cards/:id/likes", validateCardId, dislikeCard); // защитить auth

module.exports = router;
