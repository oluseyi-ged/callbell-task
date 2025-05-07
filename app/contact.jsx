import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons"
import { Image, StyleSheet, Text, View } from "react-native"

export default function ContactScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=1" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Ada Lovelace</Text>
        <Text style={styles.username}>@ada.codes</Text>
      </View>

      <View style={styles.infoBlock}>
        <Feather name="info" size={20} color="#6b7280" />
        <Text style={styles.infoText}>
          Software engineer, lover of algorithms, co-creator of the Analytical
          Engine.
        </Text>
      </View>

      <View style={styles.metaBlock}>
        <MaterialIcons name="email" size={20} color="#6b7280" />
        <Text style={styles.metaText}>ada@maths.io</Text>
      </View>

      <View style={styles.metaBlock}>
        <Feather name="phone" size={20} color="#6b7280" />
        <Text style={styles.metaText}>+44 20 1234 5678</Text>
      </View>

      <View style={styles.metaBlock}>
        <AntDesign name="calendar" size={20} color="#6b7280" />
        <Text style={styles.metaText}>Last contacted: May 3, 2025</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    color: "#111827",
  },
  profile: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  username: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  infoBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginVertical: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  metaBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    gap: 10,
  },
  metaText: {
    fontSize: 16,
    color: "#374151",
  },
})
