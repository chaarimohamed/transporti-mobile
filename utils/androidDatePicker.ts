import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

interface OpenAndroidDatePickerParams {
  value: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onConfirm: (date: Date) => void;
}

export const openAndroidDatePicker = ({
  value,
  minimumDate,
  maximumDate,
  onConfirm,
}: OpenAndroidDatePickerParams) => {
  DateTimePickerAndroid.open({
    value,
    mode: 'date',
    display: 'default',
    is24Hour: true,
    minimumDate,
    maximumDate,
    onChange: (_event, selectedDate) => {
      if (selectedDate) {
        onConfirm(selectedDate);
      }
    },
  });
};
