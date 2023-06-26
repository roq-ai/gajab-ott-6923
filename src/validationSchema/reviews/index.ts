import * as yup from 'yup';

export const reviewValidationSchema = yup.object().shape({
  rating: yup.number().integer().required(),
  comment: yup.string(),
  subscriber_id: yup.string().nullable().required(),
  content_id: yup.string().nullable().required(),
});
