import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Message } from '../../context/ChatContext';

interface MessageReactionsProps {
  message: Message;
  isOwnMessage: boolean;
  onLike: (message: Message) => void;
  onAnswer: (message: Message) => void;
  reactionsContainerStyle?: ViewStyle;
}

const MessageReactions: React.FC<MessageReactionsProps> = ({
  message,
  isOwnMessage,
  onLike,
  onAnswer,
  reactionsContainerStyle,
}) => (
  <View style={[
    styles.reactionsContainer,
    isOwnMessage && styles.ownReactionsContainer,
    reactionsContainerStyle,
  ]}>
    <TouchableOpacity 
      onPress={() => onLike(message)} 
      style={[styles.reactionButton, styles.likeButton]}
      activeOpacity={0.7}
    >
      <Text style={styles.reactionIcon}>👍</Text>
      <Text style={styles.reactionCount}>{message.reaction_count}</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      onPress={() => onAnswer(message)} 
      style={[styles.reactionButton, styles.replyButton]}
      activeOpacity={0.7}
    >
      <Text style={styles.reactionIcon}>💬</Text>
    </TouchableOpacity>
    {message.answered && (
      <View style={styles.answeredBadge}>
        <Text style={styles.answeredText}>✓ Respondida</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 8,
  },
  ownReactionsContainer: {
    marginLeft: 0,
    marginRight: 8,
    justifyContent: 'flex-end',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  likeButton: {
    backgroundColor: '#e8f4fd',
  },
  replyButton: {
    backgroundColor: '#f0f0f0',
  },
  reactionIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  answeredBadge: {
    backgroundColor: '#d4edda',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  answeredText: {
    fontSize: 10,
    color: '#155724',
    fontWeight: '600',
  },
});

export default MessageReactions;
