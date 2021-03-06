import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomTabNavigator from './components/BottomTabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from 'react-native';
import SignUp from './components/SignUp';
import { Provider } from 'react-redux';
import configureStore from './redux/store/configureStore';
import * as firebase from 'firebase';
import * as secret from './secret';

const Stack = createStackNavigator();
const store = configureStore();

const firebaseConfig = {
  apiKey: secret.API_KEY,
  authDomain: "r-store-v1.firebaseapp.com",
  projectId: "r-store-v1",
  storageBucket: "r-store-v1.appspot.com",
  databaseURL: "https://r-store-v1-default-rtdb.firebaseio.com/",
  messagingSenderId: "456832680520",
  appId: "1:456832680520:web:811dc91e6064dac3f10e7d"
};

export default function App() {
  const navigationRef = React.useRef();
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state.',
    'Error: Native splash screen is already hidden.',
    'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation']); // Ignore log notification by message

  SplashScreen.preventAutoHideAsync();

  return (
    <Provider store={store}>
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
    </Provider>
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
