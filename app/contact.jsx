import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useDispatch } from "react-redux"
import { useUpdateContactNameMutation } from "../src/api/services/contacts"
import { updateConversationName } from "../src/store/conversationsSlice"

export default function ContactScreen() {
  const params = useLocalSearchParams()
  const dispatch = useDispatch()
  const {
    name: initialName,
    phoneNumber,
    closedAt,
    href,
    source,
    uuid,
  } = params

  const [name, setName] = useState(initialName)
  const [updateContactName, { isLoading, isSuccess, isError, error }] =
    useUpdateContactNameMutation()

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        updateConversationName({
          uuid: uuid,
          newName: name,
        })
      )
      setIsEditing(false)
      Alert.alert("Success", "Contact name updated successfully.")
    }
    if (isError) {
      setIsEditing(false)
      setName(initialName)
      Alert.alert(
        "Error",
        error?.data?.message || "Failed to update contact name."
      )
    }
  }, [isSuccess, isError])

  const [isEditing, setIsEditing] = useState(false)

  const handleSaveName = async () => {
    await updateContactName({ uuid, name })
  }

  return (
    <View style={styles.container} testID="contactScreen">
      {/* Profile section */}
      <View style={styles.profile}>
        <Image
          testID="contactImg"
          source={{ uri: `https://i.pravatar.cc/150?u=${uuid}` }}
          style={styles.avatar}
        />

        {isEditing ? (
          <View style={styles.nameEditContainer}>
            <TextInput
              testID="nameInput"
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              autoFocus
            />
            {isLoading ? (
              <ActivityIndicator
                testID="saveLoadingIndicator"
                size="small"
                color="#007AFF"
              />
            ) : (
              <TouchableOpacity
                testID="saveButton"
                onPress={handleSaveName}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.nameContainer}>
            <Text testID="contactNameText" style={styles.name}>
              {name}
            </Text>
            <TouchableOpacity
              testID="editButton"
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
            >
              <MaterialIcons name="edit" size={18} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        )}

        <Text testID="phoneNumberText" style={styles.username}>
          {phoneNumber}
        </Text>
      </View>

      {/* Contact info sections */}
      <View style={styles.infoBlock} testID="sourceInfoBlock">
        <Feather name="info" size={20} color="#6b7280" />
        <Text testID="sourceText" style={styles.infoText}>
          Source: {source}
        </Text>
      </View>

      <View style={styles.metaBlock} testID="emailBlock">
        <MaterialIcons name="email" size={20} color="#6b7280" />
        <Text testID="emailText" style={styles.metaText}>
          {href}
        </Text>
      </View>

      <View style={styles.metaBlock} testID="phoneBlock">
        <Feather name="phone" size={20} color="#6b7280" />
        <Text testID="phoneText" style={styles.metaText}>
          {phoneNumber}
        </Text>
      </View>

      <View style={styles.metaBlock} testID="lastContactedBlock">
        <AntDesign name="calendar" size={20} color="#6b7280" />
        <Text testID="lastContactedText" style={styles.metaText}>
          Last contacted: {new Date(closedAt).toDateString()}
        </Text>
      </View>

      {/* Back to conversations button */}
      <TouchableOpacity
        testID="backToConversationsButton"
        style={styles.backToConversationsButton}
        onPress={() => router.dismiss(2)}
      >
        <Text style={styles.backToConversationsText}>
          Back to Conversations
        </Text>
      </TouchableOpacity>
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
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  nameInput: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    padding: 4,
    minWidth: 200,
    textAlign: "center",
  },
  username: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  editButton: {
    padding: 4,
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
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
  backToConversationsButton: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    alignItems: "center",
  },
  backToConversationsText: {
    color: "white",
    fontWeight: "600",
  },
})
