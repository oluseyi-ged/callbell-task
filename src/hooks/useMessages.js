import { useMemo } from 'react';

export const useProcessedMessages = (messages) => {
  return useMemo(() => {
    if (!messages) return [];

    return messages
      .filter((msg) => {
        const hasValidText = msg.text?.trim();
        const hasValidAttachments = msg.attachments?.some(
          (attachment) => attachment !== null
        );
        return hasValidText || hasValidAttachments;
      })
      .map((msg) => ({
        id: msg.uuid || `${msg.createdAt}-${msg.from}`,
        message: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        fromMe: !msg?.uuid?.length,
        read: msg.status === 'read',
        isNote: msg.status === 'note',
        attachments: msg.attachments?.filter((attachment) => attachment !== null),
        createdAt: new Date(msg.createdAt),
      }))
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [messages]);
};
