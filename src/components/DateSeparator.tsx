import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DateSeparatorProps {
  date: Date;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => (
  <View style={styles.dateSeparator}>
    <Text style={styles.dateText}>
      {date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })}
    </Text>
  </View>
);

const styles = StyleSheet.create({
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
});

export default DateSeparator;
