import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Header: React.FC = () => {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.title}>Table No. 7, Roti Bakar 77</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#A52A2A",
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Header;
