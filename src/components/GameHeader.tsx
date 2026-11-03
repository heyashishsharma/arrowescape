import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, Settings, Heart, Navigation } from 'lucide-react-native';
import { useGameStore } from '../store/useGameStore';

interface Props {
  onOpenSettings?: () => void;
  onGoBack?: () => void;
}

export const GameHeader: React.FC<Props> = ({ onOpenSettings, onGoBack }) => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const remainingCount = useGameStore((s) => s.remainingCount);
  const lives = useGameStore((s) => s.lives);
  const maxLives = useGameStore((s) => s.maxLives);

  return (
    <View style={styles.container}>
      {/* Top Title Bar */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onGoBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={28} color="#007AFF" strokeWidth={2.5} />
        </TouchableOpacity>

        <Text style={styles.levelTitle}>{currentLevel.name || `Level ${currentLevel.levelNumber}`}</Text>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onOpenSettings}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Settings size={24} color="#007AFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Stats / Status Pill Row */}
      <View style={styles.statusRow}>
        {/* Remaining Arrows Count Pill */}
        <View style={styles.pillBadge}>
          <Navigation size={15} color="#0F172A" style={{ transform: [{ rotate: '45deg' }] }} />
          <Text style={styles.pillText}>{remainingCount}</Text>
        </View>

        {/* 3 Heart Lives */}
        <View style={styles.heartsRow}>
          {Array.from({ length: maxLives }).map((_, index) => {
            const hasLife = index < lives;
            return (
              <Heart
                key={index}
                size={24}
                color={hasLife ? '#FF2D55' : '#E2E8F0'}
                fill={hasLife ? '#FF2D55' : '#E2E8F0'}
                style={styles.heartIcon}
              />
            );
          })}
        </View>

        {/* Difficulty Badge */}
        <View style={styles.pillBadge}>
          <Text style={styles.difficultyText}>{currentLevel.difficulty}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    minWidth: 64,
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  heartsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heartIcon: {
    marginHorizontal: 1,
  },
});

