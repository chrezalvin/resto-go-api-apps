import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from '../../pages/MenuPages';
import Header from '../../component/Header';
import TestScreen from '../../pages/TestPages';

export type RootStackParamList = {
  Menu: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Menu" component={MenuScreen} options={{ header: () => <Header /> }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
