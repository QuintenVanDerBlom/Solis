import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getThemeStyles } from '../styles/styles';

export default function HotspotMap({ hotspots, theme, route }) {
    const [userLocation, setUserLocation] = useState(null);
    const [selectedHotspot, setSelectedHotspot] = useState(route?.params?.selectedHotspot);
    const styles = getThemeStyles(theme);

    useEffect(() => {
        getUserLocation();
    }, []);

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
        if (selectedHotspot) {
            return {
                latitude: selectedHotspot.latitude,
                longitude: selectedHotspot.longitude,
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

    return (
        <View style={styles.container}>
            <MapView
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
                        pinColor={hotspot.type === 'bos' ? '#27ae60' : '#f39c12'}
                    />
                ))}
            </MapView>
        </View>
    );
}
