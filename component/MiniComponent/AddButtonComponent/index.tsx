import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface AddButtonProps {
  isInCart: boolean;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  quantity: number;
}

const AddButton: React.FC<AddButtonProps> = ({
  isInCart,
  onAdd,
  onIncrease,
  onDecrease,
  quantity,
}) => {
  return (
    <View style={styles.container}>
      {isInCart ? (
        <View style={styles.quantityControl}>
          {/* button - */}
          <TouchableOpacity style={styles.smallButton} onPress={onDecrease}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          {/* quantity */}
          <Text style={styles.quantityText}>{quantity}</Text>

          {/* button + */}
          <TouchableOpacity style={styles.smallButton} onPress={onIncrease}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#b44834',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#b44834',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AddButton;
