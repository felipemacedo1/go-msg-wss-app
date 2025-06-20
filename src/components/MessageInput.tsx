import React, { RefObject } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from 'react-native';

interface MessageInputProps {
  input: string;
  setInput: (text: string) => void;
  inputRef: RefObject<TextInput>;
  inputHeight: number;
  setInputHeight: (height: number) => void;
  isTyping: boolean;
  isKeyboardVisible: boolean;
  onSend: () => void;
  flatListRef: any;
  insetsBottom: number;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  inputRef,
  inputHeight,
  setInputHeight,
  isTyping,
  isKeyboardVisible,
  onSend,
  flatListRef,
  insetsBottom,
}) => (
  <View style={[styles.inputContainer, { paddingBottom: insetsBottom }]}> 
    <View style={styles.inputWrapper}>
      <TextInput
        ref={inputRef}
        style={[
          styles.textInput,
          { height: Math.min(Math.max(48, inputHeight), 120) }
        ]}
        value={input}
        onChangeText={setInput}
        placeholder="Digite sua mensagem..."
        placeholderTextColor="#a0a0a0"
        multiline
        maxLength={500}
        onSubmitEditing={onSend}
        blurOnSubmit={false}
        returnKeyType="send"
        onContentSizeChange={(event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
          setInputHeight(event.nativeEvent.contentSize.height);
        }}
        onFocus={() => {
          if (!isKeyboardVisible) {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 300);
          } else {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
      />
      <TouchableOpacity 
        style={[
          styles.sendButton,
          !input.trim() && styles.sendButtonDisabled
        ]}
        onPress={onSend} 
        disabled={!input.trim() || isTyping}
        activeOpacity={0.8}
      >
        <Text style={styles.sendIcon}>
          {isTyping ? '⏳' : '➤'}
        </Text>
      </TouchableOpacity>
    </View>
    {input.length > 0 && (
      <Text style={styles.characterCount}>
        {input.length}/500
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
    minHeight: 80,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
    maxHeight: 120,
    paddingVertical: 8,
    paddingRight: 12,
    lineHeight: 20,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#dee2e6',
  },
  sendIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  characterCount: {
    fontSize: 11,
    color: '#6c757d',
    textAlign: 'right',
    marginTop: 4,
  },
});

export default MessageInput;
