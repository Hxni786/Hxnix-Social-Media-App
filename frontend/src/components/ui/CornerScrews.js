import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';

function Screw({ style }) {
  return (
    <View style={[styles.screw, style]}>
      <View style={styles.slotH} />
      <View style={styles.slotV} />
    </View>
  );
}

export default function CornerScrews({ offset = 10 }) {
  return (
    <>
      <Screw style={{ top: offset, left: offset }} />
      <Screw style={{ top: offset, right: offset }} />
      <Screw style={{ bottom: offset, left: offset }} />
      <Screw style={{ bottom: offset, right: offset }} />
    </>
  );
}

const styles = StyleSheet.create({
  screw: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotH: {
    position: 'absolute',
    width: 5,
    height: 1.5,
    backgroundColor: colors.textDim,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  slotV: {
    position: 'absolute',
    width: 5,
    height: 1.5,
    backgroundColor: colors.textDim,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
});
