import React, { useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  Animated, StyleSheet,
} from 'react-native';
import { colors, fonts, spacing, radius, shadows } from '../../theme/tokens';
import LEDIndicator from './LEDIndicator';

const USER_COLORS = ['green', 'cyan', 'amber', 'red', 'cyan'];

export default function PostCard({ post, onPress, index = 0 }) {
  const scaleAnim  = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.985, useNativeDriver: true, speed: 60 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  const ledColor = USER_COLORS[(post.userId - 1) % USER_COLORS.length] || 'green';
  const postNum  = String(post.id).padStart(4, '0');
  const dateStr  = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric',
  });

  const bodyPreview = post.body.length > 100
    ? post.body.substring(0, 100) + '…'
    : post.body;
  const likes = 40 + ((post.id * 13) % 160);
  const comments = 4 + ((post.id * 7) % 36);
  const username = `user_${String(post.userId).padStart(2, '0')}`;
  const isCompact = index % 2 === 1;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.card,
          shadows.card,
          isCompact ? styles.cardCompact : styles.cardRegular,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{username.slice(-2).toUpperCase()}</Text>
            </View>
            <View style={styles.userBlock}>
              <Text style={styles.username}>@{username}</Text>
              <Text style={styles.meta} numberOfLines={1}>#{postNum} • {dateStr}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <LEDIndicator color={ledColor} size={7} pulse />
            <Text style={styles.more}>•••</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={isCompact ? 2 : 3}>{post.title}</Text>
        <Text style={styles.body} numberOfLines={isCompact ? 3 : 4}>{bodyPreview}</Text>

        <View style={styles.actionRow}>
          <View style={styles.actionItem}>
            <Text style={styles.actionIcon}>♥</Text>
            <Text style={styles.actionText}>{likes}</Text>
          </View>
          <View style={styles.actionItem}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{comments}</Text>
          </View>
          <View style={styles.actionItem}>
            <Text style={styles.actionIcon}>↗</Text>
            <Text style={styles.actionText}>Share</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panelAlt,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg + 2,
    marginBottom: spacing.lg,
    gap: spacing.md,
    width: '100%',
  },
  cardRegular: {
    minHeight: 220,
  },
  cardCompact: {
    minHeight: 198,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  userBlock: {
    flex: 1,
    minWidth: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 6,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentGlow,
    borderWidth: 1,
    borderColor: colors.accentDim,
  },
  avatarText: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 12,
  },
  username: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 13,
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  more: {
    color: colors.textSecondary,
    fontSize: 16,
    letterSpacing: 1,
    marginTop: -3,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 21,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderDim,
    gap: spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  actionText: {
    fontFamily: fonts.bodyMed,
    color: colors.textSecondary,
    fontSize: 12,
  },
});
