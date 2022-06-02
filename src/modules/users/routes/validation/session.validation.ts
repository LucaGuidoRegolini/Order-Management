import { celebrate, Joi, Segments } from 'celebrate';

export const createSessionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    remember_me: Joi.boolean(),
  }),
});

export const refreshSessionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    refresh_token: Joi.string().required(),
  }),
});

export const deleteSessionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    refresh_token: Joi.string().required(),
  }),
});
