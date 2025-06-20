import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ChatHeaderProps {
  roomTitle: string;
  onlineUsers: number;
  onBack: () => void;
  onMenu?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomTitle, onlineUsers, onBack, onMenu }) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backIcon}>{'←'}</Text>
    </TouchableOpacity>
    <View style={styles.headerInfo}>
      <Text style={styles.roomTitle} numberOfLines={1}>{roomTitle}</Text>
      <Text style={styles.onlineStatus}>{onlineUsers} online</Text>
    </View>
    <TouchableOpacity style={styles.menuButton} onPress={onMenu}>
      <Text style={styles.menuIcon}>⋮</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
});

export default ChatHeader;
