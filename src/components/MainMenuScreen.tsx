import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Play,
  RotateCcw,
  LayoutGrid,
  Settings,
  Sparkles,
  Trophy,
  Navigation,
  ChevronRight,
} from 'lucide-react-native';
import { useGameStore } from '../store/useGameStore';
import { SafeAreaWrapper } from './SafeAreaWrapper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
}

export const MainMenuScreen: React.FC<Props> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenSettings,
}) => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const startNewGame = useGameStore((s) => s.startNewGame);

  const handleNewGame = () => {
    startNewGame();
    onStartGame();
  };

  const handleContinue = () => {
    onStartGame();
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <View style={styles.brandIconBox}>
            <Navigation size={20} color="#FFFFFF" fill="#FFFFFF" style={{ transform: [{ rotate: '45deg' }] }} />
          </View>
          <View>
            <Text style={styles.brandTitle}>ARROW ESCAPE</Text>
            <Text style={styles.brandSubtitle}>Tap Away Puzzle</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onOpenSettings}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Settings size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Hero Visual Card */}
      <View style={styles.heroCard}>
        {/* Decorative Compass Elements */}
        <View style={styles.decorativeBadge}>
          <Sparkles size={16} color="#007AFF" />
          <Text style={styles.decorativeBadgeText}>
            {currentLevel.difficulty} Difficulty
          </Text>
        </View>

        <Text style={styles.heroLevelTitle}>
          {currentLevel.name || `Level ${currentLevel.levelNumber}`}
        </Text>
        <Text style={styles.heroDescription}>
          {currentLevel.arrows.length} interlocking arrows ready to be untangled.
        </Text>

        {/* Visual Maze Preview Graphic */}
        <View style={styles.mazeGraphic}>
          <View style={[styles.arrowPill, { backgroundColor: '#007AFF', top: 20, left: 30 }]}>
            <Navigation size={14} color="#FFF" style={{ transform: [{ rotate: '0deg' }] }} />
          </View>
          <View style={[styles.arrowPill, { backgroundColor: '#34C759', top: 35, right: 35 }]}>
            <Navigation size={14} color="#FFF" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
          <View style={[styles.arrowPill, { backgroundColor: '#FF9500', bottom: 25, right: 55 }]}>
            <Navigation size={14} color="#FFF" style={{ transform: [{ rotate: '180deg' }] }} />
          </View>
          <View style={[styles.arrowPill, { backgroundColor: '#AF52DE', bottom: 20, left: 45 }]}>
            <Navigation size={14} color="#FFF" style={{ transform: [{ rotate: '270deg' }] }} />
          </View>
          <View style={styles.centerNode}>
            <Text style={styles.centerNodeText}>{currentLevel.levelNumber}</Text>
          </View>
        </View>

        {/* Progress / Stats Footer in Card */}
        <View style={styles.cardStatsRow}>
          <View style={styles.statItem}>
            <Trophy size={16} color="#F59E0B" />
            <Text style={styles.statValue}>{completedLevels.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Navigation size={16} color="#007AFF" />
            <Text style={styles.statValue}>{currentLevel.arrows.length}</Text>
            <Text style={styles.statLabel}>Arrows</Text>
          </View>
        </View>
      </View>

      {/* Main Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Continue / Play Current Level */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <View style={styles.buttonIconCircle}>
            <Play size={20} color="#007AFF" fill="#007AFF" style={{ marginLeft: 2 }} />
          </View>
          <View style={styles.buttonTextWrapper}>
            <Text style={styles.primaryButtonTitle}>
              {currentLevelIndex === 0 ? 'START GAME' : 'CONTINUE'}
            </Text>
            <Text style={styles.primaryButtonSubtitle}>
              {currentLevel.name || `Level ${currentLevel.levelNumber}`}
            </Text>
          </View>
          <ChevronRight size={22} color="#FFFFFF" opacity={0.8} />
        </TouchableOpacity>

        {/* New Game Button */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleNewGame}
          activeOpacity={0.75}
        >
          <RotateCcw size={20} color="#0F172A" />
          <Text style={styles.secondaryButtonText}>New Game</Text>
        </TouchableOpacity>

        {/* Select Level Button */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onOpenLevelSelect}
          activeOpacity={0.75}
        >
          <LayoutGrid size={20} color="#0F172A" />
          <Text style={styles.secondaryButtonText}>Select Level</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          Tip: Tap arrows pointing outward with clear escape routes first!
        </Text>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    marginVertical: 12,
  },
  decorativeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  decorativeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  heroLevelTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  heroDescription: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  mazeGraphic: {
    width: 170,
    height: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  arrowPill: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  centerNode: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerNodeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  buttonTextWrapper: {
    flex: 1,
  },
  primaryButtonTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  primaryButtonSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
  },
});

