import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2, FiEdit3 } from 'react-icons/fi';
import { getProviderById } from 'apiSdk/providers';
import { Error } from 'components/error';
import { ProviderInterface } from 'interfaces/provider';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteContentById } from 'apiSdk/contents';
import { deletePromotionById } from 'apiSdk/promotions';
import { deleteSubscriberById, createSubscriber } from 'apiSdk/subscribers';

function ProviderViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ProviderInterface>(
    () => (id ? `/providers/${id}` : null),
    () =>
      getProviderById(id, {
        relations: ['user', 'content', 'promotion', 'subscriber'],
      }),
  );

  const contentHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteContentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const promotionHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePromotionById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [subscriberUserId, setSubscriberUserId] = useState(null);
  const subscriberHandleCreate = async () => {
    setCreateError(null);
    try {
      await createSubscriber({ provider_id: id, user_id: subscriberUserId });
      setSubscriberUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const subscriberHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteSubscriberById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Provider Detail View
          </Text>
          {hasAccess('provider', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/providers/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Description:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.description}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Image:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.image}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    User:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                      {data?.user?.email}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('content', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Contents
                    </Text>
                    <NextLink passHref href={`/contents/create?provider_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>title</Th>
                          <Th>description</Th>
                          <Th>category</Th>
                          <Th>url</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.content?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/contents/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.title}</Td>
                            <Td>{record.description}</Td>
                            <Td>{record.category}</Td>
                            <Td>{record.url}</Td>
                            <Td>
                              {hasAccess('content', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/contents/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('content', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    contentHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {hasAccess('promotion', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Promotions
                    </Text>
                    <NextLink passHref href={`/promotions/create?provider_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>title</Th>
                          <Th>description</Th>
                          <Th>image</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.promotion?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/promotions/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.title}</Td>
                            <Td>{record.description}</Td>
                            <Td>{record.image}</Td>
                            <Td>
                              {hasAccess('promotion', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/promotions/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('promotion', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    promotionHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </Box>
            <Box>
              <Stack spacing={2} mb={8}>
                <Text fontSize="lg" fontWeight="bold">
                  Subscribers:
                </Text>
                <Flex gap={5} alignItems="flex-end">
                  <Box flex={1}>
                    <UserSelect name={'subscriber_user'} value={subscriberUserId} handleChange={setSubscriberUserId} />
                  </Box>
                  <Button
                    colorScheme="blue"
                    mt="4"
                    mr="4"
                    onClick={subscriberHandleCreate}
                    isDisabled={!subscriberUserId}
                  >
                    Create
                  </Button>
                </Flex>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>

                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.subscriber?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/users/view/${record?.user?.id}`)}
                          key={record?.user?.id}
                        >
                          <Td>{record?.user?.email}</Td>

                          <Td>
                            {hasAccess('user', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  subscriberHandleDelete(record.id);
                                }}
                                colorScheme="red"
                                variant="outline"
                                aria-label="edit"
                                icon={<FiTrash />}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'provider',
  operation: AccessOperationEnum.READ,
})(ProviderViewPage);
