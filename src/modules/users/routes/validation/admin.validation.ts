import { celebrate, Joi, Segments } from 'celebrate';

export const createEmployeeInviteValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    clinic_uuid: Joi.string().uuid().required(),
    permission: Joi.object()
      .keys({
        create_exame: Joi.boolean().required(),
        create_client: Joi.boolean().required(),
        clinic_control: Joi.boolean().required(),
        delete_exame: Joi.boolean().required(),
        delete_client: Joi.boolean().required(),
        read_exame: Joi.boolean().required(),
      })
      .required()
      .label('Permissões'),
  }),
});

export const listUsersValidation = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().min(1).label('Página'),
    limit: Joi.number().min(1).label('Limite'),
  }),
});

export const blockedUserValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    user_uuid: Joi.string().uuid().required().label('UUID do usuário'),
  }),
  [Segments.QUERY]: Joi.object().keys({
    unblock: Joi.string().label('Desbloquear').empty(''),
  }),
});

export const deleteUserValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    user_uuid: Joi.string().uuid().required().label('UUID do usuário'),
  }),
});
