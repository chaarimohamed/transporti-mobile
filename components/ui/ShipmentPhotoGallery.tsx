import React, { useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../theme';
import { AppIcon } from './Icon';

interface ShipmentPhotoGalleryProps {
  photos: string[];
  totalPhotos?: number;
}

const toImageUri = (photo: string) =>
  photo.startsWith('data:') || photo.startsWith('http')
    ? photo
    : `data:image/jpeg;base64,${photo}`;

const ShipmentPhotoGallery: React.FC<ShipmentPhotoGalleryProps> = ({
  photos,
  totalPhotos,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!photos.length) {
    return null;
  }

  const selectedPhoto = selectedIndex != null ? photos[selectedIndex] : null;
  const hasMorePhotos = (totalPhotos ?? photos.length) > photos.length;

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photosScrollContent}
      >
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={`shipment-photo-${index}`}
            activeOpacity={0.85}
            onPress={() => setSelectedIndex(index)}
            style={styles.photoButton}
          >
            <Image source={{ uri: toImageUri(photo) }} style={styles.photoThumb} />
            <View style={styles.zoomBadge}>
              <AppIcon name="search" size={12} color={Colors.textInverse} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.photosHint}>Touchez une photo pour l'agrandir.</Text>
      {hasMorePhotos && (
        <Text style={styles.photosCaption}>
          {totalPhotos} photos enregistrées pour cette expédition.
        </Text>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={selectedPhoto != null}
        onRequestClose={() => setSelectedIndex(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalCounter}>
              {selectedIndex != null ? `${selectedIndex + 1} / ${photos.length}` : ''}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedIndex(null)}
              style={styles.modalCloseButton}
            >
              <AppIcon name="close" size={18} color={Colors.textInverse} />
            </TouchableOpacity>
          </View>

          {selectedPhoto && (
            <View style={styles.modalImageWrapper}>
              <Image
                source={{ uri: toImageUri(selectedPhoto) }}
                resizeMode="contain"
                style={styles.modalImage}
              />
            </View>
          )}

          {photos.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modalThumbsContent}
            >
              {photos.map((photo, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <TouchableOpacity
                    key={`shipment-modal-photo-${index}`}
                    activeOpacity={0.85}
                    onPress={() => setSelectedIndex(index)}
                    style={[
                      styles.modalThumbButton,
                      isSelected && styles.modalThumbButtonSelected,
                    ]}
                  >
                    <Image source={{ uri: toImageUri(photo) }} style={styles.modalThumbImage} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalCloseButton: {
    alignItems: 'center',
    backgroundColor: Colors.overlayLight,
    borderRadius: Radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  modalContainer: {
    backgroundColor: Colors.navy,
    flex: 1,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  modalCounter: {
    color: Colors.textInverse,
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  modalImage: {
    borderRadius: Radius.lg,
    flex: 1,
    width: '100%',
  },
  modalImageWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  modalThumbButton: {
    borderColor: 'transparent',
    borderRadius: Radius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  modalThumbButtonSelected: {
    borderColor: Colors.primary,
  },
  modalThumbImage: {
    backgroundColor: Colors.backgroundAlt,
    height: 64,
    width: 64,
  },
  modalThumbsContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  photoButton: {
    position: 'relative',
  },
  photoThumb: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.md,
    height: 96,
    width: 96,
  },
  photosCaption: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    marginTop: Spacing.sm,
  },
  photosHint: {
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    marginTop: Spacing.sm,
  },
  photosScrollContent: {
    gap: Spacing.sm + 4,
  },
  zoomBadge: {
    alignItems: 'center',
    backgroundColor: Colors.overlay,
    borderRadius: Radius.full,
    bottom: 8,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    width: 24,
  },
});

export default ShipmentPhotoGallery;