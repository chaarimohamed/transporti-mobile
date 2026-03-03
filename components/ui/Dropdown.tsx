import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';

interface DropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  icon?: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = 'Sélectionner',
  value,
  onValueChange,
  options,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.text, !value && styles.placeholder]}>
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Sélectionner'}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    value === option.value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E9E9E9',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  placeholder: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 4,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F6F6',
  },
  selectedOption: {
    backgroundColor: '#F0F7FF',
  },
  optionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  selectedOptionText: {
    color: '#1464F6',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#1464F6',
    fontWeight: 'bold',
  },
});
