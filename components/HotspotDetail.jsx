import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import { getThemeStyles } from '../styles/styles';

const { width } = Dimensions.get('window');

export default function HotspotDetail({ route, navigation, theme }) {
    const { hotspot } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);
    const [notes, setNotes] = useState('');
    const [rating, setRating] = useState(0);
    const [visitCount, setVisitCount] = useState(0);
    const styles = getThemeStyles(theme);

    useEffect(() => {
        loadLocalData();
    }, []);

    const loadLocalData = async () => {
        try {
            // Laad favorieten
            const favorites = await AsyncStorage.getItem('favorites');
            if (favorites) {
                const favList = JSON.parse(favorites);
                setIsFavorite(favList.includes(hotspot.id));
            }

            // Laad notities
            const savedNotes = await AsyncStorage.getItem(`notes_${hotspot.id}`);
            if (savedNotes) setNotes(savedNotes);

            // Laad rating
            const savedRating = await AsyncStorage.getItem(`rating_${hotspot.id}`);
            if (savedRating) setRating(parseInt(savedRating));

            // Laad bezoek teller
            const savedVisits = await AsyncStorage.getItem(`visits_${hotspot.id}`);
            if (savedVisits) setVisitCount(parseInt(savedVisits));
        } catch (error) {
            console.log('Error loading local data:', error);
        }
    };

    const toggleFavorite = async () => {
        try {
            const favorites = await AsyncStorage.getItem('favorites');
            let favList = favorites ? JSON.parse(favorites) : [];

            if (isFavorite) {
                favList = favList.filter(id => id !== hotspot.id);
            } else {
                favList.push(hotspot.id);
            }

            await AsyncStorage.setItem('favorites', JSON.stringify(favList));
            setIsFavorite(!isFavorite);
        } catch (error) {
            Alert.alert('Error', 'Kon favoriet niet opslaan');
        }
    };

    const saveNotes = async (text) => {
        setNotes(text);
        try {
            await AsyncStorage.setItem(`notes_${hotspot.id}`, text);
        } catch (error) {
            console.log('Error saving notes:', error);
        }
    };

    const setUserRating = async (newRating) => {
        setRating(newRating);
        try {
            await AsyncStorage.setItem(`rating_${hotspot.id}`, newRating.toString());
        } catch (error) {
            console.log('Error saving rating:', error);
        }
    };

    const incrementVisitCount = async () => {
        const newCount = visitCount + 1;
        setVisitCount(newCount);
        try {
            await AsyncStorage.setItem(`visits_${hotspot.id}`, newCount.toString());
            Alert.alert('Bezoek geregistreerd!', `Je hebt dit gebied nu ${newCount} keer bezocht.`);
        } catch (error) {
            console.log('Error saving visit count:', error);
        }
    };

    const navigateToMap = () => {
        navigation.navigate('Kaart', { selectedHotspot: hotspot });
    };

    const renderStars = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setUserRating(star)}
                        style={styles.starButton}
                    >
                        <Ionicons
                            name={star <= rating ? 'star' : 'star-outline'}
                            size={24}
                            color={star <= rating ? '#f39c12' : '#bdc3c7'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const getTypeIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'bos': return 'leaf';
            case 'nationaal park': return 'earth';
            case 'bloementuin': return 'flower';
            case 'wetland': return 'water';
            default: return 'location';
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header met afbeelding placeholder */}
            <View style={styles.imageContainer}>
                <View style={styles.imagePlaceholder}>
                    <Ionicons
                        name={getTypeIcon(hotspot.type)}
                        size={60}
                        color="#27ae60"
                    />
                </View>
                <TouchableOpacity
                    style={styles.favoriteButtonOverlay}
                    onPress={toggleFavorite}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={28}
                        color={isFavorite ? '#e74c3c' : '#ffffff'}
                    />
                </TouchableOpacity>
            </View>

            {/* Basis informatie */}
            <View style={styles.infoSection}>
                <Text style={styles.title}>{hotspot.name}</Text>
                <View style={styles.typeContainer}>
                    <Ionicons name={getTypeIcon(hotspot.type)} size={16} color="#27ae60" />
                    <Text style={styles.typeText}>{hotspot.type}</Text>
                </View>
                <Text style={styles.description}>{hotspot.description}</Text>
            </View>

            {/* Statistieken */}
            <View style={styles.statsSection}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{visitCount}</Text>
                    <Text style={styles.statLabel}>Bezoeken</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{rating > 0 ? rating : '-'}</Text>
                    <Text style={styles.statLabel}>Jouw Rating</Text>
                </View>
            </View>

            {/* Rating sectie */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Beoordeling</Text>
                {renderStars()}
                <Text style={styles.ratingText}>
                    {rating > 0 ? `Je hebt ${rating} ${rating === 1 ? 'ster' : 'sterren'} gegeven` : 'Geef een beoordeling'}
                </Text>
            </View>

            {/* Notities sectie */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Persoonlijke Notities</Text>
                <TextInput
                    style={styles.notesInput}
                    placeholder="Voeg je eigen notities toe..."
                    placeholderTextColor="#7f8c8d"
                    value={notes}
                    onChangeText={saveNotes}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </View>

            {/* Mini kaart */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Locatie</Text>
                <TouchableOpacity onPress={navigateToMap}>
                    <View style={styles.miniMapContainer}>
                        <MapView
                            style={styles.miniMap}
                            initialRegion={{
                                latitude: hotspot.latitude,
                                longitude: hotspot.longitude,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            rotateEnabled={false}
                            pitchEnabled={false}
                        >
                            <Marker
                                coordinate={{
                                    latitude: hotspot.latitude,
                                    longitude: hotspot.longitude,
                                }}
                                title={hotspot.name}
                            />
                        </MapView>
                        <View style={styles.mapOverlay}>
                            <Text style={styles.mapOverlayText}>Tik voor volledige kaart</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Actie knoppen */}
            <View style={styles.actionSection}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={incrementVisitCount}
                >
                    <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                    <Text style={styles.actionButtonText}>Bezoek Registreren</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={navigateToMap}
                >
                    <Ionicons name="map" size={20} color="#27ae60" />
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Bekijk op Kaart</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
