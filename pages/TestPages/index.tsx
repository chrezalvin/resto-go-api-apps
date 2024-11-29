import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const TestScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Cheese Burger</Title>
          <Paragraph>
            A hamburger with a slice of melted cheese on top of the meat patty, added near the end of the cooking time.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Rp. 50.000</Button>
          <Button>+ Add</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Regular Pizza</Title>
          <Paragraph>
            Traditional style of pizza, they're often served with toppings, such as pepperoni and sausage.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Rp. 100.000</Button>
          <Button>+ Add</Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
});

export default TestScreen;