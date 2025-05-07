# Callbell Mobile Test - Implementation Overview

## 📱 App Overview

This is a React Native mobile app built with Expo that implements Callbell's messaging interface with three main screens:

1. **Conversations List** - Displays all message threads
2. **Chat Screen** - Shows conversation history
3. **Contact Details** - Displays and allows editing contact information

## 🛠 Technical Implementation

### Core Features

- **Redux Toolkit** for state management
- **RTK Query** for API calls and caching
- **Expo Router** for navigation
- **Swipeable List** for conversation deletion
- **Moment.js** for date formatting
- **Vector Icons** for UI elements
- **Detox** for E2E testing

### Key Components

#### `ConversationsScreen.js`

- Fetches and displays conversation list
- Implements swipe-to-delete functionality
- Shows loading/empty states
- Navigates to chat screen on tap

#### `ChatScreen.js`

- Displays message history with proper bubbles
- Differentiates between user/agent messages
- Shows read receipts and timestamps
- Header with contact info and back navigation

#### `ContactScreen.js`

- Displays contact details
- Editable name field with save functionality
- Shows contact metadata (phone, source, etc.)
- Back navigation to conversations

## 🧪 Testing Implementation

### E2E Tests (Detox)

The app includes comprehensive end-to-end tests covering:

#### Conversations Screen Tests

- Verifies screen title visibility
- Checks for conversation list or empty state
- Tests navigation to chat screen
- Validates swipe-to-delete functionality

#### Chat Screen Tests

- Confirms header elements
- Verifies message list rendering
- Checks input field and send button
- Tests navigation to contact screen

#### Contact Screen Tests

- Validates contact info display
- Tests name editing flow
- Confirms save functionality
- Checks loading states

### Running Tests

1. **Install dependencies**:

   ```bash
   yarn install
   ```

2. **Build the app for testing**:

   ```bash
   detox build -c ios.sim.debug
   ```

3. **Run the E2E tests**:

   ```bash
   detox test -c ios.sim.debug
   ```

## 🚀 Getting Started

### Prerequisites

- Node.js v20.11.1
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   yarn install
   ```

3. Add your Callbell API key to `.envrc`:

   ```bash
   export CALLBELL_API_KEY=your_api_key_here
   ```

### Running the App

```bash
npx expo start
```

## 📂 Project Structure

```
/src
  /api
    /services      # API service definitions
    client.js     # API client setup
    config.js     # API configuration
  /store          # Redux store and slices
  /components     # Reusable components
  /screens        # Main app screens
/e2e              # Detox test files
```

## ✅ Testing Strategy

- **E2E Tests**: Validate complete user flows across multiple screens

## 🎯 Possible Future Improvements

- Implement message sending functionality
- Add push notifications
- Improve error handling and retry logic
- Add more comprehensive unit tests
- Implement dark mode support
