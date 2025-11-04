import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { extractBotMessage } from '../utils/messageUtils';

const MessageItem = memo(({ item }) => {
  if (item.isNote) {
    const cleanedNote = extractBotMessage(item.message);
    return (
      <View style={styles.noteContainer}>
        <Text style={styles.systemNoteText}>{cleanedNote}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.messageContainer,
        item.fromMe ? styles.messageRight : styles.messageLeft,
      ]}
    >
      <View
        style={[
          styles.bubble,
          item.fromMe ? styles.myBubble : styles.theirBubble,
        ]}
      >
        <Text style={item.fromMe ? styles.messageText : styles.receiptText}>
          {item.message}
        </Text>
        <View style={styles.meta}>
          <Text style={item.fromMe ? styles.time : styles.receiptTime}>
            {item.time}
          </Text>
          {item.fromMe && (
            <MaterialIcons
              name={item.read ? 'done-all' : 'check'}
              size={14}
              color={item.read ? '#007AFF' : '#9ca3af'}
              style={styles.checkIcon}
            />
          )}
        </View>
      </View>
    </View>
  );
});

MessageItem.displayName = 'MessageItem';

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 6,
    maxWidth: '75%',
  },
  messageLeft: {
    alignSelf: 'flex-start',
  },
  messageRight: {
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
  },
  myBubble: {
    backgroundColor: '#007AFF',
  },
  theirBubble: {
    backgroundColor: '#e5e7eb',
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  receiptText: {
    color: '#000',
    fontSize: 14,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    color: '#d1d5db',
  },
  receiptTime: {
    fontSize: 11,
    color: '#00000080',
  },
  checkIcon: {
    marginLeft: 4,
  },
  noteContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemNoteText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default MessageItem;
