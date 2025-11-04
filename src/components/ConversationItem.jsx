import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { formatMessageForDisplay } from '../utils/messageUtils';

const ConversationItem = memo(({ item }) => {
  const displayMessage = formatMessageForDisplay(item?.lastMessage);
  const timeDisplay = moment(item?.closedAt || item?.createdAt).fromNow();

  return (
    <Link href={{ pathname: '/chat', params: item }} asChild>
      <TouchableWithoutFeedback
        testID={`conversationItem-${item.uuid}`}
        accessibilityLabel={`Conversation with ${item?.name}`}
      >
        <View style={styles.conversation}>
          <Image
            source={{ uri: `https://i.pravatar.cc/150?u=${item?.uuid}` }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <Text style={[styles.name, item?.unread && styles.unreadName]}>
                {item?.name}
              </Text>
              <Text style={styles.time}>{timeDisplay}</Text>
            </View>
            <View style={styles.messageRow}>
              <Text
                style={[styles.lastMessage, item?.unread && styles.unreadMessage]}
                numberOfLines={1}
              >
                {displayMessage}
              </Text>
              {item?.unread && (
                <View style={styles.unreadBadge}>
                  <MaterialIcons name="circle" size={12} color="#007AFF" />
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Link>
  );
});

ConversationItem.displayName = 'ConversationItem';

const styles = StyleSheet.create({
  conversation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00000030',
    backgroundColor: '#fff',
    gap: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 100,
    marginRight: 1,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  unreadName: {
    fontWeight: '800',
  },
  lastMessage: {
    fontSize: 12,
    color: '#6b7280',
    flexShrink: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: '#111827',
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
  },
  unreadBadge: {
    width: 16,
    alignItems: 'flex-end',
  },
});

export default ConversationItem;
