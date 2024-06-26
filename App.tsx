import React from 'react';
import { View, Text, Button, Image } from 'react-native';
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
      <Image source={require('./assets/logo.png')} style={styles.headerLogo} />
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.signOutButton}>
        <Button title="Sign Out" onPress={signOut} />
      </View>
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
            default:
              iconName = 'question';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E90FF', // DodgerBlue for active tab
        tabBarInactiveTintColor: '#ADD8E6', // LightBlue for inactive tab
        tabBarStyle: {
          backgroundColor: '#fff',
          maxWidth: 480, // Limit width to mobile-friendly dimensions
          alignSelf: 'center', // Center the tab bar
          width: '100%'
        }, // Take the full width of the container

      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Locator" component={LocatorScreen} />
      <Tab.Screen name="Recipe" component={RecipeScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={({ route }) => ({
              header: () => <Header title={route.name} />,
            })}
          >
            <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Authenticator>
    </Authenticator.Provider>
  );
};

export default App;
