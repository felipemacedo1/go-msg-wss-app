import React from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface TypingIndicatorProps {
  keyboardHeight: number;
  getTranslateY: (kbHeight: number, offset?: number) => any;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ keyboardHeight, getTranslateY }) => (
  <Animated.View style={[
    styles.typingIndicator,
    { transform: getTranslateY(keyboardHeight, 0) }
  ]}>
    <Text style={styles.typingText}>Enviando mensagem...</Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  typingIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 80, // height of inputContainer
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e9ecef',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    zIndex: 5,
  },
  typingText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
});

export default TypingIndicator;
