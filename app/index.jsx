import { MaterialIcons } from "@expo/vector-icons"
import { Link } from "expo-router"
import moment from "moment"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native"
import { SwipeListView } from "react-native-swipe-list-view"
import { useDispatch, useSelector } from "react-redux"
import {
  useDeleteConversationMutation,
  useGetConversationsQuery,
} from "../src/api/services/conversations"
import {
  deleteConversations,
  setConversations,
} from "../src/store/conversationsSlice"

export default function ConversationsScreen() {
  const dispatch = useDispatch()
  const [swipeKey, setSwipeKey] = useState(0)
  const conversationsList = useSelector(
    (state) => state.conversations.conversations
  )

  const {
    data: conversations,
    isLoading,
    isError,
    isSuccess,
  } = useGetConversationsQuery(null, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  })

  const [deleteConversation] = useDeleteConversationMutation()

  useEffect(() => {
    if (isSuccess) {
      const indexedConversations = conversations.contacts.map(
        (item, index) => ({
          ...item,
          id: index,
        })
      )
      dispatch(setConversations(indexedConversations))
    }
  }, [isSuccess])

  const handleDeleteConvo = (id) => {
    deleteConversation(id)
    dispatch(deleteConversations(id))
    setSwipeKey(swipeKey + 1)
  }

  const renderItem = ({ item }) => (
    <Link href={{ pathname: "/chat", params: item }} asChild>
      <TouchableWithoutFeedback
        testID={`conversationItem-${item.id}`}
        accessibilityLabel={`conversationItem-${item.id}`}
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
              <Text style={styles.time}>
                {moment(item?.closedAt || item?.createdAt)?.fromNow()}
              </Text>
            </View>
            <View style={styles.messageRow}>
              <Text
                style={[
                  styles.lastMessage,
                  item?.unread && styles.unreadMessage,
                ]}
                numberOfLines={1}
              >
                {item?.lastMessage?.text?.includes("Bot")
                  ? item?.lastMessage?.text?.split(":")[0]
                  : item?.lastMessage?.text}
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
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>

      {isLoading && !conversationsList?.length ? (
        <ActivityIndicator
          testID="loadingIndicator"
          size="small"
          color="#007AFF"
        />
      ) : isError ? (
        <Text testID="errorState">Error fetching conversations</Text>
      ) : (
        <SwipeListView
          key={swipeKey}
          data={conversationsList}
          renderItem={renderItem}
          renderHiddenItem={({ item, index }, rowMap) => (
            <View style={styles.rowBack}>
              <View />
              <MaterialIcons
                testID={`deleteButton-${index}`}
                onPress={() => handleDeleteConvo(item.uuid)}
                name="delete-sweep"
                size={24}
                color="red"
              />
            </View>
          )}
          leftOpenValue={0}
          rightOpenValue={-50}
          disableRightSwipe
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer} testID="emptyState">
              <MaterialIcons
                testID="emptyIcon"
                name="chat"
                size={48}
                color="#ccc"
              />
              <Text testID="emptyText" style={styles.emptyText}>
                No conversations found yet
              </Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    color: "#1f2937",
  },
  conversation: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#00000030",
    backgroundColor: "#fff",
    gap: 10,
  },
  unreadConversation: {
    backgroundColor: "#e6f0ff",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 100,
    marginRight: 1,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  unreadName: {
    fontWeight: "800",
  },
  lastMessage: {
    fontSize: 12,
    color: "#6b7280",
    flexShrink: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: "#111827",
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#9ca3af",
  },
  separator: {
    height: 12,
  },
  unreadBadge: {
    width: 16,
    alignItems: "flex-end",
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
  },
})
