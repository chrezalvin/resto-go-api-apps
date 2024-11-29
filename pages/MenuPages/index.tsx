import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import MenuCard from '../../component/MenuCard';
import CheckoutButton from '../../component/MiniComponent/CheckoutButtonComponent'; // Komponen untuk tombol checkout

interface MenuItem {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  quantity: number;
  rating: number;
}

const categories = [
  { id: '1', name: 'Food', icon: require('../../assets/logo/Burgers and salad.png') }, // Path sesuai dengan ikon Anda
  { id: '2', name: 'Drink', icon: require('../../assets/logo/Drink.png') },
  { id: '3', name: 'Side', icon: require('../../assets/logo/Donuts.png') },
];

const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const loadMenuData = async () => {
      const data = require('../../component/MenuItem/menuData.json');
      setMenuItems(data);
    };
    loadMenuData();
  }, []);
  {/* Filterya */}
  const filteredMenu = menuItems.filter(item => item.category === selectedCategory);
  const recommendedMenu = filteredMenu.slice().sort((a, b) => b.rating - a.rating);
  const sortedMenu = filteredMenu.slice().sort((a, b) => parseInt(a.price.replace('Rp. ', '').replace('.', '')) - parseInt(b.price.replace('Rp. ', '').replace('.', '')));

  const handleAddToCart = (itemName: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart, [itemName]: (prevCart[itemName] || 0) + 1 };
      updateTotalItems(newCart);
      return newCart;
    });
  };

  const handleUpdateQuantity = (itemName: string, action: 'increase' | 'decrease') => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[itemName] || 0;
      let newCart = { ...prevCart };
      
      if (action === 'increase') {
        newCart[itemName] = currentQuantity + 1;
      } else if (action === 'decrease' && currentQuantity > 1) {
        newCart[itemName] = currentQuantity - 1;
      } else if (action === 'decrease' && currentQuantity === 1) {
        const { [itemName]: _, ...rest } = newCart;
        newCart = rest;
      }
      
      updateTotalItems(newCart);
      return newCart;
    });
  };

  const updateTotalItems = (cart: { [key: string]: number }) => {
    const total = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);
    setTotalItems(total);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Bagian Filter Category, terdiri dari 3 category */}
      {/* Food, Drinck, Side */}
      {/* Masing2 category, menampilkan hidangannya */}
      <View style={styles.menuHeader}>
        <Text style={styles.menuTitle}>Menu</Text>
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory === category.name && styles.selectedCategoryCard,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Image source={category.icon} style={styles.categoryIcon} />
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === category.name && styles.selectedCategoryLabel,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.menuSection}>
        {/* Bagian ini mengambil 2 rekomendasi makanan sesuai filter yang sudah di setting */}
        <Text style={styles.subHeader}>Recommended</Text>
        {recommendedMenu.slice(0, 2).map((item, index) => (
          <MenuCard
            key={index}
            title={item.title}
            description={item.description}
            price={item.price}
            imageUrl={item.imageUrl}
            cartQuantity={cart[item.title] || 0}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ))}

        {/* Bagian ini dibawah rekomendasi makanan, diluar filter */}
        <Text style={styles.subHeader}>Other Menu</Text>
        {sortedMenu.slice(2).map((item, index) => (
          <MenuCard
            key={index}
            title={item.title}
            description={item.description}
            price={item.price}
            imageUrl={item.imageUrl}
            cartQuantity={cart[item.title] || 0}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ))}
      </ScrollView>

      <CheckoutButton totalItems={totalItems} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#8B0000',
  },
  menuHeader: {
    backgroundColor: '#8B0000',
    paddingVertical: 20,
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFB86C',
    borderRadius: 12,
    width: 80,
  },
  selectedCategoryCard: {
    backgroundColor: '#FA0714',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  selectedCategoryLabel: {
    color: '#FFFFFF',
  },
  menuSection: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 8,
  },
});

export default MenuPage;
