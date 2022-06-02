import { celebrate, Joi, Segments } from 'celebrate';

export const createEmployeeValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().label('Nome'),
    email: Joi.string().email().required().label('E-mail'),
    password: Joi.string().required().label('Senha'),
  }),

  [Segments.PARAMS]: Joi.object().keys({
    token: Joi.string().uuid().required().label('Token'),
  }),
});

export const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().label('Nome'),
    email: Joi.string().email().label('E-mail'),
    pipedrive_token: Joi.string().label('Token do Pipedrive'),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    user_uuid: Joi.string().uuid().required().label('ID do Usuário'),
  }),
});

export const showUserValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    user_uuid: Joi.string().uuid().required().label('ID do Usuário'),
  }),
});
