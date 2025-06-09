import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getThemeStyles } from '../styles/styles';

export default function HotspotMap({ hotspots, theme, selectedHotspot, route }) {
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);
    const styles = getThemeStyles(theme);

    // Gebruik selectedHotspot van props of route params
    const targetHotspot = selectedHotspot || route?.params?.selectedHotspot;

    useEffect(() => {
        getUserLocation();
    }, []);

    // Zoom naar hotspot wanneer deze verandert
    useEffect(() => {
        if (targetHotspot && mapRef.current) {
            const region = {
                latitude: targetHotspot.latitude,
                longitude: targetHotspot.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            // Wacht even voordat je animeert (voor betere UX)
            setTimeout(() => {
                mapRef.current.animateToRegion(region, 1000);
            }, 500);
        }
    }, [targetHotspot]);

    const getUserLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Locatie toegang geweigerd');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        } catch (error) {
            console.log('Error getting location:', error);
        }
    };

    const getInitialRegion = () => {
        if (targetHotspot) {
            return {
                latitude: targetHotspot.latitude,
                longitude: targetHotspot.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        }
        return userLocation || {
            latitude: 52.3676, // Nederland centrum
            longitude: 4.9041,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
        };
    };

    const getTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'bos': return '#27ae60';
            case 'nationaal park': return '#e74c3c';
            case 'bloementuin': return '#f39c12';
            case 'wetland': return '#3498db';
            case 'stadspark': return '#9b59b6';
            default: return '#34495e';
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={getInitialRegion()}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {hotspots.map((hotspot) => (
                    <Marker
                        key={hotspot.id}
                        coordinate={{
                            latitude: hotspot.latitude,
                            longitude: hotspot.longitude,
                        }}
                        title={hotspot.name}
                        description={hotspot.description}
                        pinColor={getTypeIcon(hotspot.type)}
                    />
                ))}

                {/* Extra marker voor geselecteerde hotspot */}
                {targetHotspot && (
                    <Marker
                        coordinate={{
                            latitude: targetHotspot.latitude,
                            longitude: targetHotspot.longitude,
                        }}
                        title={`📍 ${targetHotspot.name}`}
                        description="Geselecteerde locatie"
                        pinColor="#e74c3c"
                    />
                )}
            </MapView>
        </View>
    );
}
