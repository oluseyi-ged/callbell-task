import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useUpdateContactNameMutation } from '../src/api/services/contacts';
import { updateConversationName } from '../src/store/conversationsSlice';
import { validateName, sanitizeInput } from '../src/utils/validation';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, NAVIGATION } from '../src/constants';

export default function ContactScreen() {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const {
    name: initialName,
    phoneNumber,
    closedAt,
    href,
    source,
    uuid,
  } = params;

  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const [updateContactName, { isLoading, isSuccess, isError, error, reset }] =
    useUpdateContactNameMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        updateConversationName({
          uuid,
          newName: name,
        })
      );
      setIsEditing(false);
      setValidationError(null);
      Alert.alert('Success', SUCCESS_MESSAGES.NAME_UPDATED);
      reset();
    }
  }, [isSuccess, dispatch, uuid, name, reset]);

  useEffect(() => {
    if (isError) {
      setIsEditing(false);
      setName(initialName);
      setValidationError(null);
      Alert.alert(
        'Error',
        error?.data?.message || ERROR_MESSAGES.API_ERROR
      );
      reset();
    }
  }, [isError, error, initialName, reset]);

  const handleSaveName = useCallback(async () => {
    const sanitizedName = sanitizeInput(name);
    const validation = validateName(sanitizedName);

    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    setValidationError(null);

    try {
      await updateContactName({ uuid, name: sanitizedName }).unwrap();
    } catch (err) {
      if (__DEV__) {
        console.error('Failed to update contact name:', err);
      }
    }
  }, [name, uuid, updateContactName]);

  const handleEditStart = useCallback(() => {
    setIsEditing(true);
    setValidationError(null);
  }, []);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setName(initialName);
    setValidationError(null);
  }, [initialName]);

  const formattedDate = closedAt
    ? moment(closedAt).format('MMM DD, YYYY')
    : 'Never';

  const isValidDate = closedAt && moment(closedAt).isValid();

  return (
    <View style={styles.container} testID="contactScreen">
      <View style={styles.profile}>
        <Image
          testID="contactImg"
          source={{ uri: `https://i.pravatar.cc/150?u=${uuid}` }}
          style={styles.avatar}
        />

        {isEditing ? (
          <View style={styles.nameEditContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                testID="nameInput"
                style={[
                  styles.nameInput,
                  validationError && styles.nameInputError,
                ]}
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={100}
              />
              {validationError && (
                <Text style={styles.errorText}>{validationError}</Text>
              )}
            </View>
            <View style={styles.editActions}>
              {isLoading ? (
                <ActivityIndicator
                  testID="saveLoadingIndicator"
                  size="small"
                  color="#007AFF"
                />
              ) : (
                <>
                  <TouchableOpacity
                    testID="cancelButton"
                    onPress={handleEditCancel}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="saveButton"
                    onPress={handleSaveName}
                    style={[
                      styles.saveButton,
                      !name.trim() && styles.saveButtonDisabled,
                    ]}
                    disabled={!name.trim()}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.nameContainer}>
            <Text testID="contactNameText" style={styles.name}>
              {name}
            </Text>
            <TouchableOpacity
              testID="editButton"
              onPress={handleEditStart}
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
          Last contacted: {isValidDate ? formattedDate : 'Never'}
        </Text>
      </View>

      <TouchableOpacity
        testID="backToConversationsButton"
        style={styles.backToConversationsButton}
        onPress={() => router.dismiss(NAVIGATION.DISMISS_TO_ROOT)}
      >
        <Text style={styles.backToConversationsText}>
          Back to Conversations
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  profile: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameEditContainer: {
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginRight: 8,
  },
  nameInput: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    borderBottomWidth: 2,
    borderColor: '#3b82f6',
    padding: 4,
    minWidth: 200,
    textAlign: 'center',
  },
  nameInputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  username: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  editButton: {
    padding: 4,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  infoBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  metaBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 10,
  },
  metaText: {
    fontSize: 16,
    color: '#374151',
  },
  backToConversationsButton: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  backToConversationsText: {
    color: 'white',
    fontWeight: '600',
  },
});
