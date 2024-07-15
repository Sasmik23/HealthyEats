import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import outputs from './amplify_outputs.json';
import LocatorScreen from './screens/LocatorScreen';
import ProfileScreen from './screens/ProfileScreen';
import RecipeScreen from './screens/RecipeScreen';
import IngredientsScreen from './screens/IngredientsScreen';
import { styles } from './styles/styles';

Amplify.configure(outputs);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.headerContainer}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <TouchableOpacity onPress={signOut}>
        <Text style={styles.signOutButton}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Locator':
              iconName = focused ? 'navigate' : 'navigate-outline';
              break;
            case 'Recipe':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
            case 'Ingredients':
              iconName = focused ? 'list' : 'list-outline';
              break;
            default:
              iconName = 'question';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#A5D6A7',
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Locator" component={LocatorScreen} />
      <Tab.Screen name="Recipe" component={RecipeScreen} />
      <Tab.Screen name="Ingredients" component={IngredientsScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    Amplify.configure(outputs);
  }, []);

  return (
    <Authenticator.Provider>
      <Authenticator>
        <NavigationContainer>
          <StatusBar backgroundColor="#E6F5E1" barStyle="dark-content" />
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: 'center',
              header: ({ route }) => <Header title={route.name} />, // Ensure header is set here
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={{
                header: ({ route }) => <Header title={route.name} />, // Ensure header is set here
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Authenticator>
    </Authenticator.Provider>
  );
};

export default App;
