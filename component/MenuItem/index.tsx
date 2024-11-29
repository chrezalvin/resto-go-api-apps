import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface MenuItemProps {
  image: string;
  name: string;
  description?: string;
  price: string;
  style?: object;
  onAddToCart: (itemName: string) => void;
  cartQuantity: number;
  onUpdateQuantity: (itemName: string, action: "increase" | "decrease") => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  image,
  name,
  description,
  price,
  style,
  onAddToCart,
  cartQuantity,
  onUpdateQuantity,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        <Text style={styles.price}>{price}</Text>
      </View>
      {cartQuantity > 0 ? (
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(name, "decrease")}
          >
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{cartQuantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(name, "increase")}
          >
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => onAddToCart(name)}
        >
          <Text style={styles.buttonText}>+ Add</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#A52A2A",
  },
  button: {
    backgroundColor: "#A52A2A",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  quantityButton: {
    backgroundColor: "#A52A2A",
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    color: "#FFF",
  },
});

export default MenuItem;
