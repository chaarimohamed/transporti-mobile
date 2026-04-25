import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { googlePlacesService, GoogleSuggestion, AddressDetails } from '../../services/googlePlaces.service';
import { Colors, Fonts, FontSizes, Radius, Shadows, Spacing } from '../../theme';
import { AppIcon } from './Icon';

interface AddressAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectAddress: (address: AddressDetails) => void;
  placeholder?: string;
  iconText?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChangeText,
  onSelectAddress,
  placeholder = 'Rechercher une adresse',
  iconText = '📍',
}) => {
  const [suggestions, setSuggestions] = useState<GoogleSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  // When true, the current `value` change came from a programmatic selection — skip re-search
  const justSelected = useRef(false);

  // Start a new session when component mounts
  useEffect(() => {
    googlePlacesService.startSession();
  }, []);

  // Fetch suggestions as user types (with debounce)
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If the change came from a programmatic selection, skip the search
    if (justSelected.current) {
      justSelected.current = false;
      return;
    }

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      const results = await googlePlacesService.getSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setLoading(false);
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value]);

  const handleSelectSuggestion = async (suggestion: GoogleSuggestion) => {
    setShowSuggestions(false);
    setLoading(true);

    // Retrieve full address details with coordinates
    const addressDetails = await googlePlacesService.retrieveAddress(suggestion.place_id);
    
    setLoading(false);

    if (addressDetails) {
      // Mark as a programmatic change so the useEffect skips re-searching
      justSelected.current = true;
      onChangeText(addressDetails.fullAddress);
      onSelectAddress(addressDetails);
    }
  };

  const renderSuggestion = ({ item }: { item: GoogleSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}
      activeOpacity={0.7}
    >
      <AppIcon name="map-pin" size={16} color={Colors.textMuted} />
      <View style={styles.suggestionTextContainer}>
        <Text style={styles.suggestionName}>{item.structured_formatting.main_text}</Text>
        {item.structured_formatting.secondary_text && (
          <Text style={styles.suggestionPlace}>{item.structured_formatting.secondary_text}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <AppIcon name="location-pin" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (text.length >= 2) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color={Colors.primary}
            style={styles.loader}
          />
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.place_id}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    gap: Spacing.sm + 4,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  loader: {
    marginLeft: Spacing.sm,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 250,
    ...Shadows.md,
    zIndex: 1001,
  },
  suggestionsList: {
    flexGrow: 0,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm + 4,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionName: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  suggestionPlace: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
