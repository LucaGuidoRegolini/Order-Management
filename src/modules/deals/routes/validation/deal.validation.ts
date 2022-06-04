import { celebrate, Joi, Segments } from 'celebrate';

export const listDealsValidation = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().min(1).label('Página'),
    limit: Joi.number().min(1).label('Limite'),
    initial_date: Joi.date().label('Data inicial'),
    final_date: Joi.date().label('Data final'),
  }),
});
