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

export const conversationsApi = createApi({
  reducerPath: "conversationsApi",
  baseQuery,
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: "contacts",
      }),
    }),
    deleteConversation: builder.mutation({
      query: (uuid) => ({
        url: `contacts/${uuid}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { useGetConversationsQuery, useDeleteConversationMutation } =
  conversationsApi
