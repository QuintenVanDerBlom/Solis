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
import { getThemeStyles, getThemeColors } from './styles/styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// StackNavigator voor Lijst en Detail
function ListStackScreen({ hotspots, favorites, theme }) {
    const currentStyles = getThemeStyles(theme);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: currentStyles.header,
                headerTintColor: '#ffffff',
                headerTitleStyle: currentStyles.headerTitle,
                headerBackTitleVisible: false,
                headerShadowVisible: true,
            }}
        >
            <Stack.Screen
                name="HotspotList"
                options={{
                    title: '🌿 Natuurgebieden',
                    headerTitleAlign: 'center',
                }}
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
                options={{
                    title: '📍 Details',
                    headerTitleAlign: 'center',
                }}
            >
                {({ route, navigation }) => (
                    <HotspotDetail
                        route={route}
                        navigation={navigation}
                        theme={theme}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen
                name="HotspotMapDetail"
                options={{
                    title: '🗺️ Locatie op Kaart',
                    headerTitleAlign: 'center',
                }}
            >
                {({ route, navigation }) => (
                    <HotspotMap
                        hotspots={[route.params.hotspot]}
                        theme={theme}
                        selectedHotspot={route.params.hotspot}
                        navigation={navigation}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

// StackNavigator voor Kaart
function MapStackScreen({ hotspots, theme }) {
    const currentStyles = getThemeStyles(theme);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: currentStyles.header,
                headerTintColor: '#ffffff',
                headerTitleStyle: currentStyles.headerTitle,
                headerShadowVisible: true,
            }}
        >
            <Stack.Screen
                name="HotspotMap"
                options={{
                    title: '🗺️ Kaart',
                    headerTitleAlign: 'center',
                }}
            >
                {() => <HotspotMap hotspots={hotspots} theme={theme} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

// StackNavigator voor Instellingen
function SettingsStackScreen({ theme, setTheme }) {
    const currentStyles = getThemeStyles(theme);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: currentStyles.header,
                headerTintColor: '#ffffff',
                headerTitleStyle: currentStyles.headerTitle,
                headerShadowVisible: true,
            }}
        >
            <Stack.Screen
                name="Settings"
                options={{
                    title: '⚙️ Instellingen',
                    headerTitleAlign: 'center',
                }}
            >
                {() => <SettingsScreen theme={theme} setTheme={setTheme} />}
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
            const response = await fetch('https://raw.githubusercontent.com/QuintenVanDerBlom/Solis/refs/heads/dev/data/hotspots.json');
            const data = await response.json();
            setHotspots(data);
            console.log('Hotspots loaded from online source:', data.length);
        } catch (error) {
            console.log('Error loading online hotspots:', error);
            try {
                const localData = require('./data/hotspots.json');
                setHotspots(localData);
                console.log('Hotspots loaded from local fallback:', localData.length);
            } catch (localError) {
                console.log('Error loading local hotspots:', localError);
                setHotspots([]);
            }
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
    const colors = getThemeColors(theme);

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Lijst') iconName = 'leaf';
                        else if (route.name === 'Kaart') iconName = 'map';
                        else if (route.name === 'Instellingen') iconName = 'settings';
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarStyle: currentStyles.tabBar,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textLight,
                    headerShown: false,
                })}
            >
                <Tab.Screen
                    name="Lijst"
                    options={{
                        tabBarLabel: 'Natuur',
                    }}
                >
                    {() => <ListStackScreen hotspots={hotspots} favorites={favorites} theme={theme} />}
                </Tab.Screen>
                <Tab.Screen
                    name="Kaart"
                    options={{
                        tabBarLabel: 'Kaart',
                    }}
                >
                    {() => <MapStackScreen hotspots={hotspots} theme={theme} />}
                </Tab.Screen>
                <Tab.Screen
                    name="Instellingen"
                    options={{
                        tabBarLabel: 'Instellingen',
                    }}
                >
                    {() => <SettingsStackScreen theme={theme} setTheme={setTheme} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
