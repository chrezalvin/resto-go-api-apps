import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
}

const MenuButton: React.FC<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});

export default MenuButton;
