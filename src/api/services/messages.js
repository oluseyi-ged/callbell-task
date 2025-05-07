import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.CALLBELL_API_URL,
  prepareHeaders: (headers) => {
    const token = process.env.CALLBELL_API_KEY
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    return headers
  },
})

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery,
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (uuid) => ({
        url: `contacts/${uuid}/messages`,
      }),
    }),
    deleteMessage: builder.mutation({
      query: (uuid) => ({
        url: `contacts/${uuid}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { useGetMessagesQuery, useDeleteMessageMutation } = messagesApi
