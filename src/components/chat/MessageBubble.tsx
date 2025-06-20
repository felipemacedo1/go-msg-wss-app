import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../../context/ChatContext';

type Props = {
  message: Message;
  isOwn: boolean;
};

export default function MessageBubble({ message, isOwn }: Props) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        {!isOwn && (
          <Text style={styles.authorName}>{message.author_name}</Text>
        )}
        
        <Text style={[styles.messageText, isOwn ? styles.ownMessageText : styles.otherMessageText]}>
          {message.message}
        </Text>
        
        <View style={[styles.timeContainer, isOwn ? styles.ownTimeContainer : styles.otherTimeContainer]}>
          <Text style={[styles.timeText, isOwn ? styles.ownTimeText : styles.otherTimeText]}>
            {formatTime(message.created_at)}
          </Text>
          {isOwn && (
            <Text style={styles.statusIcon}>✓</Text>
          )}
        </View>
      </View>
      
      {/* Bubble tail */}
      <View style={[styles.tail, isOwn ? styles.ownTail : styles.otherTail]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    paddingHorizontal: 4,
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownBubble: {
    backgroundColor: '#007bff',
    borderBottomRightRadius: 8,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  
  authorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
  },
  
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#212529',
  },
  
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ownTimeContainer: {
    justifyContent: 'flex-end',
  },
  otherTimeContainer: {
    justifyContent: 'flex-start',
  },
  
  timeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  ownTimeText: {
    color: 'rgba(255,255,255,0.8)',
  },
  otherTimeText: {
    color: '#6c757d',
  },
  
  statusIcon: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  
  // Bubble tails
  tail: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
  },
  ownTail: {
    right: -1,
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderTopColor: '#007bff',
    borderLeftColor: 'transparent',
  },
  otherTail: {
    left: -1,
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderTopColor: '#fff',
    borderRightColor: 'transparent',
  },

  // Legacy styles (mantidos para compatibilidade)
  own: {
    backgroundColor: '#d1f7c4',
    alignSelf: 'flex-end',
  },
  other: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  user: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  time: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
