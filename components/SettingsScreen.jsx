import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getThemeStyles } from '../styles/styles';

export default function SettingsScreen({ theme, setTheme }) {
    const styles = getThemeStyles(theme);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await AsyncStorage.setItem('theme', newTheme);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.settingsTitle}>Instellingen</Text>

            <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Donkere modus</Text>
                <Switch
                    value={theme === 'dark'}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#767577', true: '#27ae60' }}
                    thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
                />
            </View>

            <View style={styles.settingItem}>
                <Text style={styles.settingDescription}>
                    Schakel tussen lichte en donkere weergave voor een betere ervaring.
                </Text>
            </View>
        </View>
    );
}
