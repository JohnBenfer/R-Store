import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Text } from 'react-native-elements';
import Recipes from './Recipes/Recipes';
import Cookbooks from './Cookbooks';
import Recipe from './Recipes/Recipe';
import CreateRecipe from './Recipes/CreateRecipe';

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = (props) => {
  let route = props?.route.params.navigationRef.current?.getCurrentRoute().name;
  return (
    <BottomTab.Navigator initialRouteName="Recipes">
      <BottomTab.Screen
        name="Recipes"
        component={RecipesNavigator}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ fontSize: 10, color: route === 'RecipesScreen' || route === 'Root' ? color : '#8e8e8f' }}>Recipes</Text>
          ),
          tabBarIcon: ({ color }) => (
            <Icon
              type="ionicon"
              size={30}
              style={{ marginBottom: -3 }}
              name="md-home"
              color={route === 'RecipesScreen' || route === 'Root' ? color : '#8e8e8f'}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Cookbooks"
        component={InventoryNavigator}
        options={{
          tabBarLabel: 'Cookbooks',
          tabBarIcon: ({ color }) => (
            <Icon
              type="ionicon"
              size={30}
              style={{ marginBottom: -3 }}
              name="md-list"
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Recipe"
        component={Recipe}
        options={{ headerShown: false, tabBarButton: () => null }}
      />
    </BottomTab.Navigator>
  );
};

const HomeStack = createStackNavigator();
const RecipesNavigator = (props) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <Icon
            type="ionicon"
            size={30}
            style={{ marginLeft: 10, marginBottom: 0 }}
            name="md-arrow-back"
            color={'#8e8e8f'}
          />
        ),
      }}
    >
      <HomeStack.Screen
        name="RecipesScreen"
        component={Recipes}
        options={{
          headerShown: true,
          title: 'Recipes',
          headerLeft: null,
        }}
      />
      <HomeStack.Screen
        name="CreateRecipe"
        component={CreateRecipe}
        options={{
          headerShown: false,
          title: 'Create Recipe',
          headerTitleAlign: 'center',
        }}
      />
      <HomeStack.Screen
        name="Recipe"
        component={Recipe}
        options={{
          headerShown: true,
          title: 'Recipe',
          headerTitleAlign: 'center',
        }}
      />
      <HomeStack.Screen
        name="InventoryScreen"
        component={Cookbooks}
        options={{
          headerShown: true,
          title: 'Cookbooks',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fff',
          }
        }}
      />
    </HomeStack.Navigator>
  );
};

const InventoryStack = createStackNavigator();
const InventoryNavigator = (props) => {
  return <InventoryStack.Navigator>
    <InventoryStack.Screen
      name="Cookbooks"
      component={Cookbooks}
      options={{
        headerShown: true,
        title: 'Cookbooks',
        headerTitleAlign: 'center',
        headerLeft: null,
        headerStyle: {
          backgroundColor: '#fff',
        }
      }}
    />
  </InventoryStack.Navigator>;
};

export default BottomTabNavigator;