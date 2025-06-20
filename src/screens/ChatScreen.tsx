// src/screens/ChatScreen.tsx
// Tela de chat: conecta ao WebSocket e imprime mensagens recebidas
import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
  Keyboard,
  EmitterSubscription
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChat, Message } from '../context/ChatContext';
import { getMessages, sendMessage, reactMessage, unreactMessage, answerMessage } from '../api/messages';
import { useWebSocket } from '../hooks/useWebSocket';
import MessageBubble from '../components/MessageBubble';
import MessageReactions from '../components/MessageReactions';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/env';
import ChatHeader from '../components/ChatHeader';
import DateSeparator from '../components/DateSeparator';
import MessageInput from '../components/MessageInput';

const { width } = Dimensions.get('window');

export default function ChatScreen({ route, navigation }: any) {
  const { room } = route.params;
  const { messages, setMessages } = useChat();
  const { nickname } = useAuth();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers] = useState(Math.floor(Math.random() * 15) + 3); // Mock
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [inputHeight, setInputHeight] = useState(48); // Altura inicial do input
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);
  const inputRef = useRef<TextInput>(null);
  const wsUrl = config.getWebSocketUrl(room.id);
  const keyboardAnimation = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  // Função utilitária para aplicar as transformações de maneira consistente
  const getTranslateY = (kbHeight: number, offset = 0) => [{
    translateY: keyboardAnimation.interpolate({
      inputRange: [0, Math.max(1, kbHeight)],
      outputRange: [0, -Math.max(0, kbHeight - offset)],
      extrapolate: 'clamp'
    })
  }];

  // Função para garantir que o input mantenha o foco corretamente
  const focusInputWithPosition = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  // Função auxiliar para iniciar animações do teclado
  const startKeyboardAnimation = (toValue: number, duration: number) => {
    // Evitar iniciar nova animação se já estiver animando
    if (animationInProgress) return;
    
    setAnimationInProgress(true);
    
    Animated.timing(keyboardAnimation, {
      toValue,
      duration,
      useNativeDriver: true,
      // Adicionar easing para uma animação mais natural
    }).start(({ finished }) => {
      if (finished) {
        setAnimationInProgress(false);
        if (toValue > 0) {
          // Quando o teclado abre, garantimos o foco no input
          focusInputWithPosition();
        }
      }
    });
  };

  // Listeners do teclado para comportamento similar ao WhatsApp
  useEffect(() => {
    let keyboardWillShowListener: EmitterSubscription;
    let keyboardWillHideListener: EmitterSubscription;
    let keyboardDidShowListener: EmitterSubscription;
    let keyboardDidHideListener: EmitterSubscription;

    if (Platform.OS === 'ios') {
      keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (event) => {
        const { height } = event.endCoordinates;
        const duration = event.duration || 250;
        
        // Garantir valor positivo e válido
        const finalHeight = Math.max(0, height);
        setKeyboardHeight(finalHeight);
        setIsKeyboardVisible(true);
        
        // Usar a função auxiliar para animação
        startKeyboardAnimation(finalHeight, duration);
        
        // Scroll para o final quando o teclado aparecer
        setTimeout(() => {
          if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, Math.min(duration / 2, 100));
      });

      keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (event) => {
        const duration = event.duration || 250;
        setIsKeyboardVisible(false);
        
        // Usar a função auxiliar para animação
        startKeyboardAnimation(0, duration);
        setTimeout(() => {
          setKeyboardHeight(0);
        }, duration);
      });
    } else {
      // Android usa keyboardDidShow/Hide
      keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
        const { height } = event.endCoordinates;
        // No Android, ajustamos a altura considerando a inset bottom
        // Usar valor maior entre insets.bottom e 0 para evitar valores negativos
        const safeAreaOffset = Math.max(0, insets.bottom);
        const adjustedHeight = Math.max(0, height - safeAreaOffset);
        
        setKeyboardHeight(adjustedHeight);
        setIsKeyboardVisible(true);
        
        // Usar a função auxiliar para animação
        startKeyboardAnimation(adjustedHeight, 200);
        
        // Scroll para o final quando o teclado aparecer
        setTimeout(() => {
          if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      });

      keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyboardVisible(false);
        
        // Usar a função auxiliar para animação
        startKeyboardAnimation(0, 200);
        setTimeout(() => {
          setKeyboardHeight(0);
        }, 200);
      });
    }

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Carrega mensagens ao montar
  useEffect(() => {
    getMessages(room.id).then((msgs) => {
      console.log('Mensagens carregadas:', msgs);
      const messages = msgs as Message[];
      setMessages(messages);
      console.log('setMessages chamado com:', messages.length, 'mensagens');
    });
  }, [room.id, setMessages]);

  // WebSocket para eventos
  useWebSocket(wsUrl, (msg) => {
    try {
      const event = JSON.parse(msg.data);
      if (event.kind === 'message_created') {
        setMessages((prev) => {
          // Evita duplicatas
          if (prev.some((m) => m.id === event.value.id)) return prev;
          return [...prev, event.value];
        });
      } else if (event.kind === 'message_reaction_increased') {
        setMessages((prev) => prev.map((m) => m.id === event.value.id ? { ...m, reaction_count: event.value.count } : m));
      } else if (event.kind === 'message_reaction_decreased') {
        setMessages((prev) => prev.map((m) => m.id === event.value.id ? { ...m, reaction_count: event.value.count } : m));
      } else if (event.kind === 'message_answered') {
        setMessages((prev) => prev.map((m) => m.id === event.value.id ? { ...m, answered: true } : m));
      }
    } catch (e) {
      console.log('Erro ao processar evento WS', e);
    }
  });

  // Scroll automático ao receber novas mensagens
  useEffect(() => {
    console.log('useEffect messages changed, total:', messages.length);
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
      console.log('Mensagens renderizadas:', messages);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setIsTyping(true);
    // Usando um Animated.Value separado para a animação de envio
    const sendAnimation = new Animated.Value(0);
    Animated.sequence([
      Animated.timing(sendAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sendAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();

    try {
      await sendMessage(room.id, input);
      setInput('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a mensagem. Tente novamente.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleLike = async (message: Message) => {
    await reactMessage(message.room_id, message.id);
  };

  const handleUnlike = async (message: Message) => {
    await unreactMessage(message.room_id, message.id);
  };

  const handleAnswer = async (message: Message) => {
    await answerMessage(message.room_id, message.id);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      <View style={[styles.container, { paddingTop: insets.top }]}>  
        {/* Header Moderno */}
        <ChatHeader
          roomTitle={room.theme}
          onlineUsers={onlineUsers}
          onBack={() => navigation.goBack()}
          onMenu={() => {}}
        />

        {/* Lista de Mensagens com margem bottom dinâmica */}
        <Animated.View style={[
          styles.messagesWrapper,
          {
            transform: getTranslateY(keyboardHeight, 80)
          }
        ]}>
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
                
                <View style={[
                  styles.messageContainer,
                  isOwnMessage && styles.ownMessageContainer
                ]}>
                  <MessageBubble message={item} isOwn={isOwnMessage} />
                  <MessageReactions
                    message={item}
                    isOwnMessage={isOwnMessage}
                    onLike={handleLike}
                    onAnswer={handleAnswer}
                  />
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
          // Scroll automático quando o teclado estiver visível
          onLayout={() => {
            if (isKeyboardVisible && messages.length > 0) {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          }}
        />
        </Animated.View>

        {/* Indicador de digitação */}
        {isTyping && (
          <Animated.View style={[
            styles.typingIndicator,
            {
              transform: getTranslateY(keyboardHeight, 0)
            }
          ]}>
            <Text style={styles.typingText}>Enviando mensagem...</Text>
          </Animated.View>
        )}

        {/* Input Fixo na parte inferior */}
        <Animated.View style={[
          styles.inputContainer,
          { 
            paddingBottom: insets.bottom, // Padding em vez de position: bottom para safe area
            transform: getTranslateY(keyboardHeight, 0)
          }
        ]}>
          <MessageInput
            input={input}
            setInput={setInput}
            inputRef={inputRef as React.RefObject<any>}
            inputHeight={inputHeight}
            setInputHeight={setInputHeight}
            isTyping={isTyping}
            isKeyboardVisible={isKeyboardVisible}
            onSend={handleSend}
            flatListRef={flatListRef}
            insetsBottom={insets.bottom}
          />
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  onlineStatus: {
    fontSize: 12,
    color: '#bdc3c7',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  // Messages Styles
  messagesWrapper: {
    flex: 1,
    paddingBottom: 80, // Fixed padding for the input height
    zIndex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 4,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: 'capitalize',
  },

  // Reactions Styles
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

  // Typing Indicator
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

  // Input Styles
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
    minHeight: 80, // Garantir altura mínima para evitar saltos
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

  // Legacy styles (mantidos para compatibilidade)
  title: { 
    fontSize: 20, 
    marginBottom: 8, 
    alignSelf: 'center' 
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8 
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 10, 
    marginRight: 8 
  },
  reactionsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 8 
  },
  likeBtn: { 
    marginRight: 12, 
    padding: 4 
  },
  answered: { 
    color: 'green', 
    fontWeight: 'bold' 
  },
});
