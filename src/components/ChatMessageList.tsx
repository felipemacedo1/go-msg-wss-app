import React, { RefObject } from 'react';
import { FlatList, View } from 'react-native';
import { Message } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import MessageReactions from './MessageReactions';
import DateSeparator from './DateSeparator';

interface ChatMessageListProps {
  messages: Message[];
  nickname: string;
  flatListRef: RefObject<FlatList<Message>>;
  onLike: (message: Message) => void;
  onAnswer: (message: Message) => void;
  isKeyboardVisible: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  nickname,
  flatListRef,
  onLike,
  onAnswer,
  isKeyboardVisible,
}) => (
  <FlatList
    ref={flatListRef}
    data={messages}
    keyExtractor={item => item.id}
    renderItem={({ item, index }) => {
      const isOwnMessage = !!nickname && item.author_name === nickname;
      const showDateSeparator = index === 0 || 
        new Date(item.created_at).toDateString() !== 
        new Date(messages[index - 1].created_at).toDateString();
      return (
        <View>
          {showDateSeparator && (
            <DateSeparator date={new Date(item.created_at)} />
          )}
          <View style={{ marginVertical: 4, alignItems: isOwnMessage ? 'flex-end' : undefined }}>
            <MessageBubble message={item} isOwn={isOwnMessage} />
            <MessageReactions
              message={item}
              isOwnMessage={isOwnMessage}
              onLike={onLike}
              onAnswer={onAnswer}
            />
          </View>
        </View>
      );
    }}
    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, flexGrow: 1 }}
    showsVerticalScrollIndicator={false}
    onContentSizeChange={() => {
      if (messages.length > 0) {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    }}
    onLayout={() => {
      if (isKeyboardVisible && messages.length > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }}
  />
);

export default ChatMessageList;
