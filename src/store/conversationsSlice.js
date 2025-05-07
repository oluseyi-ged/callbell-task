import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  conversations: [],
}

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations(state, action) {
      const incoming = action.payload

      incoming.forEach((incomingConv) => {
        const index = state.conversations.findIndex(
          (c) => c.uuid === incomingConv.uuid
        )

        if (index !== -1) {
          state.conversations[index] = {
            ...state.conversations[index],
            ...incomingConv,
          }
        } else {
          state.conversations.push(incomingConv)
        }
      })
    },
    deleteConversations(state, action) {
      state.conversations = state.conversations.filter(
        (c) => c.uuid !== action.payload
      )
    },
    clearConversations(state) {
      state.conversations = []
    },
    updateLastMessage(state, action) {
      const { uuid, message } = action.payload
      const index = state.conversations.findIndex((c) => c.uuid === uuid)
      if (index !== -1) {
        state.conversations[index].lastMessage = {
          text: message.text,
          time: message.createdAt,
          from: message.from,
          status: message.status,
        }
      }
    },
    updateConversationName(state, action) {
      const { uuid, newName } = action.payload
      const index = state.conversations.findIndex((c) => c.uuid === uuid)
      if (index !== -1) {
        state.conversations[index].name = newName
      }
    },
  },
})

export const {
  setConversations,
  deleteConversations,
  clearConversations,
  updateLastMessage,
  updateConversationName,
} = conversationsSlice.actions

export default conversationsSlice.reducer
