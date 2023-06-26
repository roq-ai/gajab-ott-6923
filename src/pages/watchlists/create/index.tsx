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
import { createWatchlist } from 'apiSdk/watchlists';
import { Error } from 'components/error';
import { watchlistValidationSchema } from 'validationSchema/watchlists';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { SubscriberInterface } from 'interfaces/subscriber';
import { ContentInterface } from 'interfaces/content';
import { getSubscribers } from 'apiSdk/subscribers';
import { getContents } from 'apiSdk/contents';
import { WatchlistInterface } from 'interfaces/watchlist';

function WatchlistCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: WatchlistInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createWatchlist(values);
      resetForm();
      router.push('/watchlists');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<WatchlistInterface>({
    initialValues: {
      subscriber_id: (router.query.subscriber_id as string) ?? null,
      content_id: (router.query.content_id as string) ?? null,
    },
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
            Create Watchlist
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'watchlist',
  operation: AccessOperationEnum.CREATE,
})(WatchlistCreatePage);
