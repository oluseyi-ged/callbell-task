import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMessagesQuery, useSendMessageMutation } from '../src/api/services/messages';
import { updateLastMessage, selectConversationName } from '../src/store/conversationsSlice';
import MessageItem from '../src/components/MessageItem';
import { useProcessedMessages } from '../src/hooks/useMessages';
import { ERROR_MESSAGES } from '../src/constants';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const { uuid } = params;
  const flatListRef = useRef();
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const contactName = useSelector((state) => selectConversationName(uuid)(state));

  const {
    data: chats,
    isLoading,
    isError,
    error,
  } = useGetMessagesQuery(uuid, {
    pollingInterval: 15000,
  });

  const [sendMessage] = useSendMessageMutation();

  const chatsList = useProcessedMessages(chats?.messages);

  useEffect(() => {
    if (chatsList?.length > 0) {
      const latestMessage = chatsList[chatsList.length - 1];
      dispatch(
        updateLastMessage({
          uuid,
          message: {
            text: latestMessage.message,
            createdAt: latestMessage.createdAt.toISOString(),
            from: latestMessage.fromMe ? 'me' : 'them',
            status: latestMessage.read ? 'read' : 'sent',
            isNote: latestMessage.isNote,
          },
        })
      );
    }
  }, [chatsList, uuid, dispatch]);

  const scrollToEnd = useCallback(() => {
    if (flatListRef.current && chatsList?.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatsList]);

  useEffect(() => {
    scrollToEnd();
  }, [scrollToEnd]);

  const handleSendMessage = useCallback(async () => {
    const trimmedText = messageText.trim();

    if (!trimmedText) {
      return;
    }

    setIsSending(true);
    setMessageText('');

    try {
      await sendMessage({ uuid, text: trimmedText }).unwrap();
      scrollToEnd();
    } catch (err) {
      setMessageText(trimmedText);
      Alert.alert(
        'Failed to Send',
        err?.data?.message || ERROR_MESSAGES.API_ERROR,
        [{ text: 'OK' }]
      );
      if (__DEV__) {
        console.error('Failed to send message:', err);
      }
    } finally {
      setIsSending(false);
    }
  }, [messageText, sendMessage, uuid, scrollToEnd]);

  const renderItem = useCallback(
    ({ item }) => <MessageItem item={item} />,
    []
  );

  const keyExtractor = useCallback((item, index) => item.id || `msg-${index}`, []);

  const onContentSizeChange = useCallback(() => {
    if (chatsList?.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: false });
    }
  }, [chatsList]);

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="chat-bubble-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No messages yet</Text>
        <Text style={styles.emptySubtext}>Start the conversation!</Text>
      </View>
    ),
    []
  );

  if (isLoading && !chatsList?.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            testID="backBtn"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="#111827" />
          </TouchableOpacity>
          <Image
            testID="avatar"
            source={{ uri: `https://i.pravatar.cc/150?u=${uuid}` }}
            style={styles.avatar}
          />
          <Link href={{ pathname: '/contact', params }} asChild>
            <TouchableOpacity testID="contactName">
              <Text style={styles.userName}>{contactName}</Text>
            </TouchableOpacity>
          </Link>
          <AntDesign
            name="phone"
            size={22}
            color="#374151"
            style={styles.phoneIcon}
          />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            testID="backBtn"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="#111827" />
          </TouchableOpacity>
          <Image
            testID="avatar"
            source={{ uri: `https://i.pravatar.cc/150?u=${uuid}` }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{contactName}</Text>
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={64} color="#ef4444" />
          <Text style={styles.errorText}>
            {error?.data?.message || ERROR_MESSAGES.NETWORK_ERROR}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          testID="backBtn"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="#111827" />
        </TouchableOpacity>

        <Image
          testID="avatar"
          source={{ uri: `https://i.pravatar.cc/150?u=${uuid}` }}
          style={styles.avatar}
        />

        <Link href={{ pathname: '/contact', params }} asChild>
          <TouchableOpacity testID="contactName">
            <Text style={styles.userName}>{contactName}</Text>
          </TouchableOpacity>
        </Link>

        <AntDesign
          name="phone"
          size={22}
          color="#374151"
          style={styles.phoneIcon}
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={chatsList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.chat}
        showsVerticalScrollIndicator={false}
        testID="chatList"
        onContentSizeChange={onContentSizeChange}
        ListEmptyComponent={ListEmptyComponent}
        removeClippedSubviews
        maxToRenderPerBatch={20}
        windowSize={10}
      />

      <View style={styles.inputContainer}>
        <TextInput
          testID="typeInput"
          placeholder="Type a message..."
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          editable={!isSending}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          testID="sendBtn"
          onPress={handleSendMessage}
          disabled={!messageText.trim() || isSending}
          style={[
            styles.sendButton,
            (!messageText.trim() || isSending) && styles.sendButtonDisabled,
          ]}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <AntDesign
              name="arrowup"
              size={24}
              color={messageText.trim() ? '#007AFF' : '#9ca3af'}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#e5e5e5',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  chat: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  backButton: {
    marginRight: 12,
  },
  phoneIcon: {
    marginLeft: 'auto',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
