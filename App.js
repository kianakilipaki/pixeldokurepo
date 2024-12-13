import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SudokuScreen from './screens/SudokuScreen';
import './styles/styles.scss';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SudokuScreen"
          component={SudokuScreen}
          options={({ route }) => ({
            title: `${route.params?.theme.title} - ${route.params?.difficulty.toUpperCase()}`,
            headerStyle: {
              backgroundColor: 'var(--blue)',
              borderBottomColor: 'var(--forecolor1)',
              borderBottomWidth: 2,
            },
            headerTintColor: 'var(--forecolor1)',
            headerTitleStyle: {
              fontFamily: 'var(--fontFamily)',
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
