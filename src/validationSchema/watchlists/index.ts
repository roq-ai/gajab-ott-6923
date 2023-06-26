import * as yup from 'yup';

export const watchlistValidationSchema = yup.object().shape({
  subscriber_id: yup.string().nullable().required(),
  content_id: yup.string().nullable().required(),
});
