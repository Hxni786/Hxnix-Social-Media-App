import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';

const LED_COLORS = {
  green: { base: colors.green,   glow: colors.greenDim },
  red:   { base: colors.accent,  glow: colors.accentGlow },
  amber: { base: colors.amber,   glow: colors.amberDim },
  cyan:  { base: colors.accent2, glow: colors.accent2Glow },
  off:   { base: colors.border,  glow: 'transparent' },
};

export default function LEDIndicator({ color = 'green', size = 8, pulse = true }) {
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.3, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1,   duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const { base, glow } = LED_COLORS[color] || LED_COLORS.green;

  return (
    <View style={[styles.wrapper, { width: size * 2.5, height: size * 2.5, borderRadius: size * 1.25, backgroundColor: glow }]}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: base,
            opacity: anim,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  dot: {},
});
