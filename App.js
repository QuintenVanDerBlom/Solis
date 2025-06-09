import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import HotspotList from './components/HotspotList';
import HotspotMap from './components/HotspotMap';
import HotspotDetail from './components/HotspotDetail';
import SettingsScreen from './components/SettingsScreen';
import { styles, getThemeStyles } from './styles/styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// StackNavigator voor Lijst en Detail
function ListStackScreen({ hotspots, favorites, theme }) {
  return (
      <Stack.Navigator>
        <Stack.Screen
            name="HotspotList"
            options={{ title: 'Natuurgebieden' }}
        >
          {({ navigation }) => (
              <HotspotList
                  hotspots={hotspots}
                  favorites={favorites}
                  theme={theme}
                  navigation={navigation}
              />
          )}
        </Stack.Screen>
        <Stack.Screen
            name="HotspotDetail"
            options={{ title: 'Details' }}
        >
          {({ route, navigation }) => (
              <HotspotDetail
                  route={route}
                  navigation={navigation}
                  theme={theme}
              />
          )}
        </Stack.Screen>
      </Stack.Navigator>
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [hotspots, setHotspots] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadSettings();
    loadHotspots();
    loadFavorites();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) setTheme(savedTheme);
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const loadHotspots = async () => {
    try {
      // Simuleer online JSON data
      const response = await fetch('https://raw.githubusercontent.com/your-repo/hotspots.json');
      const data = await response.json();
      setHotspots(data);
    } catch (error) {
      // Fallback naar lokale data
      const localData = require('./data/hotspots.json');
      setHotspots(localData);
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch (error) {
      console.log('Error loading favorites:', error);
    }
  };

  const currentStyles = getThemeStyles(theme);

  return (
      <NavigationContainer>
        <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Lijst') iconName = 'list';
                else if (route.name === 'Kaart') iconName = 'map';
                else if (route.name === 'Instellingen') iconName = 'settings';
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarStyle: currentStyles.tabBar,
              headerStyle: currentStyles.header,
              headerShown: false, // Verberg tab header omdat Stack zijn eigen header heeft
            })}
        >
          <Tab.Screen name="Lijst">
            {() => <ListStackScreen hotspots={hotspots} favorites={favorites} theme={theme} />}
          </Tab.Screen>
          <Tab.Screen name="Kaart">
            {() => <HotspotMap hotspots={hotspots} theme={theme} />}
          </Tab.Screen>
          <Tab.Screen name="Instellingen">
            {() => <SettingsScreen theme={theme} setTheme={setTheme} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
  );
}
