const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const {
  getCards,
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards.js');

const auth = require('../middlewares/auth');

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

const validateCardId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
});

router.get('/cards', auth, getCards);
router.get('/cards/:id', auth, validateCardId, getCard);
router.post('/cards', auth, validateCard, createCard);
router.delete('/cards/:id', auth, validateCardId, deleteCard);
router.put('/cards/:id/likes', auth, validateCardId, likeCard);
router.delete('/cards/:id/likes', auth, validateCardId, dislikeCard);

module.exports = router;
