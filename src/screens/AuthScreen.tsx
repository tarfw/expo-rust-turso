import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Notion-like minimal color palette
const Colors = {
  background: '#FFFFFF',
  primary: '#000000',
  text: '#000000',
  textSecondary: '#6B6B6B',
  textTertiary: '#9B9B9B',
  border: '#E3E3E3',
  borderFocus: '#000000',
  error: '#FF3B30',
  divider: '#F0F0F0',
};

export function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const handleSubmit = useCallback(async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, isSignUp, signIn, signUp]);

  const toggleMode = useCallback(() => {
    setIsSignUp((prev) => !prev);
    setError(null);
    setEmail('');
    setPassword('');
  }, []);

  const isFormValid = email.length > 0 && password.length >= 6;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{isSignUp ? 'Create account' : 'Sign in'}</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Start organizing your tasks' : 'Welcome back to your tasks'}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'email' && styles.inputFocused,
              ]}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'password' && styles.inputFocused,
              ]}
              placeholder="Enter your password"
              placeholderTextColor={Colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Create account' : 'Continue'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Toggle */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleMode}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <Text style={styles.toggleTextBold}>
              {isSignUp ? ' Sign in' : ' Create account'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 32,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: Platform.OS === 'ios' ? 50 : 32,
  },
  // Header
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  // Form
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  errorBox: {
    backgroundColor: Colors.error + '10',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '400',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '400',
  },
  inputFocused: {
    borderColor: Colors.borderFocus,
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: Colors.textTertiary,
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginHorizontal: 16,
    fontWeight: '400',
  },
  // Toggle
  toggleButton: {
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  toggleTextBold: {
    color: Colors.text,
    fontWeight: '500',
  },
});
