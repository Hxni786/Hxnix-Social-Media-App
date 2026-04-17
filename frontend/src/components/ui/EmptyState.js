import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../../theme/tokens';
import IndustrialButton from './IndustrialButton';

export default function EmptyState({ onRetry }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.iconBox}>
        <View style={styles.iconInner}>
          <Text style={styles.iconText}>⚠</Text>
        </View>
      </View>
      <Text style={styles.code}>ERR_FEED_EMPTY</Text>
      <Text style={styles.title}>No Signal Detected</Text>
      <Text style={styles.body}>
        The data stream returned no records.{'\n'}
        Check your backend connection and retry.
      </Text>
      {onRetry && (
        <IndustrialButton
          label="Retry Connection"
          onPress={onRetry}
          variant="accent"
          style={{ marginTop: spacing.xl }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    paddingTop: 80,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconInner: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.accentGlow,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 26,
    color: colors.accent,
  },
  code: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.accent,
    letterSpacing: 3,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.textPrimary,
    letterSpacing: 2,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
