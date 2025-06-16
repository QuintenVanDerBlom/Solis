import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

import HotspotList from './components/HotspotList';
import HotspotMap from './components/HotspotMap';
import HotspotDetail from './components/HotspotDetail';
import SettingsScreen from './components/SettingsScreen';
import OfflineIndicator from './components/OfflineIndicator';
import { getThemeStyles, getThemeColors } from './styles/styles';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Default fallback styles
const defaultStyles = {
    container: { flex: 1, backgroundColor: '#fff' },
    text: { color: '#000' },
    header: { backgroundColor: '#fff' },
    headerText: { color: '#000' },
    headerTitle: { color: '#000', fontWeight: 'bold' },
    tabBar: { backgroundColor: '#fff' },
};

const defaultColors = {
    primary: '#007AFF',
    textLight: '#999',
};

// Safe theme functions with fallbacks
const safeGetThemeStyles = (theme) => {
    try {
        const themeStyles = getThemeStyles(theme);
        if (!themeStyles) return defaultStyles;

        return {
            ...defaultStyles,
            ...themeStyles,
            headerText: themeStyles.headerText || defaultStyles.headerText,
            headerTitle: themeStyles.headerTitle || defaultStyles.headerTitle,
            tabBar: themeStyles.tabBar || defaultStyles.tabBar,
        };
    } catch (error) {
        console.log('Error loading theme styles, using defaults:', error);
        return defaultStyles;
    }
};

const safeGetThemeColors = (theme) => {
    try {
        const themeColors = getThemeColors(theme);
        if (!themeColors) return defaultColors;

        return {
            ...defaultColors,
            ...themeColors,
        };
    } catch (error) {
        console.log('Error loading theme colors, using defaults:', error);
        return defaultColors;
    }
};

// StackNavigator voor Lijst en Detail
function ListStackScreen({ hotspots, favorites, theme, isOffline }) {
    const currentStyles = safeGetThemeStyles(theme);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: currentStyles.header,
                headerTintColor: currentStyles.headerText?.color || '#000',
                headerTitleStyle: currentStyles.headerTitle,
            }}
        >
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
                        isOffline={isOffline}
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
            <Stack.Screen
                name="HotspotMapDetail"
                options={{ title: 'Kaart' }}
            >
                {({ route, navigation }) => (
                    <HotspotMap
                        hotspots={[route.params.hotspot]}
                        theme={theme}
                        selectedHotspot={route.params.hotspot}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

// StackNavigator voor Kaart
function MapStackScreen({ hotspots, theme }) {
    const currentStyles = safeGetThemeStyles(theme);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: currentStyles.header,
                headerTintColor: currentStyles.headerText?.color || '#000',
                headerTitleStyle: currentStyles.headerTitle,
            }}
        >
            <Stack.Screen
                name="HotspotMap"
                options={{ title: 'Kaart' }}
            >
                {() => <HotspotMap hotspots={hotspots} theme={theme} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

// StackNavigator voor Instellingen
function SettingsStackScreen({ theme, setTheme }) {
    const currentStyles = safeGetThemeStyles(theme);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: currentStyles.header,
                headerTintColor: currentStyles.headerText?.color || '#000',
                headerTitleStyle: currentStyles.headerTitle,
            }}
        >
            <Stack.Screen
                name="Settings"
                options={{ title: 'Instellingen' }}
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
    const [isOffline, setIsOffline] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSettings();
        loadFavorites();
        setupNetworkListener();
        loadHotspots();
    }, []);

    const setupNetworkListener = () => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const offline = !state.isConnected || !state.isInternetReachable;
            setIsOffline(offline);

            if (offline) {
                console.log('App is offline - using cached data');
            } else {
                console.log('App is online - syncing data');
                loadHotspots(); // Refresh data when coming back online
            }
        });

        return unsubscribe;
    };

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
            setIsLoading(true);

            // Probeer eerst online data te laden
            if (!isOffline) {
                try {
                    const response = await fetch('https://raw.githubusercontent.com/QuintenVanDerBlom/Solis/refs/heads/dev/data/hotspots.json');
                    const data = await response.json();

                    // Cache de data voor offline gebruik
                    await AsyncStorage.setItem('cached_hotspots', JSON.stringify(data));
                    await AsyncStorage.setItem('last_sync', new Date().toISOString());

                    setHotspots(data);
                    console.log('Hotspots loaded from online source:', data.length);
                    setIsLoading(false);
                    return;
                } catch (onlineError) {
                    console.log('Failed to load online data, falling back to cache:', onlineError);
                }
            }

            // Fallback naar gecachte data
            const cachedData = await AsyncStorage.getItem('cached_hotspots');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                setHotspots(parsedData);
                console.log('Hotspots loaded from cache:', parsedData.length);

                const lastSync = await AsyncStorage.getItem('last_sync');
                if (lastSync) {
                    console.log('Last sync:', new Date(lastSync).toLocaleString());
                }
            } else {
                // Als laatste redmiddel, gebruik lokale fallback data
                try {
                    const localData = require('./data/hotspots.json');
                    setHotspots(localData);
                    console.log('Hotspots loaded from local fallback:', localData.length);
                } catch (localError) {
                    console.log('Error loading local hotspots:', localError);
                    setHotspots([]);
                }
            }
        } catch (error) {
            console.log('Error in loadHotspots:', error);
            setHotspots([]);
        } finally {
            setIsLoading(false);
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

    const currentStyles = safeGetThemeStyles(theme);
    const colors = safeGetThemeColors(theme);

    if (isLoading) {
        return (
            <View style={[currentStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={currentStyles.text}>Laden...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <OfflineIndicator isOffline={isOffline} theme={theme} />
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
                    tabBarActiveTintColor: colors.primary || '#007AFF',
                    tabBarInactiveTintColor: colors.textLight || '#999',
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Lijst">
                    {() => (
                        <ListStackScreen
                            hotspots={hotspots}
                            favorites={favorites}
                            theme={theme}
                            isOffline={isOffline}
                        />
                    )}
                </Tab.Screen>
                <Tab.Screen name="Kaart">
                    {() => <MapStackScreen hotspots={hotspots} theme={theme} />}
                </Tab.Screen>
                <Tab.Screen name="Instellingen">
                    {() => <SettingsStackScreen theme={theme} setTheme={setTheme} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
