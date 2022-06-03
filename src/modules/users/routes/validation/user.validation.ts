import { celebrate, Joi, Segments } from 'celebrate';

export const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().label('Nome'),
    email: Joi.string().email().required().label('E-mail'),
    password: Joi.string().length(6).required().label('Senha'),
    token: Joi.string().required().label('Token'),
  }),
});

export const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().label('Nome'),
    email: Joi.string().email().label('E-mail'),
    token: Joi.string().label('Token do Pipedrive'),
  }),
});
