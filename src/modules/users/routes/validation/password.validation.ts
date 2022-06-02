import { celebrate, Joi, Segments } from 'celebrate';

export const forgotPasswordValidation = celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
  },
});

export const resetPasswordValidation = celebrate({
  [Segments.BODY]: {
    new_password: Joi.string().required().min(8),
  },
  [Segments.PARAMS]: {
    token: Joi.string().required(),
  },
});

export const changePasswordValidation = celebrate({
  [Segments.BODY]: {
    new_password: Joi.string().required().min(8),
    old_password: Joi.string().required(),
  },
  [Segments.PARAMS]: {
    user_uuid: Joi.string().uuid().required(),
  },
});
