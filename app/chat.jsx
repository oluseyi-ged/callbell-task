import { AntDesign, MaterialIcons } from "@expo/vector-icons"
import { Link, router, useLocalSearchParams } from "expo-router"
import { useEffect, useRef } from "react"
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
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { useGetMessagesQuery } from "../src/api/services/messages"
import { updateLastMessage } from "../src/store/conversationsSlice"

export default function ChatScreen() {
  const params = useLocalSearchParams()
  const { uuid } = params
  const flatListRef = useRef()
  const dispatch = useDispatch()
  const contactName = useSelector(
    (state) =>
      state.conversations.conversations.find((c) => c?.uuid === uuid)?.name ||
      "Unknown"
  )

  useEffect(() => {
    if (chatsList?.length) {
      const latestMessage = chatsList[chatsList?.length - 1]
      console.log(latestMessage, "crtpytooo")
      dispatch(
        updateLastMessage({
          uuid,
          message: {
            text: latestMessage?.message,
            createdAt: new Date(latestMessage.createdAt).toISOString(),
            from: latestMessage?.fromMe ? "me" : "them",
            status: latestMessage?.read ? "read" : "sent",
            isNote: latestMessage?.isNote,
          },
        })
      )
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false })
      }, 100)
    }
  }, [chatsList])

  const {
    data: chats,
    isLoading,
    isError,
    isSuccess,
  } = useGetMessagesQuery(uuid, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  })

  const chatsList = chats?.messages
    ?.filter((msg) => {
      const hasValidText = msg.text?.trim()
      const hasValidAttachments = msg.attachments?.some(
        (attachment) => attachment !== null
      )
      return hasValidText || hasValidAttachments
    })
    ?.map((msg) => ({
      id: msg.uuid || `${msg.createdAt}-${msg.from}`,
      message: msg.text,
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fromMe: !msg?.uuid?.length,
      read: msg.status === "read",
      isNote: msg.status === "note",
      attachments: msg.attachments?.filter((attachment) => attachment !== null),
      createdAt: new Date(msg.createdAt),
    }))
    ?.sort((a, b) => a.createdAt - b.createdAt)

  const renderItem = ({ item, index }) => {
    if (item.isNote) {
      const cleanedNote = item.message?.split(":")[0]
      return (
        <View style={styles.noteContainer} testID={`note-${index}`}>
          <Text style={styles.systemNoteText}>{cleanedNote}</Text>
        </View>
      )
    }

    return (
      <View
        testID={`chatItem-${index}`}
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
                name={item.read ? "done-all" : "check"}
                size={14}
                color={item.read ? "#007AFF" : "#9ca3af"}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </View>
      </View>
    )
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

        <Link href={{ pathname: "/contact", params }} asChild>
          <TouchableOpacity testID="contactName">
            <Text style={styles.userName}>{contactName}</Text>
          </TouchableOpacity>
        </Link>

        <AntDesign
          name="phone"
          size={22}
          color="#374151"
          style={{ marginLeft: "auto" }}
        />
      </View>

      {isLoading && !chatsList?.length ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      ) : isError ? (
        <Text>Error fetching messages</Text>
      ) : (
        <FlatList
          data={chatsList}
          keyExtractor={(item, index) => `${item.createdAt || index}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.chat}
          showsVerticalScrollIndicator={false}
          testID="chatList"
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          testID="typeInput"
          placeholder="Type a message..."
          style={styles.input}
        />
        <TouchableOpacity testID="sendBtn">
          <AntDesign name="arrowup" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#e5e5e5",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  chat: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: "75%",
  },
  messageLeft: {
    alignSelf: "flex-start",
  },
  messageRight: {
    alignSelf: "flex-end",
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
  },
  myBubble: {
    backgroundColor: "#007AFF",
  },
  theirBubble: {
    backgroundColor: "#e5e7eb",
  },
  messageText: {
    color: "#fff",
    fontSize: 14,
  },
  receiptText: {
    color: "#000",
    fontSize: 14,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    color: "#d1d5db",
  },
  receiptTime: {
    fontSize: 11,
    color: "#00000080",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 10,
    fontSize: 16,
  },
  backButton: {
    marginRight: 12,
  },
  systemNoteText: {
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    marginVertical: 12,
    fontStyle: "italic",
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
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  loadingBox: {
    flex: 1,
    marginVertical: 24,
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
})
