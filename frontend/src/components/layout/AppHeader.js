import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../../theme/tokens';
import LEDIndicator from '../ui/LEDIndicator';
import { useAuth } from '../../context/AuthContext';

export default function AppHeader({ title = 'HXNIX', subtitle, rightSlot }) {
  const insets = useSafeAreaInsets();
  const scanAnim = useRef(new Animated.Value(0)).current;
  const { logout } = useAuth();

  useEffect(() => {
    Animated.loop(
      Animated.timing(scanAnim, { toValue: 1, duration: 4000, useNativeDriver: false })
    ).start();
  }, []);

  const scanLeft = scanAnim.interpolate({ inputRange: [0, 1], outputRange: ['-10%', '110%'] });

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top || 12 }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDeep} />

      {/* Animated scan line */}
      <Animated.View style={[styles.scanLine, { left: scanLeft }]} />

      {/* Top accent bar */}
      <View style={styles.topBar} />

      <View style={styles.inner}>
        {/* Left — Logo + Title */}
        <View style={styles.left}>
          <View style={styles.logoBox}>
            <View style={styles.hexShape} />
            <View style={styles.hexInner} />
          </View>
          <View>
            <Text style={styles.brandName}>{title}</Text>
            {subtitle ? (
              <Text style={styles.subtitle}>{subtitle}</Text>
            ) : null}
          </View>
        </View>

        {/* Right — Status indicators + Logout button */}
        {rightSlot ? rightSlot : (
          <View style={styles.statusRow}>
            <TouchableOpacity 
              style={[styles.statusChip, { borderColor: colors.accentDim }]} 
              onPress={logout}
              activeOpacity={0.7}
            >
              <Text style={[styles.statusText, { color: colors.accent }]}>LOGOUT</Text>
            </TouchableOpacity>
            <View style={styles.statusChip}>
              <LEDIndicator color="green" size={6} pulse />
              <Text style={styles.statusText}>READY</Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom border */}
      <View style={styles.bottomBorder} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.bgDeep,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  topBar: {
    height: 2,
    backgroundColor: colors.accent,
    opacity: 0.9,
  },
  scanLine: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: '30%',
    backgroundColor: 'rgba(0,212,255,0.04)',
    transform: [{ skewX: '-20deg' }],
    zIndex: 0,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    zIndex: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 36,
    height: 36,
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hexShape: {
    width: 16,
    height: 16,
    backgroundColor: colors.accent,
    // React Native doesn't support clip-path, so we simulate with a rotated square
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
    opacity: 0.9,
  },
  hexInner: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: colors.bgDeep,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  brandName: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: 3,
    lineHeight: 24,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1.4,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.panel,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 2,
  },
  bottomBorder: {
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.5,
  },
});
