// src/context/ChatContext.tsx
// Contexto global para mensagens do chat
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Message {
  id: string;
  user: string;
  content: string;
  createdAt: string;
  reactions?: { [emoji: string]: number };
  // Permite status extra para renderização
  answered?: boolean;
  author_name?: string;
  message?: string;
}

type SetMessagesType = React.Dispatch<React.SetStateAction<Message[]>>;

interface ChatContextProps {
  messages: Message[];
  setMessages: SetMessagesType;
}

const ChatContext = createContext<ChatContextProps>({
  messages: [],
  setMessages: () => {},
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
