import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  token: string | null;
  nickname: string | null;
  setToken: (token: string | null, nickname?: string | null) => void;
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  nickname: null,
  setToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [nickname, setNicknameState] = useState<string | null>(null);

  const setToken = async (newToken: string | null, newNickname?: string | null) => {
    setTokenState(newToken);
    setNicknameState(newNickname || null);
    if (newToken) {
      await AsyncStorage.setItem('jwt', newToken);
      if (newNickname) await AsyncStorage.setItem('nickname', newNickname);
    } else {
      await AsyncStorage.removeItem('jwt');
      await AsyncStorage.removeItem('nickname');
    }
  };

  React.useEffect(() => {
    AsyncStorage.getItem('jwt').then((savedToken) => {
      if (savedToken) setTokenState(savedToken);
    });
    AsyncStorage.getItem('nickname').then((savedNickname) => {
      if (savedNickname) setNicknameState(savedNickname);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ token, nickname, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
