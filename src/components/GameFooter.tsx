import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lightbulb, Hash, Search } from 'lucide-react-native';
import { useGameStore } from '../store/useGameStore';

export const GameFooter: React.FC = () => {
  const hintsAvailable = useGameStore((s) => s.hintsAvailable);
  const useHint = useGameStore((s) => s.useHint);
  const showGridDots = useGameStore((s) => s.showGridDots);
  const toggleGridDots = useGameStore((s) => s.toggleGridDots);
  const isLoupeActive = useGameStore((s) => s.isLoupeActive);
  const toggleLoupe = useGameStore((s) => s.toggleLoupe);

  return (
    <View style={styles.container}>
      {/* Hint Button with Badge */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.circleButton, hintsAvailable <= 0 && styles.buttonDisabled]}
          onPress={useHint}
          activeOpacity={0.75}
          disabled={hintsAvailable <= 0}
        >
          <Lightbulb
            size={28}
            color={hintsAvailable > 0 ? '#007AFF' : '#94A3B8'}
            strokeWidth={2}
          />
        </TouchableOpacity>
        {hintsAvailable > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{hintsAvailable}</Text>
          </View>
        )}
      </View>

      {/* Magnifier Loupe Toggle Button */}
      <TouchableOpacity
        style={[styles.circleButton, isLoupeActive && styles.buttonActive]}
        onPress={toggleLoupe}
        activeOpacity={0.75}
      >
        <Search
          size={24}
          color={isLoupeActive ? '#FFFFFF' : '#007AFF'}
          strokeWidth={2.2}
        />
      </TouchableOpacity>

      {/* Grid Dot Toggle Button */}
      <TouchableOpacity
        style={[styles.circleButton, !showGridDots && styles.buttonInactive]}
        onPress={toggleGridDots}
        activeOpacity={0.75}
      >
        <Hash
          size={28}
          color={showGridDots ? '#007AFF' : '#94A3B8'}
          strokeWidth={2.2}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 28,
    backgroundColor: '#FFFFFF',
  },
  buttonWrapper: {
    position: 'relative',
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});

