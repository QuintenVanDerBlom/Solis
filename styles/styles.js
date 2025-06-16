import { StyleSheet } from 'react-native';

const lightTheme = {
    // Natuur kleuren - licht thema
    background: '#f8fffe',
    surface: '#ffffff',
    surfaceSecondary: '#f0f9f7',
    primary: '#2d5a27', // Donkergroen
    primaryLight: '#4a7c59', // Lichter groen
    secondary: '#8b4513', // Aardetoon
    accent: '#ff6b35', // Oranje accent
    text: '#1a1a1a',
    textSecondary: '#4a5568',
    textLight: '#718096',
    border: '#e2e8f0',
    success: '#38a169',
    warning: '#dd6b20',
    error: '#e53e3e',
    shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkTheme = {
    // Natuur kleuren - donker thema
    background: '#0f1419',
    surface: '#1a202c',
    surfaceSecondary: '#2d3748',
    primary: '#68d391', // Lichtgroen voor donker thema
    primaryLight: '#9ae6b4',
    secondary: '#d69e2e', // Gouden accent
    accent: '#ff7a00',
    text: '#f7fafc',
    textSecondary: '#cbd5e0',
    textLight: '#a0aec0',
    border: '#4a5568',
    success: '#68d391',
    warning: '#f6ad55',
    error: '#fc8181',
    shadow: 'rgba(0, 0, 0, 0.3)',
};

export const getThemeStyles = (theme) => {
    const colors = theme === 'dark' ? darkTheme : lightTheme;

    return StyleSheet.create({
        // Base containers
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },

        // Headers
        header: {
            backgroundColor: colors.primary,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        headerTitle: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: '600',
        },

        // Tab Bar
        tabBar: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: 5,
            paddingTop: 5,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 8,
        },

        // Search
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            margin: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        searchIcon: {
            marginRight: 12,
            color: colors.primary,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: colors.text,
            fontWeight: '400',
        },

        // List items
        list: {
            flex: 1,
            paddingHorizontal: 8,
        },
        listItem: {
            flexDirection: 'row',
            backgroundColor: colors.surface,
            marginHorizontal: 8,
            marginVertical: 6,
            padding: 18,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 5,
            elevation: 4,
        },
        listItemContent: {
            flex: 1,
            paddingRight: 12,
        },
        listItemTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 6,
            letterSpacing: 0.3,
        },
        listItemSubtitle: {
            fontSize: 14,
            color: colors.primary,
            marginBottom: 6,
            fontWeight: '600',
            textTransform: 'capitalize',
        },
        listItemDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
        },
        favoriteButton: {
            padding: 8,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },

        // Map
        map: {
            flex: 1,
        },

        // Settings
        settingsTitle: {
            fontSize: 28,
            fontWeight: '800',
            color: colors.text,
            margin: 20,
            marginBottom: 24,
            letterSpacing: 0.5,
        },
        settingItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            marginVertical: 6,
            padding: 20,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        settingLabel: {
            fontSize: 17,
            color: colors.text,
            fontWeight: '600',
        },
        settingDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            marginHorizontal: 16,
            marginTop: 8,
            lineHeight: 20,
            fontStyle: 'italic',
        },

        // HotspotDetail specific styles
        imageContainer: {
            height: 220,
            backgroundColor: colors.surfaceSecondary,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        imagePlaceholder: {
            width: '100%',
            height: '100%',
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.1,
        },
        favoriteButtonOverlay: {
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 25,
            padding: 12,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },

        // Info sections
        infoSection: {
            padding: 20,
            backgroundColor: colors.background,
        },
        title: {
            fontSize: 26,
            fontWeight: '800',
            color: colors.text,
            marginBottom: 10,
            letterSpacing: 0.5,
        },
        typeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            backgroundColor: colors.surfaceSecondary,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            alignSelf: 'flex-start',
        },
        typeText: {
            fontSize: 14,
            color: colors.primary,
            marginLeft: 6,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        description: {
            fontSize: 16,
            color: colors.textSecondary,
            lineHeight: 24,
            fontWeight: '400',
        },

        // Stats
        statsSection: {
            flexDirection: 'row',
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            borderRadius: 16,
            padding: 20,
            justifyContent: 'space-around',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 5,
            elevation: 4,
        },
        statItem: {
            alignItems: 'center',
        },
        statNumber: {
            fontSize: 28,
            fontWeight: '800',
            color: colors.primary,
            letterSpacing: 0.5,
        },
        statLabel: {
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 4,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },

        // Sections
        section: {
            margin: 16,
            padding: 20,
            backgroundColor: colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 5,
            elevation: 4,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 16,
            letterSpacing: 0.3,
        },

        // Stars
        starsContainer: {
            flexDirection: 'row',
            marginBottom: 12,
            justifyContent: 'center',
        },
        starButton: {
            marginHorizontal: 4,
            padding: 4,
        },
        ratingText: {
            fontSize: 14,
            color: colors.textSecondary,
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: 8,
        },

        // Notes input
        notesInput: {
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: colors.text,
            backgroundColor: colors.background,
            minHeight: 120,
            textAlignVertical: 'top',
            fontWeight: '400',
            lineHeight: 22,
        },
        notesInputModified: {
            borderColor: colors.warning,
            backgroundColor: colors.surfaceSecondary,
        },
        unsavedIndicator: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            marginBottom: 12,
            padding: 8,
            backgroundColor: colors.surfaceSecondary,
            borderRadius: 8,
            borderLeftWidth: 3,
            borderLeftColor: colors.warning,
        },
        unsavedText: {
            fontSize: 14,
            color: colors.warning,
            marginLeft: 6,
            fontWeight: '500',
        },
        notesActionContainer: {
            flexDirection: 'row',
            marginTop: 16,
            gap: 12,
        },
        notesButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 14,
            borderRadius: 10,
            gap: 8,
        },
        saveButton: {
            backgroundColor: colors.success,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
        },
        cancelButton: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.error,
        },
        buttonDisabled: {
            opacity: 0.5,
            backgroundColor: colors.textLight,
        },
        notesButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
        },
        cancelButtonText: {
            color: colors.error,
        },

        // Mini map
        miniMapContainer: {
            height: 180,
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            borderWidth: 1,
            borderColor: colors.border,
        },
        miniMap: {
            flex: 1,
        },
        mapOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(45, 90, 39, 0.9)',
            padding: 12,
            alignItems: 'center',
        },
        mapOverlayText: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '700',
            letterSpacing: 0.5,
        },

        // Action buttons
        actionSection: {
            padding: 16,
            gap: 12,
        },
        actionButton: {
            backgroundColor: colors.primary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 18,
            borderRadius: 14,
            gap: 10,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 6,
        },
        actionButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        secondaryButton: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary,
        },
        secondaryButtonText: {
            color: colors.primary,
        },
        securityNote: {
            fontSize: 12,
            color: colors.textLight,
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: 12,
        },

        // Biometric Authentication Styles
        biometricContainer: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        biometricContent: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 30,
            alignItems: 'center',
            width: '90%',
            maxWidth: 350,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 10,
        },
        biometricIconStyle: {
            marginBottom: 20,
        },
        biometricIcon: {
            color: colors.primary,
        },
        biometricTitle: {
            fontSize: 22,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 12,
            textAlign: 'center',
        },
        biometricSubtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 30,
            lineHeight: 22,
        },
        biometricButton: {
            backgroundColor: colors.primary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            paddingVertical: 20,
            paddingHorizontal: 28,
            borderRadius: 12,
            width: '100%',
            marginBottom: 16,
            gap: 10,
        },

        biometricButtonDisabled: {
            opacity: 0.6,
        },
        biometricButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
        },
        biometricCancelButton: {
            padding: 12,
        },
        biometricCancelText: {
            color: colors.textSecondary,
            fontSize: 16,
            fontWeight: '500',
        },
    });
};

// Export theme colors for use in components
export const getThemeColors = (theme) => {
    return theme === 'dark' ? darkTheme : lightTheme;
};
