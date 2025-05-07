import { MaterialIcons } from "@expo/vector-icons"
import { Link } from "expo-router"
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

const dummyConversations = [
  {
    id: "1",
    name: "Ada Lovelace",
    lastMessage: "Let's catch up tonight.",
    image: "https://i.pravatar.cc/150?img=1",
    time: "10:30 AM",
    unread: true,
  },
  {
    id: "2",
    name: "Grace Hopper",
    lastMessage: "I'll send the file now.",
    image: "https://i.pravatar.cc/150?img=2",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "3",
    name: "Alan Turing",
    lastMessage: "Great job on the project!",
    image: "https://i.pravatar.cc/150?img=3",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "4",
    name: "Katherine Johnson",
    lastMessage: "Call me when you're free.",
    image: "https://i.pravatar.cc/150?img=4",
    time: "2 days ago",
    unread: true,
  },
  {
    id: "5",
    name: "Dennis Ritchie",
    lastMessage: "Looks good to me.",
    image: "https://i.pravatar.cc/150?img=5",
    time: "3 days ago",
    unread: false,
  },
  {
    id: "6",
    name: "Barbara Liskov",
    lastMessage: "Can we reschedule?",
    image: "https://i.pravatar.cc/150?img=6",
    time: "1 week ago",
    unread: false,
  },
  {
    id: "7",
    name: "Tim Berners-Lee",
    lastMessage: "Check your email.",
    image: "https://i.pravatar.cc/150?img=7",
    time: "1 week ago",
    unread: false,
  },
  {
    id: "8",
    name: "Margaret Hamilton",
    lastMessage: "Meeting is at 3pm.",
    image: "https://i.pravatar.cc/150?img=8",
    time: "2 weeks ago",
    unread: false,
  },
  {
    id: "9",
    name: "Linus Torvalds",
    lastMessage: "I'll push the changes.",
    image: "https://i.pravatar.cc/150?img=9",
    time: "2 weeks ago",
    unread: false,
  },
  {
    id: "10",
    name: "James Gosling",
    lastMessage: "Thanks for the update.",
    image: "https://i.pravatar.cc/150?img=10",
    time: "3 weeks ago",
    unread: false,
  },
]

export default function ConversationsScreen() {
  const renderItem = ({ item }) => (
    <Link href={`/chat`} asChild>
      {/* <Link href={`/chat/${item.id}`} asChild> */}
      <TouchableOpacity style={styles.conversation}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, item.unread && styles.unreadName]}>
              {item.name}
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <View style={styles.messageRow}>
            <Text
              style={[styles.lastMessage, item.unread && styles.unreadMessage]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            {item.unread && (
              <View style={styles.unreadBadge}>
                <MaterialIcons name="circle" size={12} color="#007AFF" />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={dummyConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f4f7",
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
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
})
