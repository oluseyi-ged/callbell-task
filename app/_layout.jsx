import { Stack } from "expo-router"
import { PersistGate } from "redux-persist/integration/react"
import ReduxProvider from "../src/providers/ReduxProvider"
import { persistor } from "../src/store"

export default function Layout() {
  return (
    <ReduxProvider>
      <PersistGate loading={null} persistor={persistor}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: "Conversations",
              headerStyle: { backgroundColor: "#f5f5f5" },
              headerTitleStyle: { fontWeight: "bold" },
            }}
          />
          <Stack.Screen name="chat" options={{ headerShown: false }} />
          <Stack.Screen
            name="contact"
            options={{
              title: "Contact Details",
              headerBackTitle: "Back",
            }}
          />
        </Stack>
      </PersistGate>
    </ReduxProvider>
  )
}
