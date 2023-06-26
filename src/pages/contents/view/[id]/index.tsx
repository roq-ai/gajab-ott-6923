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
import { getContentById } from 'apiSdk/contents';
import { Error } from 'components/error';
import { ContentInterface } from 'interfaces/content';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteReviewById } from 'apiSdk/reviews';
import { deleteWatchlistById } from 'apiSdk/watchlists';

function ContentViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ContentInterface>(
    () => (id ? `/contents/${id}` : null),
    () =>
      getContentById(id, {
        relations: ['provider', 'review', 'watchlist'],
      }),
  );

  const reviewHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteReviewById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const watchlistHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteWatchlistById(id);
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
            Content Detail View
          </Text>
          {hasAccess('content', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/contents/edit/${data?.id}`} passHref legacyBehavior>
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
                  Title:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.title}
                </Text>
              </Flex>
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
                  Category:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.category}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Url:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.url}
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
              {hasAccess('provider', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    Provider:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/providers/view/${data?.provider?.id}`}>
                      {data?.provider?.name}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('review', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Reviews
                    </Text>
                    <NextLink passHref href={`/reviews/create?content_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>rating</Th>
                          <Th>comment</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.review?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/reviews/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.rating}</Td>
                            <Td>{record.comment}</Td>
                            <Td>
                              {hasAccess('review', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/reviews/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('review', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    reviewHandleDelete(record.id);
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

              {hasAccess('watchlist', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Watchlists
                    </Text>
                    <NextLink passHref href={`/watchlists/create?content_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.watchlist?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/watchlists/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>
                              {hasAccess('watchlist', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/watchlists/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('watchlist', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    watchlistHandleDelete(record.id);
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
            <Box></Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'content',
  operation: AccessOperationEnum.READ,
})(ContentViewPage);
