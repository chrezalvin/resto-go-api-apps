import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './Navigator/StackNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
    
  );
};

export default App;
