import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../theme/tokens';

function SkeletonBlock({ width, height, style }) {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, opacity: opacityAnim },
        style,
      ]}
    />
  );
}

export default function FeedSkeleton() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.card}>
          <View style={styles.header}>
            <SkeletonBlock width={60} height={10} />
            <SkeletonBlock width={30} height={10} />
          </View>
          <View style={styles.divider} />
          <SkeletonBlock width="90%" height={16} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="70%" height={16} style={{ marginBottom: 12 }} />
          <SkeletonBlock width="100%" height={12} style={{ marginBottom: 6 }} />
          <SkeletonBlock width="85%" height={12} style={{ marginBottom: 16 }} />
          <View style={styles.footer}>
            <SkeletonBlock width={70} height={24} style={{ borderRadius: radius.sm }} />
            <SkeletonBlock width={60} height={24} style={{ borderRadius: radius.sm }} />
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderDim,
  },
  block: {
    backgroundColor: colors.surface,
    borderRadius: 4,
  },
});
