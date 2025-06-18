import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Message {
  id: string;
  room_id: string;
  message: string;
  reaction_count: number;
  answered: boolean;
  author_id: string;
  author_name: string;
  created_at: string;
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
