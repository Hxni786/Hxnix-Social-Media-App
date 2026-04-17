import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPostById } from '../services/postService';
import { colors, fonts, spacing, radius, shadows } from '../theme/tokens';
import CornerScrews from '../components/ui/CornerScrews';
import VentSlots from '../components/ui/VentSlots';
import LEDIndicator from '../components/ui/LEDIndicator';

const USER_COLORS = ['green', 'cyan', 'amber', 'red', 'cyan'];

export default function PostDetailScreen() {
  const { id }   = useLocalSearchParams();
  const router   = useRouter();
  const insets   = useSafeAreaInsets();

  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await getPostById(id);
        setPost(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPost();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <DetailHeader onBack={() => router.back()} loading />
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>FETCHING RECORD...</Text>
        </View>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.screen}>
        <DetailHeader onBack={() => router.back()} />
        <View style={styles.errorBox}>
          <LEDIndicator color="red" size={12} pulse />
          <Text style={styles.errorCode}>RECORD_NOT_FOUND</Text>
          <Text style={styles.errorMsg}>{error || `Post #${id} does not exist`}</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>← RETURN TO FEED</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const ledColor = USER_COLORS[(post.userId - 1) % USER_COLORS.length];
  const postNum  = String(post.id).padStart(4, '0');
  const dateStr  = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const timeStr  = new Date(post.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  return (
    <View style={styles.screen}>
      <DetailHeader onBack={() => router.back()} postId={postNum} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Main post panel */}
        <View style={[styles.postPanel, shadows.card]}>
          <CornerScrews offset={10} />

          {/* Top accent + vent row */}
          <View style={styles.panelTopBar}>
            <View style={styles.accentDot} />
            <VentSlots count={4} width={32} style={{ flexDirection: 'row', gap: 4 }} />
            <View style={[styles.accentDot, { backgroundColor: colors.accent2 }]} />
          </View>

          {/* Record ID strip */}
          <View style={styles.recordStrip}>
            <Text style={styles.recordLabel}>RECORD ID</Text>
            <Text style={styles.recordId}>#{postNum}</Text>
            <View style={styles.recordSep} />
            <LEDIndicator color={ledColor} size={8} pulse />
            <Text style={styles.recordStatus}>ACTIVE</Text>
          </View>

          {/* Title */}
          <Text style={styles.postTitle}>{post.title}</Text>

          {/* Metadata grid */}
          <View style={styles.metaGrid}>
            <MetaCell label="USER ID" value={`USR-${String(post.userId).padStart(3,'0')}`} accent={colors.accent2} />
            <MetaCell label="DATE"    value={dateStr.split(',')[0] + ',' + dateStr.split(',').slice(1).join(',')} accent={colors.textSecondary} small />
            <MetaCell label="TIME"    value={timeStr + ' UTC'} accent={colors.amber} />
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>TRANSMISSION BODY</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Full body */}
          <Text style={styles.postBody}>{post.body}</Text>

          {/* Bottom strip */}
          <View style={styles.bottomStrip}>
            <View style={styles.bottomLeft}>
              <Text style={styles.bottomLabel}>SIG</Text>
              <View style={styles.sigBars}>
                {[1,1,1,0].map((active, i) => (
                  <View
                    key={i}
                    style={[
                      styles.sigBar,
                      { height: 6 + i * 4, backgroundColor: active ? colors.accent2 : colors.border },
                    ]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.bottomCode}>
              {'HXN-' + String(post.id).padStart(6,'0')}
            </Text>
          </View>
        </View>

        {/* Back button */}
        <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
          <View style={styles.navBtnArrow}>
            <Text style={styles.navBtnArrowText}>←</Text>
          </View>
          <Text style={styles.navBtnText}>RETURN TO FEED</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function MetaCell({ label, value, accent, small }) {
  return (
    <View style={metaStyles.cell}>
      <Text style={metaStyles.label}>{label}</Text>
      <Text style={[metaStyles.value, { color: accent, fontSize: small ? 11 : 13 }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const metaStyles = StyleSheet.create({
  cell: {
    flex: 1,
    backgroundColor: colors.bgDeep,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 1,
    lineHeight: 16,
  },
});

function DetailHeader({ onBack, postId, loading }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[headerStyles.wrapper, { paddingTop: insets.top || 12 }]}>
      <View style={headerStyles.topBar} />
      <View style={headerStyles.inner}>
        <TouchableOpacity style={headerStyles.backBtn} onPress={onBack}>
          <Text style={headerStyles.backArrow}>←</Text>
          <Text style={headerStyles.backLabel}>FEED</Text>
        </TouchableOpacity>

        <View style={headerStyles.center}>
          <Text style={headerStyles.title}>HXNIX</Text>
          <Text style={headerStyles.subtitle}>
            {loading ? 'LOADING...' : postId ? `RECORD #${postId}` : 'DETAILS'}
          </Text>
        </View>

        <View style={headerStyles.rightSlot}>
          <LEDIndicator color={loading ? 'amber' : 'green'} size={6} pulse />
        </View>
      </View>
      <View style={headerStyles.bottomBorder} />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  wrapper: { backgroundColor: colors.bgDeep, borderBottomWidth: 1, borderBottomColor: colors.border },
  topBar:  { height: 2, backgroundColor: colors.accent2 },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.panel,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backArrow: { fontFamily: fonts.mono, fontSize: 14, color: colors.accent2 },
  backLabel: { fontFamily: fonts.mono, fontSize: 9, color: colors.textMuted, letterSpacing: 2 },
  center:    { alignItems: 'center' },
  title:     { fontFamily: fonts.display, fontSize: 14, color: colors.textPrimary, letterSpacing: 4 },
  subtitle:  { fontFamily: fonts.mono, fontSize: 8, color: colors.textMuted, letterSpacing: 2, marginTop: 1 },
  rightSlot: { width: 44, alignItems: 'flex-end' },
  bottomBorder: { height: 1, backgroundColor: colors.border, opacity: 0.5 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, letterSpacing: 3 },

  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  errorCode: { fontFamily: fonts.mono, fontSize: 10, color: colors.accent, letterSpacing: 3 },
  errorMsg:  { fontFamily: fonts.bodySB, fontSize: 15, color: colors.textPrimary, textAlign: 'center' },
  backBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accentGlow,
    borderWidth: 1, borderColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  backBtnText: { fontFamily: fonts.mono, fontSize: 11, color: colors.accent, letterSpacing: 3 },

  postPanel: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  panelTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  accentDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },

  recordStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bgDeep,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.lg,
  },
  recordLabel: { fontFamily: fonts.mono, fontSize: 8, color: colors.textMuted, letterSpacing: 2 },
  recordId:    { fontFamily: fonts.mono, fontSize: 13, color: colors.accent, letterSpacing: 1 },
  recordSep:   { width: 1, height: 14, backgroundColor: colors.border, marginHorizontal: 4 },
  recordStatus:{ fontFamily: fonts.mono, fontSize: 8, color: colors.green, letterSpacing: 2 },

  postTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: 0.5,
    lineHeight: 28,
    marginBottom: spacing.lg,
  },

  metaGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.lg,
  },
  dividerLine:  { flex: 1, height: 1, backgroundColor: colors.border },
  dividerLabel: { fontFamily: fonts.mono, fontSize: 8, color: colors.textMuted, letterSpacing: 3 },

  postBody: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: spacing.xl,
  },

  bottomStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderDim,
  },
  bottomLeft:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bottomLabel: { fontFamily: fonts.mono, fontSize: 8, color: colors.textMuted, letterSpacing: 2 },
  sigBars:     { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  sigBar:      { width: 4, borderRadius: 1 },
  bottomCode:  { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim, letterSpacing: 1 },

  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  navBtnArrow: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent2Glow,
    borderWidth: 1,
    borderColor: colors.accent2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnArrowText: { fontFamily: fonts.mono, fontSize: 14, color: colors.accent2 },
  navBtnText: {
    fontFamily: fonts.bodySB,
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
