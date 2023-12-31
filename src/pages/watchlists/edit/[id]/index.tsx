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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getWatchlistById, updateWatchlistById } from 'apiSdk/watchlists';
import { Error } from 'components/error';
import { watchlistValidationSchema } from 'validationSchema/watchlists';
import { WatchlistInterface } from 'interfaces/watchlist';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { SubscriberInterface } from 'interfaces/subscriber';
import { ContentInterface } from 'interfaces/content';
import { getSubscribers } from 'apiSdk/subscribers';
import { getContents } from 'apiSdk/contents';

function WatchlistEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<WatchlistInterface>(
    () => (id ? `/watchlists/${id}` : null),
    () => getWatchlistById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: WatchlistInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateWatchlistById(id, values);
      mutate(updated);
      resetForm();
      router.push('/watchlists');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<WatchlistInterface>({
    initialValues: data,
    validationSchema: watchlistValidationSchema,
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
            Edit Watchlist
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'watchlist',
  operation: AccessOperationEnum.UPDATE,
})(WatchlistEditPage);
