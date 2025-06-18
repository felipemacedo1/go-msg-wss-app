import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { RoomProvider } from './src/context/RoomContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <RoomProvider>
        <AppNavigator />
      </RoomProvider>
    </AuthProvider>
  );
}
