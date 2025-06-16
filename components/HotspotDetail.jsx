import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Dimensions, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import { getThemeStyles } from '../styles/styles';
import BiometricAuth from './BiometricAuth';

const { width } = Dimensions.get('window');

export default function HotspotDetail({ route, navigation, theme }) {
    const { hotspot } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);
    const [notes, setNotes] = useState('');
    const [tempNotes, setTempNotes] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [rating, setRating] = useState(0);
    const [visitCount, setVisitCount] = useState(0);
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const styles = getThemeStyles(theme);

    useEffect(() => {
        loadLocalData();
    }, []);

    const loadLocalData = async () => {
        try {
            const favorites = await AsyncStorage.getItem('favorites');
            if (favorites) {
                const favList = JSON.parse(favorites);
                setIsFavorite(favList.includes(hotspot.id));
            }

            const savedNotes = await AsyncStorage.getItem(`notes_${hotspot.id}`);
            if (savedNotes) {
                setNotes(savedNotes);
                setTempNotes(savedNotes);
            }

            const savedRating = await AsyncStorage.getItem(`rating_${hotspot.id}`);
            if (savedRating) setRating(parseInt(savedRating));

            const savedVisits = await AsyncStorage.getItem(`visits_${hotspot.id}`);
            if (savedVisits) setVisitCount(parseInt(savedVisits));
        } catch (error) {
            console.log('Error loading local data:', error);
        }
    };

    const requireBiometricAuth = (action, callback) => {
        setPendingAction({ action, callback });
        setShowBiometricModal(true);
    };

    const handleBiometricSuccess = () => {
        setShowBiometricModal(false);
        if (pendingAction?.callback) {
            pendingAction.callback();
        }
        setPendingAction(null);
    };

    const handleBiometricCancel = () => {
        setShowBiometricModal(false);
        setPendingAction(null);
    };

    const toggleFavorite = () => {
        requireBiometricAuth('favorieten wijzigen', async () => {
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
                Alert.alert('Succes', `Locatie ${isFavorite ? 'verwijderd uit' : 'toegevoegd aan'} favorieten`);
            } catch (error) {
                Alert.alert('Error', 'Kon favoriet niet opslaan');
            }
        });
    };

    const handleNotesChange = (text) => {
        setTempNotes(text);
        setHasUnsavedChanges(text !== notes);
    };

    const saveNotes = () => {
        if (!hasUnsavedChanges) {
            Alert.alert('Geen wijzigingen', 'Er zijn geen wijzigingen om op te slaan.');
            return;
        }

        requireBiometricAuth('notities opslaan', async () => {
            try {
                await AsyncStorage.setItem(`notes_${hotspot.id}`, tempNotes);
                setNotes(tempNotes);
                setHasUnsavedChanges(false);
                Alert.alert('Succes', 'Notities zijn opgeslagen');
            } catch (error) {
                console.log('Error saving notes:', error);
                Alert.alert('Error', 'Kon notities niet opslaan');
            }
        });
    };

    const cancelNotesChanges = () => {
        setTempNotes(notes);
        setHasUnsavedChanges(false);
    };

    const setUserRating = (newRating) => {
        requireBiometricAuth('beoordeling wijzigen', async () => {
            try {
                await AsyncStorage.setItem(`rating_${hotspot.id}`, newRating.toString());
                setRating(newRating);
                Alert.alert('Succes', `Beoordeling van ${newRating} sterren opgeslagen`);
            } catch (error) {
                console.log('Error saving rating:', error);
                Alert.alert('Error', 'Kon beoordeling niet opslaan');
            }
        });
    };

    const incrementVisitCount = () => {
        requireBiometricAuth('bezoek registreren', async () => {
            const newCount = visitCount + 1;
            try {
                await AsyncStorage.setItem(`visits_${hotspot.id}`, newCount.toString());
                setVisitCount(newCount);
                Alert.alert('Bezoek geregistreerd!', `Je hebt dit gebied nu ${newCount} keer bezocht.`);
            } catch (error) {
                console.log('Error saving visit count:', error);
                Alert.alert('Error', 'Kon bezoek niet registreren');
            }
        });
    };

    const shareHotspotData = async () => {
        try {
            const shareContent = {
                title: `${hotspot.name} - Natuurgebied`,
                message: `Bekijk deze locatie: ${hotspot.name}\n\n` +
                    `Type: ${hotspot.type}\n` +
                    `Beschrijving: ${hotspot.description}\n` +
                    `Locatie: ${hotspot.latitude}, ${hotspot.longitude}\n` +
                    `Mijn beoordeling: ${rating > 0 ? `${rating} sterren` : 'Nog niet beoordeeld'}\n` +
                    `Aantal bezoeken: ${visitCount}\n` +
                    `${notes ? `Mijn notities: ${notes}` : ''}\n\n` +
                    `Gedeeld vanuit de Solice App`,
                url: `https://maps.google.com/?q=${hotspot.latitude},${hotspot.longitude}`
            };

            await Share.share(shareContent);
        } catch (error) {
            console.log('Error sharing:', error);
            Alert.alert('Error', 'Kon gegevens niet delen');
        }
    };

    // Delete functionaliteit
    const confirmDeleteAllData = () => {
        setShowDeleteConfirm(true);
    };

    const deleteAllLocalData = () => {
        requireBiometricAuth('alle gegevens verwijderen', async () => {
            try {
                // Verwijder alle lokale data voor deze hotspot
                await AsyncStorage.multiRemove([
                    `notes_${hotspot.id}`,
                    `rating_${hotspot.id}`,
                    `visits_${hotspot.id}`
                ]);

                // Verwijder uit favorieten
                const favorites = await AsyncStorage.getItem('favorites');
                if (favorites) {
                    const favList = JSON.parse(favorites);
                    const updatedFavList = favList.filter(id => id !== hotspot.id);
                    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavList));
                }

                // Reset alle states
                setNotes('');
                setTempNotes('');
                setRating(0);
                setVisitCount(0);
                setIsFavorite(false);
                setShowDeleteConfirm(false);
                setHasUnsavedChanges(false);

                Alert.alert('Succes', 'Alle lokale gegevens zijn verwijderd');
            } catch (error) {
                console.log('Error deleting data:', error);
                Alert.alert('Error', 'Kon gegevens niet verwijderen');
            }
        });
    };

    const navigateToMap = () => {
        navigation.navigate('HotspotMapDetail', { hotspot });
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
        const typeKey = type.toLowerCase();
        switch (typeKey) {
            case 'bos': return 'leaf';
            case 'nationaal park': return 'earth';
            case 'bloementuin': return 'flower';
            case 'wetland': return 'water';
            case 'waterrijk gebied': return 'boat';
            case 'cultuurlandschap': return 'business';
            case 'stadspark': return 'library';
            case 'natuurgebied': return 'trail-sign';
            case 'natuurpark': return 'mountain';
            case 'natuurreservaat': return 'shield-checkmark';
            default: return 'location';
        }
    };

    const getTypeColor = (type) => {
        const typeKey = type.toLowerCase();
        switch (typeKey) {
            case 'bos': return '#228B22';
            case 'nationaal park': return '#2E8B57';
            case 'bloementuin': return '#FF69B4';
            case 'wetland': return '#4682B4';
            case 'waterrijk gebied': return '#1E90FF';
            case 'cultuurlandschap': return '#8B4513';
            case 'stadspark': return '#32CD32';
            case 'natuurgebied': return '#9ACD32';
            case 'natuurpark': return '#6B8E23';
            case 'natuurreservaat': return '#008B8B';
            default: return '#27ae60';
        }
    };

    return (
        <>
            <ScrollView style={styles.container}>
                {/* Basis informatie */}
                <View style={styles.infoSection}>
                    <Text style={styles.title}>{hotspot.name}</Text>
                    <View style={styles.typeContainer}>
                        <Ionicons name={getTypeIcon(hotspot.type)} size={16} color={getTypeColor(hotspot.type)} />
                        <Text style={[styles.typeText, { color: getTypeColor(hotspot.type) }]}>{hotspot.type}</Text>
                    </View>
                    <Text style={styles.description}>{hotspot.description}</Text>

                    {/* Favorite button moved to info section */}
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={toggleFavorite}
                    >
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isFavorite ? '#e74c3c' : '#7f8c8d'}
                        />
                        <Text style={styles.favoriteButtonText}>
                            {isFavorite ? 'Verwijder uit favorieten' : 'Toevoegen aan favorieten'}
                        </Text>
                    </TouchableOpacity>
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
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="shield-checkmark" size={18} color="#27ae60" /> Beoordeling
                    </Text>
                    {renderStars()}
                    <Text style={styles.ratingText}>
                        {rating > 0 ? `Je hebt ${rating} ${rating === 1 ? 'ster' : 'sterren'} gegeven` : 'Geef een beoordeling'}
                    </Text>
                    <Text style={styles.securityNote}>🔒 Beveiligd met biometrische authenticatie</Text>
                </View>

                {/* Notities sectie */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="shield-checkmark" size={18} color="#27ae60" /> Persoonlijke Notities
                    </Text>

                    <TextInput
                        style={[
                            styles.notesInput,
                            hasUnsavedChanges && styles.notesInputModified
                        ]}
                        placeholder="Voeg je eigen notities toe..."
                        placeholderTextColor="#7f8c8d"
                        value={tempNotes}
                        onChangeText={handleNotesChange}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    {/* Status indicator */}
                    {hasUnsavedChanges && (
                        <View style={styles.unsavedIndicator}>
                            <Ionicons name="warning" size={16} color="#ff6b35" />
                            <Text style={styles.unsavedText}>Je hebt niet-opgeslagen wijzigingen</Text>
                        </View>
                    )}

                    {/* Action buttons */}
                    <View style={styles.notesActionContainer}>
                        <TouchableOpacity
                            style={[
                                styles.notesButton,
                                styles.saveButton,
                                !hasUnsavedChanges && styles.buttonDisabled
                            ]}
                            onPress={saveNotes}
                            disabled={!hasUnsavedChanges}
                        >
                            <Ionicons name="save" size={18} color="#ffffff" />
                            <Text style={styles.notesButtonText}>Opslaan</Text>
                        </TouchableOpacity>

                        {hasUnsavedChanges && (
                            <TouchableOpacity
                                style={[styles.notesButton, styles.cancelButton]}
                                onPress={cancelNotesChanges}
                            >
                                <Ionicons name="close" size={18} color="#e53e3e" />
                                <Text style={[styles.notesButtonText, styles.cancelButtonText]}>Annuleren</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={styles.securityNote}>🔒 Beveiligd met biometrische authenticatie</Text>
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

                {/* Actie knoppen sectie */}
                <View style={styles.actionSection}>
                    {/* Bezoek Registreren button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={incrementVisitCount}
                    >
                        <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
                        <Text style={styles.actionButtonText}>Bezoek Registreren</Text>
                    </TouchableOpacity>

                    {/* Share button */}
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#3498db', marginTop: 10 }]}
                        onPress={shareHotspotData}
                    >
                        <Ionicons name="share-outline" size={20} color="#ffffff" />
                        <Text style={styles.actionButtonText}>Delen</Text>
                    </TouchableOpacity>

                    {/* Delete button */}
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#e74c3c', marginTop: 10 }]}
                        onPress={confirmDeleteAllData}
                    >
                        <Ionicons name="trash-outline" size={20} color="#ffffff" />
                        <Text style={styles.actionButtonText}>Alle Gegevens Verwijderen</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                visible={showDeleteConfirm}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDeleteConfirm(false)}
            >
                <View style={styles.modalOverlay || {
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={styles.deleteModal || {
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        margin: 20,
                        alignItems: 'center'
                    }}>
                        <Ionicons name="warning" size={48} color="#e74c3c" />
                        <Text style={[styles.title, { textAlign: 'center', marginTop: 10 }]}>
                            Alle gegevens verwijderen?
                        </Text>
                        <Text style={[styles.description, { textAlign: 'center', marginVertical: 15 }]}>
                            Dit verwijdert alle lokale gegevens voor deze locatie:
                            {'\n'}• Notities
                            {'\n'}• Beoordeling
                            {'\n'}• Bezoekteller
                            {'\n'}• Favorietenstatus
                            {'\n\n'}Deze actie kan niet ongedaan worden gemaakt.
                        </Text>
                        <View style={styles.notesActionContainer}>
                            <TouchableOpacity
                                onPress={() => setShowDeleteConfirm(false)}
                                style={[styles.notesButton, styles.cancelButton]}
                            >
                                <Text style={[styles.notesButtonText, styles.cancelButtonText]}>Annuleren</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={deleteAllLocalData}
                                style={[styles.notesButton, { backgroundColor: '#e74c3c' }]}
                            >
                                <Text style={styles.notesButtonText}>Verwijderen</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showBiometricModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleBiometricCancel}
            >
                <BiometricAuth
                    theme={theme}
                    onSuccess={handleBiometricSuccess}
                    onCancel={handleBiometricCancel}
                    action={pendingAction?.action || 'wijzigen'}
                />
            </Modal>
        </>
    );
}
