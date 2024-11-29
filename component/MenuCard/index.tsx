import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AddButton from '../MiniComponent/AddButtonComponent'; // Impor komponen AddButton

interface MenuCardProps {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  cartQuantity: number;
  onAddToCart: (itemName: string) => void;
  onUpdateQuantity: (itemName: string, action: 'increase' | 'decrease') => void;
}

const MenuCard: React.FC<MenuCardProps> = ({
  title,
  description,
  price,
  imageUrl,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
}) => {
  return (

    // Masing2 item menu dalam bentuk card
    // didalam card dipisah per-view gambar, judul, deskripsi, harga
    // dan tombol add

    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        </View>

        {/* Section price & button */}
        <View style={styles.footer}>
          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{price}</Text>
          </View>

          {/* Add Button */}
          <View style={styles.addButtonContainer}>
            <AddButton
              isInCart={cartQuantity > 0}
              onAdd={() => onAddToCart(title)}
              onIncrease={() => onUpdateQuantity(title, 'increase')}
              onDecrease={() => onUpdateQuantity(title, 'decrease')}
              quantity={cartQuantity}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  image: {
    width: 120,
    height: 150,
    borderRadius: 8,
    margin: 8,
  },
  content: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    justifyContent: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  addButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    maxWidth: 120,
  },
});

export default MenuCard;
