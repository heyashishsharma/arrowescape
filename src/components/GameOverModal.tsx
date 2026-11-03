import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { HeartCrack, RotateCcw, Sparkles, Home } from 'lucide-react-native';
import { useGameStore } from '../store/useGameStore';

interface Props {
  onGoHome?: () => void;
}

export const GameOverModal: React.FC<Props> = ({ onGoHome }) => {
  const gameStatus = useGameStore((s) => s.gameStatus);
  const restartLevel = useGameStore((s) => s.restartLevel);
  const revive = useGameStore((s) => s.revive);

  const isVisible = gameStatus === 'game_over';
  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <HeartCrack size={42} color="#EF4444" strokeWidth={2.2} />
          </View>

          <Text style={styles.title}>Out of Lives!</Text>
          <Text style={styles.subtitle}>
            You bumped into blocked arrows 3 times. Rethink your path and try again!
          </Text>

          <TouchableOpacity
            style={styles.reviveButton}
            onPress={revive}
            activeOpacity={0.8}
          >
            <Sparkles size={20} color="#FFFFFF" />
            <Text style={styles.reviveButtonText}>Revive (+3 Hearts)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={restartLevel}
            activeOpacity={0.7}
          >
            <RotateCcw size={18} color="#475569" />
            <Text style={styles.retryButtonText}>Restart Level</Text>
          </TouchableOpacity>

          {onGoHome && (
            <TouchableOpacity
              style={styles.homeButton}
              onPress={onGoHome}
              activeOpacity={0.7}
            >
              <Text style={styles.homeButtonText}>Return to Main Menu</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  reviveButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  reviveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  retryButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
  },
  homeButton: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});

