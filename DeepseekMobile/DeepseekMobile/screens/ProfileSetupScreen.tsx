import { View, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '../components/ThemedText';
import { ScreenKeyboardAwareScrollView } from '../components/ScreenKeyboardAwareScrollView';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { Picker } from '@react-native-picker/picker';

interface ProfileSetupScreenProps {
  onComplete: () => void;
}

const classes = [
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'University',
  'Other',
];

const heardFrom = [
  'Social Media',
  'Friend or Family',
  'Search Engine',
  'School',
  'Advertisement',
  'Other',
];

export default function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const [fullName, setFullName] = useState('');
  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedHeardFrom, setSelectedHeardFrom] = useState(heardFrom[0]);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { updateUserProfile } = useAuth();

  const handleComplete = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        full_name: fullName,
        class: selectedClass,
        heard_from: selectedHeardFrom,
      });
      onComplete();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenKeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Complete Your Profile</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
          Help us personalize your learning experience
        </ThemedText>

        <View style={styles.form}>
          <View style={styles.field}>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>Class/Grade</ThemedText>
            <View
              style={[
                styles.pickerContainer,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <Picker
                selectedValue={selectedClass}
                onValueChange={(itemValue) => setSelectedClass(itemValue)}
                style={[styles.picker, { color: colors.text }]}
                enabled={!loading}
              >
                {classes.map((cls) => (
                  <Picker.Item key={cls} label={cls} value={cls} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <ThemedText style={styles.label}>How did you hear about us?</ThemedText>
            <View
              style={[
                styles.pickerContainer,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <Picker
                selectedValue={selectedHeardFrom}
                onValueChange={(itemValue) => setSelectedHeardFrom(itemValue)}
                style={[styles.picker, { color: colors.text }]}
                enabled={!loading}
              >
                {heardFrom.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed || loading ? 0.8 : 1,
            },
          ]}
          onPress={handleComplete}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Saving...' : 'Continue'}
          </ThemedText>
        </Pressable>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  form: {
    gap: Spacing['2xl'],
    marginBottom: Spacing['3xl'],
  },
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  picker: {
    height: Spacing.inputHeight,
  },
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
