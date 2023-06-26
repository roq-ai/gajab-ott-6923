import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createReview } from 'apiSdk/reviews';
import { Error } from 'components/error';
import { reviewValidationSchema } from 'validationSchema/reviews';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { SubscriberInterface } from 'interfaces/subscriber';
import { ContentInterface } from 'interfaces/content';
import { getSubscribers } from 'apiSdk/subscribers';
import { getContents } from 'apiSdk/contents';
import { ReviewInterface } from 'interfaces/review';

function ReviewCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ReviewInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createReview(values);
      resetForm();
      router.push('/reviews');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ReviewInterface>({
    initialValues: {
      rating: 0,
      comment: '',
      subscriber_id: (router.query.subscriber_id as string) ?? null,
      content_id: (router.query.content_id as string) ?? null,
    },
    validationSchema: reviewValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Review
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="rating" mb="4" isInvalid={!!formik.errors?.rating}>
            <FormLabel>Rating</FormLabel>
            <NumberInput
              name="rating"
              value={formik.values?.rating}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('rating', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.rating && <FormErrorMessage>{formik.errors?.rating}</FormErrorMessage>}
          </FormControl>
          <FormControl id="comment" mb="4" isInvalid={!!formik.errors?.comment}>
            <FormLabel>Comment</FormLabel>
            <Input type="text" name="comment" value={formik.values?.comment} onChange={formik.handleChange} />
            {formik.errors.comment && <FormErrorMessage>{formik.errors?.comment}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<SubscriberInterface>
            formik={formik}
            name={'subscriber_id'}
            label={'Select Subscriber'}
            placeholder={'Select Subscriber'}
            fetcher={getSubscribers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
              </option>
            )}
          />
          <AsyncSelect<ContentInterface>
            formik={formik}
            name={'content_id'}
            label={'Select Content'}
            placeholder={'Select Content'}
            fetcher={getContents}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.title}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'review',
  operation: AccessOperationEnum.CREATE,
})(ReviewCreatePage);
