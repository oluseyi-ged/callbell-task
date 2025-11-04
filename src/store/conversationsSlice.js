import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';

const conversationsAdapter = createEntityAdapter({
  selectId: (conversation) => conversation.uuid,
  sortComparer: (a, b) => {
    const timeA = a.lastMessage?.time || a.createdAt || '';
    const timeB = b.lastMessage?.time || b.createdAt || '';
    return timeB.localeCompare(timeA);
  },
});

const initialState = conversationsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversations: conversationsAdapter.upsertMany,

    addConversation: conversationsAdapter.addOne,

    deleteConversations(state, action) {
      conversationsAdapter.removeOne(state, action.payload);
    },

    clearConversations(state) {
      conversationsAdapter.removeAll(state);
      state.status = 'idle';
      state.error = null;
    },

    updateLastMessage(state, action) {
      const { uuid, message } = action.payload;
      const conversation = state.entities[uuid];

      if (conversation) {
        conversationsAdapter.updateOne(state, {
          id: uuid,
          changes: {
            lastMessage: {
              text: message.text,
              time: message.createdAt,
              from: message.from,
              status: message.status,
            },
          },
        });
      }
    },

    updateConversationName(state, action) {
      const { uuid, newName } = action.payload;

      if (state.entities[uuid]) {
        conversationsAdapter.updateOne(state, {
          id: uuid,
          changes: { name: newName },
        });
      }
    },

    setStatus(state, action) {
      state.status = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

export const {
  setConversations,
  addConversation,
  deleteConversations,
  clearConversations,
  updateLastMessage,
  updateConversationName,
  setStatus,
  setError,
} = conversationsSlice.actions;

export const conversationsSelectors = conversationsAdapter.getSelectors(
  (state) => state.conversations
);

export const selectConversationById = (uuid) =>
  createSelector(
    [conversationsSelectors.selectById],
    (selectById) => selectById(uuid)
  );

export const selectConversationName = (uuid) =>
  createSelector(
    [(state) => conversationsSelectors.selectById(state, uuid)],
    (conversation) => conversation?.name || 'Unknown'
  );

export const selectAllConversationsSorted = createSelector(
  [conversationsSelectors.selectAll],
  (conversations) => conversations
);

export const selectConversationsCount = createSelector(
  [conversationsSelectors.selectTotal],
  (total) => total
);

export const selectConversationsStatus = (state) => state.conversations.status;
export const selectConversationsError = (state) => state.conversations.error;

export default conversationsSlice.reducer;
