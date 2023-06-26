import * as yup from 'yup';

export const promotionValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  provider_id: yup.string().nullable().required(),
});
