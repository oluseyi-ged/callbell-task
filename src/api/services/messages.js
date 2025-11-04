import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithRetry from '../baseQuery';
import { CACHE_TIMES } from '../../constants';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Messages'],
  keepUnusedDataFor: CACHE_TIMES.MESSAGES,
  refetchOnMountOrArgChange: CACHE_TIMES.MESSAGES,
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (uuid) => ({
        url: `contacts/${uuid}/messages`,
      }),
      providesTags: (_, __, uuid) => [
        { type: 'Messages', id: uuid },
        { type: 'Messages', id: 'LIST' },
      ],
      transformResponse: (response) => {
        if (!response?.messages) {
          return { messages: [] };
        }
        return response;
      },
    }),
    sendMessage: builder.mutation({
      query: ({ uuid, text }) => ({
        url: `contacts/${uuid}/messages`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (_, __, { uuid }) => [
        { type: 'Messages', id: uuid },
        { type: 'Messages', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messagesApi;
