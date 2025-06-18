// src/navigation/AppNavigator.tsx
// Configuração do React Navigation para as telas do app
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RoomListScreen from '../screens/RoomListScreen';
import ChatScreen from '../screens/ChatScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { token } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="RoomList" component={RoomListScreen} options={{ title: 'Salas' }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
