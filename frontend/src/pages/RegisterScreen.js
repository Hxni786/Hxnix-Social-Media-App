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

export default function RegisterScreen({ onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();

  const handleRegister = async () => {
    if (!username) {
      setError('Identity ID required');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await register(username);
    
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
        colors={['#0d1117', '#161b22', '#21262d']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.headerBox}>
          <LEDIndicator color="cyan" size={12} pulse />
          <Text style={styles.title}>IDENTITY_INIT</Text>
          <Text style={styles.subtitle}>Register new operator on the Hxnix Neural Grid</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NEW_OPERATOR_ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Pick a unique Identity"
              placeholderTextColor={colors.textDim}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ ERROR: {error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>INITIALIZE_ACCOUNT</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onSwitchToLogin} style={styles.switchLink}>
            <Text style={styles.switchText}>Already have an identity? <Text style={styles.accentText}>LOG_IN</Text></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>GRID_REG_V2.1</Text>
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
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 16,
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 2,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    fontSize: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: fonts.mono,
    color: '#fff',
    fontSize: 12,
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
  },
  footerText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 2,
  },
});
