import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getPosts } from '../services/postService';
import { colors, fonts, spacing, radius } from '../theme/tokens';
import AppHeader from '../components/layout/AppHeader';
import PostCard from '../components/ui/PostCard';
import FeedSkeleton from '../components/ui/FeedSkeleton';
import EmptyState from '../components/ui/EmptyState';
import LEDIndicator from '../components/ui/LEDIndicator';

const STORY_LABELS = ['You', 'Maya', 'Rohan', 'Ira', 'Zain', 'Alex'];
const GRID_GAP = 10;

export default function FeedScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();

  const [posts,     setPosts]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [error,     setError]     = useState(null);

  const fetchPosts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else           setLoading(true);
      setError(null);
      const res = await getPosts();
      setPosts(res.data || []);
    } catch (err) {
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, []);

  const handlePostPress = (post) => {
    router.push(`/post/${post.id}`);
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.gridItem, index % 2 === 0 ? styles.gridLeft : styles.gridRight]}>
      <PostCard
        post={item}
        index={index}
        onPress={() => handlePostPress(item)}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.feedHeader}>
      <LinearGradient
        colors={['#202744', '#171c30', '#121624']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.statsBar}>
          <View style={styles.statChip}>
            <LEDIndicator color="green" size={6} pulse />
            <Text style={styles.statLabel}>LIVE FEED</Text>
          </View>
          <Text style={styles.statTime}>{new Date().toLocaleTimeString('en-US', { hour12: false })}</Text>
        </View>

        <Text style={styles.heroTitle}>Discover what your network is sharing</Text>
        <Text style={styles.heroSubTitle}>
          {posts.length} posts loaded • swipe to explore • tap a card for details
        </Text>
      </LinearGradient>

      <View style={styles.storyBlock}>
        <Text style={styles.sectionLabel}>Stories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyRow}
        >
          {STORY_LABELS.map((name, i) => (
            <TouchableOpacity key={name} activeOpacity={0.85} style={styles.storyItem}>
              <LinearGradient
                colors={i === 0 ? ['#ff5c8d', '#ff2d4a'] : ['#2d3658', '#1b2034']}
                style={styles.storyRing}
              >
                <View style={styles.storyAvatar}>
                  <Text style={styles.storyInitial}>{name.slice(0, 1)}</Text>
                </View>
              </LinearGradient>
              <Text style={styles.storyName}>{name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickPill} activeOpacity={0.8}>
          <Text style={styles.quickPillText}>Trending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickPill} activeOpacity={0.8}>
          <Text style={styles.quickPillText}>Creators</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickPill} activeOpacity={0.8}>
          <Text style={styles.quickPillText}>Following</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const feedList = (
    <FlatList
      key="feed-grid-2"
      data={posts}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={<EmptyState onRetry={() => fetchPosts()} />}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: insets.bottom + 92 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchPosts(true)}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#090c15', '#0e1220', '#13172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <AppHeader subtitle="SOCIAL FEED" />

      {loading ? (
        <View style={styles.scrollPad}>
          {renderHeader()}
          <FeedSkeleton />
        </View>
      ) : error ? (
        <View style={styles.screen}>
          {renderHeader()}
          <View style={styles.errorBox}>
            <LEDIndicator color="red" size={10} pulse />
            <Text style={styles.errorCode}>CONNECTION_ERROR</Text>
            <Text style={styles.errorMsg}>{error}</Text>
            <Text style={styles.errorHint}>
              Ensure your backend is running on port 5000{'\n'}
              and update src/config.js with your machine's IP
            </Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => fetchPosts()}>
              <Text style={styles.retryText}>↺  RETRY</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        feedList
      )}

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        activeOpacity={0.85}
      >
        <Text style={styles.fabPlus}>＋</Text>
        <Text style={styles.fabText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollPad: {
    padding: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  feedHeader: {
    marginBottom: spacing.lg,
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  heroCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    color: colors.green,
    letterSpacing: 1,
  },
  statTime: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
  },
  heroTitle: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 25,
  },
  heroSubTitle: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 14,
  },
  storyBlock: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontFamily: fonts.bodySB,
    color: colors.textPrimary,
    fontSize: 15,
  },
  storyRow: {
    paddingRight: spacing.lg,
    gap: spacing.sm,
  },
  storyItem: {
    width: 72,
    alignItems: 'center',
    gap: 6,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1322',
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyInitial: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 18,
  },
  storyName: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  quickPill: {
    backgroundColor: '#1a2034',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  quickPillText: {
    fontFamily: fonts.bodyMed,
    color: colors.textSecondary,
    fontSize: 12,
  },
  gridRow: {
    justifyContent: 'space-between',
    gap: GRID_GAP,
  },
  gridItem: {
    flex: 1,
  },
  gridLeft: {
    marginRight: GRID_GAP / 2,
  },
  gridRight: {
    marginLeft: GRID_GAP / 2,
  },
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: 12,
  },
  errorCode: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.accent,
    letterSpacing: 3,
  },
  errorMsg: {
    fontFamily: fonts.bodySB,
    fontSize: 15,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  errorHint: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  retryBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.accentGlow,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.accent,
    letterSpacing: 3,
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: colors.accent,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ff7a92',
  },
  fabPlus: {
    color: '#fff',
    fontSize: 18,
    marginTop: -2,
  },
  fabText: {
    color: '#fff',
    fontFamily: fonts.bodySB,
    fontSize: 14,
  },
});
