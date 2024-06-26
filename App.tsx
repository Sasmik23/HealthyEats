import React from 'react';
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
import { styles } from './styles/styles';

Amplify.configure(outputs);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, signOut } = useAuthenticator();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.userName}>{user?.signInDetails?.loginId?.split('@')[0]}</Text>
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
            default:
              iconName = 'question';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50', // Green for active tab
        tabBarInactiveTintColor: '#A5D6A7', // Light green for inactive tab
        tabBarStyle: styles.tabBar,
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
          <StatusBar backgroundColor="#E6F5E1" barStyle="dark-content" />
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: 'center',
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={{
                header: ({ route }) => <Header title={route.name} />,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Authenticator>
    </Authenticator.Provider>
  );
};

export default App;
