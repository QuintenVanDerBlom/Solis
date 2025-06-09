import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { getThemeStyles } from '../styles/styles';

export default function BiometricAuth({ theme, onSuccess, onCancel, action = "wijzigen" }) {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [biometricType, setBiometricType] = useState(null);
    const styles = getThemeStyles(theme);

    useEffect(() => {
        checkBiometricSupport();
    }, []);

    const checkBiometricSupport = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

            if (hasHardware && supportedTypes.length > 0) {
                // Check voor Samsung fingerprint (TYPE_FINGERPRINT = 1)
                if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                    setBiometricType('fingerprint');
                } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                    setBiometricType('face');
                } else {
                    setBiometricType('biometric');
                }
            }
        } catch (error) {
            console.log('Error checking biometric support:', error);
        }
    };

    const authenticateWithBiometric = async () => {
        try {
            setIsAuthenticating(true);

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                Alert.alert(
                    'Geen biometrische gegevens',
                    'Er zijn geen vingerafdrukken of gezichtsherkenning ingesteld op dit apparaat.',
                    [{ text: 'OK', onPress: onCancel }]
                );
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: `Bevestig je identiteit om ${action} te kunnen uitvoeren`,
                subtitle: 'Gebruik je vingerafdruk of gezichtsherkenning',
                cancelLabel: 'Annuleren',
                fallbackLabel: 'Gebruik wachtwoord',
                disableDeviceFallback: false,
            });

            if (result.success) {
                onSuccess();
            } else {
                if (result.error === 'user_cancel') {
                    onCancel();
                } else {
                    Alert.alert(
                        'Authenticatie mislukt',
                        'Biometrische authenticatie is mislukt. Probeer het opnieuw.',
                        [
                            { text: 'Opnieuw', onPress: authenticateWithBiometric },
                            { text: 'Annuleren', onPress: onCancel }
                        ]
                    );
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Er is een fout opgetreden bij de authenticatie.');
            onCancel();
        } finally {
            setIsAuthenticating(false);
        }
    };

    const getBiometricIcon = () => {
        switch (biometricType) {
            case 'fingerprint':
                return 'finger-print';
            case 'face':
                return 'scan';
            default:
                return 'shield-checkmark';
        }
    };

    const getBiometricText = () => {
        switch (biometricType) {
            case 'fingerprint':
                return 'Samsung Vingerafdruk';
            case 'face':
                return 'Gezichtsherkenning';
            default:
                return 'Biometrische Beveiliging';
        }
    };

    return (
        <View style={styles.biometricContainer}>
            <View style={styles.biometricContent}>
                <Ionicons
                    name={getBiometricIcon()}
                    size={48}
                    color={styles.biometricIcon.color}
                    style={styles.biometricIconStyle}
                />
                <Text style={styles.biometricTitle}>Beveiliging Vereist</Text>
                <Text style={styles.biometricSubtitle}>
                    Bevestig je identiteit om deze locatiegegevens te kunnen {action}
                </Text>

                <TouchableOpacity
                    style={[styles.biometricButton, isAuthenticating && styles.biometricButtonDisabled]}
                    onPress={authenticateWithBiometric}
                    disabled={isAuthenticating}
                >
                    <Ionicons name={getBiometricIcon()} size={20} color="#ffffff" />
                    <Text style={styles.biometricButtonText}>
                        {isAuthenticating ? 'Authenticeren...' : `${getBiometricText()} Gebruiken`}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.biometricCancelButton}
                    onPress={onCancel}
                >
                    <Text style={styles.biometricCancelText}>Annuleren</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
