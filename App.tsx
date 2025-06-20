import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RoomProvider } from './src/context/RoomContext';
import { ChatProvider } from './src/context/ChatContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RoomProvider>
          <ChatProvider>
            <AppNavigator />
          </ChatProvider>
        </RoomProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
