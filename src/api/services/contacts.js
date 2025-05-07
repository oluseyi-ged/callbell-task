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

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery,
  endpoints: (builder) => ({
    updateContactName: builder.mutation({
      query: ({ uuid, name }) => ({
        url: `contacts/${uuid}`,
        method: "PATCH",
        body: {
          name,
        },
      }),
    }),
  }),
})

export const { useUpdateContactNameMutation } = contactsApi
