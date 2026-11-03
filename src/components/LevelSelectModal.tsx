import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { X, Lock, CheckCircle2, Navigation, Play, Sparkles } from 'lucide-react-native';
import { useGameStore } from '../store/useGameStore';
import { PRESET_LEVELS } from '../utils/levels';
import { STATUS_BAR_HEIGHT } from './SafeAreaWrapper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  onStartLevel: () => void;
}

export const LevelSelectModal: React.FC<Props> = ({
  visible,
  onClose,
  onStartLevel,
}) => {
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const unlockedLevelIndex = useGameStore((s) => s.unlockedLevelIndex);
  const completedLevels = useGameStore((s) => s.completedLevels);
  const loadLevel = useGameStore((s) => s.loadLevel);

  if (!visible) return null;

  const handleSelectLevel = (index: number) => {
    // Allow selecting any unlocked level (or unlock all in development/sandbox mode)
    const isUnlocked = index <= unlockedLevelIndex;
    if (!isUnlocked) return;

    loadLevel(index);
    onClose();
    onStartLevel();
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return '#34C759';
      case 'Normal':
        return '#007AFF';
      case 'Hard':
        return '#FF9500';
      default:
        return '#5856D6';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { paddingTop: STATUS_BAR_HEIGHT + 12 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Select Level</Text>
            <Text style={styles.subtitle}>
              {completedLevels.length} of {PRESET_LEVELS.length} puzzles completed
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <X size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* Levels Grid List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {PRESET_LEVELS.map((lvl, index) => {
              const isCurrent = index === currentLevelIndex;
              const isUnlocked = index <= unlockedLevelIndex;
              const isCompleted = completedLevels.includes(index);
              const diffColor = getDifficultyColor(lvl.difficulty);

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.levelCard,
                    isCurrent && styles.currentCard,
                    !isUnlocked && styles.lockedCard,
                  ]}
                  activeOpacity={isUnlocked ? 0.75 : 1}
                  onPress={() => handleSelectLevel(index)}
                  disabled={!isUnlocked}
                >
                  {/* Top Status Indicators */}
                  <View style={styles.cardHeader}>
                    <View
                      style={[
                        styles.diffPill,
                        { backgroundColor: isUnlocked ? `${diffColor}18` : '#F1F5F9' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.diffText,
                          { color: isUnlocked ? diffColor : '#94A3B8' },
                        ]}
                      >
                        {lvl.difficulty}
                      </Text>
                    </View>

                    {isCompleted ? (
                      <CheckCircle2 size={18} color="#34C759" />
                    ) : !isUnlocked ? (
                      <Lock size={16} color="#94A3B8" />
                    ) : isCurrent ? (
                      <Sparkles size={16} color="#007AFF" />
                    ) : null}
                  </View>

                  {/* Level Number & Name */}
                  <View style={styles.cardCenter}>
                    <Text
                      style={[
                        styles.levelNumberText,
                        !isUnlocked && styles.lockedText,
                      ]}
                    >
                      {lvl.levelNumber}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.levelNameText,
                        !isUnlocked && styles.lockedText,
                      ]}
                    >
                      {lvl.name}
                    </Text>
                  </View>

                  {/* Arrow count footer */}
                  <View style={styles.cardFooter}>
                    <Navigation
                      size={12}
                      color={isUnlocked ? '#64748B' : '#CBD5E1'}
                      style={{ transform: [{ rotate: '45deg' }] }}
                    />
                    <Text
                      style={[
                        styles.arrowCountText,
                        !isUnlocked && styles.lockedText,
                      ]}
                    >
                      {lvl.arrows.length} arrows
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  levelCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  currentCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#F0F7FF',
  },
  lockedCard: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.65,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  diffPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  diffText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardCenter: {
    marginVertical: 4,
  },
  levelNumberText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  levelNameText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  arrowCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  lockedText: {
    color: '#94A3B8',
  },
});

