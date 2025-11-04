import conversationsReducer, {
  setConversations,
  addConversation,
  deleteConversations,
  clearConversations,
  updateLastMessage,
  updateConversationName,
  setStatus,
  setError,
  conversationsSelectors,
  selectConversationName,
} from './conversationsSlice';

describe('conversationsSlice', () => {
  const mockConversation1 = {
    uuid: 'test-uuid-1',
    name: 'John Doe',
    phoneNumber: '+1234567890',
    createdAt: '2024-01-01T00:00:00Z',
    lastMessage: {
      text: 'Hello',
      time: '2024-01-01T00:00:00Z',
      from: 'them',
      status: 'sent',
    },
  };

  const mockConversation2 = {
    uuid: 'test-uuid-2',
    name: 'Jane Smith',
    phoneNumber: '+0987654321',
    createdAt: '2024-01-02T00:00:00Z',
    lastMessage: {
      text: 'Hi there',
      time: '2024-01-02T00:00:00Z',
      from: 'me',
      status: 'read',
    },
  };

  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(conversationsReducer(undefined, { type: 'unknown' })).toEqual({
        ids: [],
        entities: {},
        status: 'idle',
        error: null,
      });
    });

    it('should handle setConversations', () => {
      const state = conversationsReducer(
        undefined,
        setConversations([mockConversation1, mockConversation2])
      );

      expect(state.ids).toHaveLength(2);
      expect(state.entities[mockConversation1.uuid]).toEqual(mockConversation1);
      expect(state.entities[mockConversation2.uuid]).toEqual(mockConversation2);
    });

    it('should handle addConversation', () => {
      const initialState = conversationsReducer(undefined, setConversations([mockConversation1]));
      const state = conversationsReducer(initialState, addConversation(mockConversation2));

      expect(state.ids).toHaveLength(2);
      expect(state.entities[mockConversation2.uuid]).toEqual(mockConversation2);
    });

    it('should handle deleteConversations', () => {
      const initialState = conversationsReducer(
        undefined,
        setConversations([mockConversation1, mockConversation2])
      );
      const state = conversationsReducer(initialState, deleteConversations('test-uuid-1'));

      expect(state.ids).toHaveLength(1);
      expect(state.entities['test-uuid-1']).toBeUndefined();
      expect(state.entities['test-uuid-2']).toEqual(mockConversation2);
    });

    it('should handle clearConversations', () => {
      const initialState = conversationsReducer(
        undefined,
        setConversations([mockConversation1, mockConversation2])
      );
      const state = conversationsReducer(initialState, clearConversations());

      expect(state.ids).toHaveLength(0);
      expect(state.entities).toEqual({});
      expect(state.status).toBe('idle');
      expect(state.error).toBeNull();
    });

    it('should handle updateLastMessage', () => {
      const initialState = conversationsReducer(undefined, setConversations([mockConversation1]));
      const newMessage = {
        text: 'Updated message',
        createdAt: '2024-01-03T00:00:00Z',
        from: 'me',
        status: 'sent',
      };

      const state = conversationsReducer(
        initialState,
        updateLastMessage({ uuid: 'test-uuid-1', message: newMessage })
      );

      expect(state.entities['test-uuid-1'].lastMessage.text).toBe('Updated message');
      expect(state.entities['test-uuid-1'].lastMessage.time).toBe('2024-01-03T00:00:00Z');
    });

    it('should not update lastMessage for non-existent conversation', () => {
      const initialState = conversationsReducer(undefined, setConversations([mockConversation1]));
      const newMessage = {
        text: 'Updated message',
        createdAt: '2024-01-03T00:00:00Z',
        from: 'me',
        status: 'sent',
      };

      const state = conversationsReducer(
        initialState,
        updateLastMessage({ uuid: 'non-existent', message: newMessage })
      );

      expect(state).toEqual(initialState);
    });

    it('should handle updateConversationName', () => {
      const initialState = conversationsReducer(undefined, setConversations([mockConversation1]));
      const state = conversationsReducer(
        initialState,
        updateConversationName({ uuid: 'test-uuid-1', newName: 'John Updated' })
      );

      expect(state.entities['test-uuid-1'].name).toBe('John Updated');
    });

    it('should not update name for non-existent conversation', () => {
      const initialState = conversationsReducer(undefined, setConversations([mockConversation1]));
      const state = conversationsReducer(
        initialState,
        updateConversationName({ uuid: 'non-existent', newName: 'Test' })
      );

      expect(state).toEqual(initialState);
    });

    it('should handle setStatus', () => {
      const state = conversationsReducer(undefined, setStatus('loading'));
      expect(state.status).toBe('loading');
    });

    it('should handle setError', () => {
      const errorMessage = 'Something went wrong';
      const state = conversationsReducer(undefined, setError(errorMessage));

      expect(state.error).toBe(errorMessage);
      expect(state.status).toBe('failed');
    });

    it('should upsert conversations correctly', () => {
      const initialState = conversationsReducer(undefined, setConversations([mockConversation1]));
      const updatedConversation = {
        ...mockConversation1,
        name: 'John Updated',
      };

      const state = conversationsReducer(initialState, setConversations([updatedConversation]));

      expect(state.ids).toHaveLength(1);
      expect(state.entities['test-uuid-1'].name).toBe('John Updated');
    });
  });

  describe('selectors', () => {
    const mockState = {
      conversations: {
        ids: ['test-uuid-1', 'test-uuid-2'],
        entities: {
          'test-uuid-1': mockConversation1,
          'test-uuid-2': mockConversation2,
        },
        status: 'success',
        error: null,
      },
    };

    it('should select all conversations', () => {
      const conversations = conversationsSelectors.selectAll(mockState);
      expect(conversations).toHaveLength(2);
      expect(conversations[0]).toEqual(mockConversation1);
    });

    it('should select conversation by id', () => {
      const conversation = conversationsSelectors.selectById(mockState, 'test-uuid-1');
      expect(conversation).toEqual(mockConversation1);
    });

    it('should select total count', () => {
      const total = conversationsSelectors.selectTotal(mockState);
      expect(total).toBe(2);
    });

    it('should select conversation name', () => {
      const selector = selectConversationName('test-uuid-1');
      const name = selector(mockState);
      expect(name).toBe('John Doe');
    });

    it('should return Unknown for non-existent conversation', () => {
      const selector = selectConversationName('non-existent');
      const name = selector(mockState);
      expect(name).toBe('Unknown');
    });
  });

  describe('sorting', () => {
    it('should sort conversations by lastMessage time descending', () => {
      const olderConversation = {
        ...mockConversation1,
        lastMessage: {
          ...mockConversation1.lastMessage,
          time: '2024-01-01T00:00:00Z',
        },
      };

      const newerConversation = {
        ...mockConversation2,
        lastMessage: {
          ...mockConversation2.lastMessage,
          time: '2024-01-05T00:00:00Z',
        },
      };

      const state = conversationsReducer(
        undefined,
        setConversations([olderConversation, newerConversation])
      );

      const conversations = conversationsSelectors.selectAll({ conversations: state });
      expect(conversations[0].uuid).toBe('test-uuid-2');
      expect(conversations[1].uuid).toBe('test-uuid-1');
    });
  });
});
