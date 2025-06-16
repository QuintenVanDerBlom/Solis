import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getThemeStyles } from '../styles/styles';

export default function OfflineIndicator({ isOffline, theme }) {
    const styles = getThemeStyles(theme);

    if (!isOffline) return null;

    return (
        <View style={[offlineStyles.container, { backgroundColor: '#e74c3c' }]}>
            <Ionicons name="wifi-outline" size={16} color="white" />
            <Text style={offlineStyles.text}>Geen internetverbinding - Offline modus</Text>
        </View>
    );
}

const offlineStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    text: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
});
