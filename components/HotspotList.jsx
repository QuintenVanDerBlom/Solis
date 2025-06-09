import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getThemeStyles } from '../styles/styles';

export default function HotspotList({ hotspots, favorites, theme, navigation }) {
    const [searchText, setSearchText] = useState('');
    const [localFavorites, setLocalFavorites] = useState(favorites);
    const styles = getThemeStyles(theme);

    const filteredHotspots = hotspots.filter(hotspot =>
        hotspot.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const toggleFavorite = async (hotspotId) => {
        const newFavorites = localFavorites.includes(hotspotId)
            ? localFavorites.filter(id => id !== hotspotId)
            : [...localFavorites, hotspotId];

        setLocalFavorites(newFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    const navigateToDetail = (hotspot) => {
        navigation.navigate('HotspotDetail', { hotspot });
    };

    const renderHotspot = ({ item }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigateToDetail(item)}
        >
            <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{item.name}</Text>
                <Text style={styles.listItemSubtitle}>{item.type}</Text>
                <Text style={styles.listItemDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(item.id)}
            >
                <Ionicons
                    name={localFavorites.includes(item.id) ? 'heart' : 'heart-outline'}
                    size={24}
                    color={localFavorites.includes(item.id) ? '#e74c3c' : '#7f8c8d'}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Zoek natuurgebieden..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>
            <FlatList
                data={filteredHotspots}
                renderItem={renderHotspot}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
            />
        </View>
    );
}
