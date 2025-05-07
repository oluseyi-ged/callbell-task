import { AntDesign, MaterialIcons } from "@expo/vector-icons"
import { Link, router } from "expo-router"
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const dummyMessages = [
  {
    id: "1",
    fromMe: false,
    message: "Hey Seyi! How's it going?",
    time: "10:15 AM",
    read: true,
  },
  {
    id: "2",
    fromMe: true,
    message: "Hey! All good. Just working on a new app.",
    time: "10:17 AM",
    read: true,
  },
  {
    id: "3",
    fromMe: false,
    message: "Nice! Can’t wait to see it.",
    time: "10:18 AM",
    read: false,
  },
  {
    id: "4",
    fromMe: true,
    message: "Will send you a preview this evening.",
    time: "10:20 AM",
    read: false,
  },
]

export default function ChatScreen() {
  const renderItem = ({ item }) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="#111827" />
        </TouchableOpacity>

        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=1" }}
          style={styles.avatar}
        />

        <Link href="/contact" asChild>
          <TouchableOpacity>
            <Text style={styles.userName}>Ada Lovelace</Text>
          </TouchableOpacity>
        </Link>

        <AntDesign
          name="phone"
          size={22}
          color="#374151"
          style={{ marginLeft: "auto" }}
        />
      </View>

      <FlatList
        data={dummyMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chat}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput placeholder="Type a message..." style={styles.input} />
        <TouchableOpacity>
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
})
