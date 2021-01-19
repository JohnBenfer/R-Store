import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomTabNavigator from './components/BottomTabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import SignUp from './components/SignUp';

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = React.useRef();
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state.',
  'Error: Native splash screen is already hidden.',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation']); // Ignore log notification by message
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName='SignUp'>
        <Stack.Screen
          name='SignUp'
          component={SignUp}
          options={{ headerTitle: 'Sign Up' }}
        />
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
          initialParams={{ navigationRef }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
