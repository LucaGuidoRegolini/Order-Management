import { celebrate, Joi, Segments } from 'celebrate';

export const sendEmailValidation = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
  },
});

export const verifyEmailValidation = celebrate({
  [Segments.PARAMS]: {
    token: Joi.string().required(),
  },
});
