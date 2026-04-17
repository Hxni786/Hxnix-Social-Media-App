import React, { useRef } from 'react';
import { TouchableOpacity, Text, View, Animated, StyleSheet } from 'react-native';
import { colors, fonts, radius, spacing } from '../../theme/tokens';

export default function IndustrialButton({
  label,
  onPress,
  variant = 'default',  // 'default' | 'accent' | 'ghost' | 'danger'
  icon,
  disabled = false,
  style,
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  const variantStyles = {
    default: { bg: colors.surface, border: colors.border, text: colors.textSecondary },
    accent:  { bg: colors.accentGlow, border: colors.accent, text: colors.accent },
    ghost:   { bg: 'transparent', border: colors.border, text: colors.textMuted },
    danger:  { bg: 'rgba(255,45,74,0.1)', border: colors.accent, text: colors.accent },
    cyan:    { bg: colors.accent2Glow, border: colors.accent2, text: colors.accent2 },
  };

  const vs = variantStyles[variant] || variantStyles.default;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.btn,
          {
            backgroundColor: vs.bg,
            borderColor: vs.border,
            opacity: disabled ? 0.4 : 1,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text style={[styles.label, { color: vs.text, fontFamily: fonts.bodySB }]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 8,
  },
  iconWrap: { marginRight: 4 },
  label: { fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' },
});
