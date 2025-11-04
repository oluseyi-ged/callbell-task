import { renderHook } from '@testing-library/react-native';
import { useProcessedMessages } from './useMessages';

describe('useMessages hook', () => {
  const mockMessages = [
    {
      uuid: 'msg-1',
      text: 'Hello',
      createdAt: '2024-01-01T10:00:00Z',
      status: 'sent',
      attachments: [],
    },
    {
      uuid: 'msg-2',
      text: 'How are you?',
      createdAt: '2024-01-01T11:00:00Z',
      status: 'read',
      attachments: [null, { url: 'test.jpg' }],
    },
    {
      uuid: '',
      text: 'I am fine',
      createdAt: '2024-01-01T12:00:00Z',
      status: 'note',
      attachments: [],
    },
  ];

  it('should process messages correctly', () => {
    const { result } = renderHook(() => useProcessedMessages(mockMessages));

    expect(result.current).toHaveLength(3);
    expect(result.current[0].message).toBe('Hello');
    expect(result.current[0].fromMe).toBe(false);
    expect(result.current[0].read).toBe(false);
    expect(result.current[0].isNote).toBe(false);
  });

  it('should filter out messages without text or valid attachments', () => {
    const messagesWithEmpty = [
      ...mockMessages,
      {
        uuid: 'msg-4',
        text: '',
        createdAt: '2024-01-01T13:00:00Z',
        status: 'sent',
        attachments: [null],
      },
      {
        uuid: 'msg-5',
        text: '   ',
        createdAt: '2024-01-01T14:00:00Z',
        status: 'sent',
        attachments: null,
      },
    ];

    const { result } = renderHook(() => useProcessedMessages(messagesWithEmpty));

    expect(result.current).toHaveLength(3);
  });

  it('should sort messages by createdAt ascending', () => {
    const unsortedMessages = [
      {
        uuid: 'msg-3',
        text: 'Latest',
        createdAt: '2024-01-01T15:00:00Z',
        status: 'sent',
        attachments: [],
      },
      {
        uuid: 'msg-1',
        text: 'Earliest',
        createdAt: '2024-01-01T10:00:00Z',
        status: 'sent',
        attachments: [],
      },
      {
        uuid: 'msg-2',
        text: 'Middle',
        createdAt: '2024-01-01T12:00:00Z',
        status: 'sent',
        attachments: [],
      },
    ];

    const { result } = renderHook(() => useProcessedMessages(unsortedMessages));

    expect(result.current[0].message).toBe('Earliest');
    expect(result.current[1].message).toBe('Middle');
    expect(result.current[2].message).toBe('Latest');
  });

  it('should handle empty message array', () => {
    const { result } = renderHook(() => useProcessedMessages([]));
    expect(result.current).toEqual([]);
  });

  it('should handle null messages', () => {
    const { result } = renderHook(() => useProcessedMessages(null));
    expect(result.current).toEqual([]);
  });

  it('should handle undefined messages', () => {
    const { result } = renderHook(() => useProcessedMessages(undefined));
    expect(result.current).toEqual([]);
  });

  it('should identify messages from user correctly', () => {
    const { result } = renderHook(() => useProcessedMessages(mockMessages));

    const userMessage = result.current.find((msg) => msg.fromMe);
    expect(userMessage).toBeDefined();
    expect(userMessage.id).toContain('2024-01-01T12:00:00');
  });

  it('should format time correctly', () => {
    const { result } = renderHook(() => useProcessedMessages(mockMessages));

    expect(result.current[0].time).toMatch(/\d{2}:\d{2}/);
  });

  it('should filter null attachments', () => {
    const { result } = renderHook(() => useProcessedMessages(mockMessages));

    const msgWithAttachments = result.current.find((msg) => msg.attachments?.length > 0);
    expect(msgWithAttachments).toBeDefined();
    expect(msgWithAttachments.attachments).toHaveLength(1);
    expect(msgWithAttachments.attachments[0].url).toBe('test.jpg');
  });

  it('should memoize result when input does not change', () => {
    const { result, rerender } = renderHook(
      ({ messages }) => useProcessedMessages(messages),
      { initialProps: { messages: mockMessages } }
    );

    const firstResult = result.current;
    rerender({ messages: mockMessages });
    const secondResult = result.current;

    expect(firstResult).toBe(secondResult);
  });
});
