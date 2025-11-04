import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithRetry from '../baseQuery';
import { CACHE_TIMES } from '../../constants';

export const conversationsApi = createApi({
  reducerPath: 'conversationsApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Conversations'],
  keepUnusedDataFor: CACHE_TIMES.CONVERSATIONS,
  refetchOnMountOrArgChange: CACHE_TIMES.CONVERSATIONS,
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: 'contacts',
      }),
      providesTags: (result) =>
        result?.contacts
          ? [
              ...result.contacts.map(({ uuid }) => ({ type: 'Conversations', id: uuid })),
              { type: 'Conversations', id: 'LIST' },
            ]
          : [{ type: 'Conversations', id: 'LIST' }],
      transformResponse: (response) => {
        if (!response?.contacts) {
          return { contacts: [] };
        }
        return response;
      },
    }),
    deleteConversation: builder.mutation({
      query: (uuid) => ({
        url: `contacts/${uuid}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, uuid) => [
        { type: 'Conversations', id: uuid },
        { type: 'Conversations', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetConversationsQuery, useDeleteConversationMutation } = conversationsApi;
