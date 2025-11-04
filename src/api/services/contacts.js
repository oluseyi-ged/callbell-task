import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithRetry from '../baseQuery';
import { CACHE_TIMES } from '../../constants';

export const contactsApi = createApi({
  reducerPath: 'contactsApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Contacts'],
  keepUnusedDataFor: CACHE_TIMES.CONTACTS,
  refetchOnMountOrArgChange: CACHE_TIMES.CONTACTS,
  endpoints: (builder) => ({
    updateContactName: builder.mutation({
      query: ({ uuid, name }) => ({
        url: `contacts/${uuid}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: (_, __, { uuid }) => [
        { type: 'Contacts', id: uuid },
        { type: 'Conversations', id: uuid },
      ],
    }),
  }),
});

export const { useUpdateContactNameMutation } = contactsApi;
