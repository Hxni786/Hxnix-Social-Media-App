import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, spacing, radius } from '../theme/tokens';
import LEDIndicator from '../components/ui/LEDIndicator';

export default function LoginScreen({ onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Enter any Operator ID and Access Key');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(username, password);
    
    if (!result.success) {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#090c15', '#0e1220', '#13172a']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.headerBox}>
          <LEDIndicator color="red" size={12} pulse />
          <Text style={styles.title}>HXNIX_AUTH</Text>
          <Text style={styles.subtitle}>Enter any credentials to access the grid</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>OPERATOR_ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter any name"
              placeholderTextColor={colors.textDim}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ACCESS_KEY</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter any password"
              placeholderTextColor={colors.textDim}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>✗ {error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>ESTABLISH CONNECTION</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onSwitchToRegister} style={styles.switchLink}>
            <Text style={styles.switchText}>New operator? <Text style={styles.accentText}>CREATE_IDENTITY</Text></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SECURE TERMINAL V1.0.4</Text>
          <Text style={styles.footerSubText}>Encrypted via HX-256 Protocol</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    padding: spacing.xxl,
    justifyContent: 'center',
    gap: 40,
  },
  headerBox: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.textPrimary,
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 1,
    opacity: 0.8,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.accent,
    letterSpacing: 2,
  },
  input: {
    backgroundColor: '#161b2e',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    color: colors.textPrimary,
    fontFamily: fonts.body,
  },
  errorBox: {
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 45, 74, 0.1)',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  errorText: {
    fontFamily: fonts.mono,
    color: colors.accent,
    fontSize: 11,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: fonts.mono,
    color: '#fff',
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: '700',
  },
  switchLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  switchText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
  },
  accentText: {
    color: colors.accent,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 2,
  },
  footerSubText: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.textDim,
  },
});
