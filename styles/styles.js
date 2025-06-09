import { StyleSheet } from 'react-native';

const lightTheme = {
    background: '#ffffff',
    surface: '#f8f9fa',
    primary: '#27ae60',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    border: '#ecf0f1',
};

const darkTheme = {
    background: '#2c3e50',
    surface: '#34495e',
    primary: '#27ae60',
    text: '#ecf0f1',
    textSecondary: '#bdc3c7',
    border: '#7f8c8d',
};

export const getThemeStyles = (theme) => {
    const colors = theme === 'dark' ? darkTheme : lightTheme;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            backgroundColor: colors.primary,
        },
        tabBar: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            margin: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: colors.text,
        },
        list: {
            flex: 1,
        },
        listItem: {
            flexDirection: 'row',
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            marginVertical: 4,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        listItemContent: {
            flex: 1,
        },
        listItemTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
        },
        listItemSubtitle: {
            fontSize: 14,
            color: colors.primary,
            marginBottom: 4,
        },
        listItemDescription: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        favoriteButton: {
            padding: 8,
        },
        map: {
            flex: 1,
        },
        settingsTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            margin: 16,
        },
        settingItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            marginVertical: 4,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        settingLabel: {
            fontSize: 16,
            color: colors.text,
        },
        settingDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            marginHorizontal: 16,
            marginTop: 8,
        },

        // Voeg deze toe aan de getThemeStyles functie
        imageContainer: {
            height: 200,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        imagePlaceholder: {
            width: '100%',
            height: '100%',
            backgroundColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
        },
        favoriteButtonOverlay: {
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 20,
            padding: 8,
        },
        infoSection: {
            padding: 16,
            backgroundColor: colors.background,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
        },
        typeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        typeText: {
            fontSize: 16,
            color: colors.primary,
            marginLeft: 6,
            fontWeight: '600',
        },
        description: {
            fontSize: 16,
            color: colors.textSecondary,
            lineHeight: 24,
        },
        statsSection: {
            flexDirection: 'row',
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            borderRadius: 8,
            padding: 16,
            justifyContent: 'space-around',
        },
        statItem: {
            alignItems: 'center',
        },
        statNumber: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.primary,
        },
        statLabel: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 4,
        },
        section: {
            margin: 16,
            padding: 16,
            backgroundColor: colors.surface,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
        },
        starsContainer: {
            flexDirection: 'row',
            marginBottom: 8,
        },
        starButton: {
            marginRight: 8,
        },
        ratingText: {
            fontSize: 14,
            color: colors.textSecondary,
            fontStyle: 'italic',
        },
        notesInput: {
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: colors.text,
            backgroundColor: colors.background,
            minHeight: 100,
        },
        miniMapContainer: {
            height: 150,
            borderRadius: 8,
            overflow: 'hidden',
            position: 'relative',
        },
        miniMap: {
            flex: 1,
        },
        mapOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 8,
            alignItems: 'center',
        },
        mapOverlayText: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '600',
        },
        actionSection: {
            padding: 16,
            gap: 12,
        },
        actionButton: {
            backgroundColor: colors.primary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            borderRadius: 8,
            gap: 8,
        },
        actionButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
        },
        secondaryButton: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary,
        },
        secondaryButtonText: {
            color: colors.primary,
        },
    });
};

