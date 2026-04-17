import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';

export default function VentSlots({ count = 3, width = 36, style }) {
  return (
    <View style={[styles.wrapper, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.slot, { width }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 3 },
  slot: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
});
