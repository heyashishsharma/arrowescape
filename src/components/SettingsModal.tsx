import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X, Play, RotateCcw } from 'lucide-react-native';
import { useGameStore } from '../store/useGameStore';
import { PRESET_LEVELS } from '../utils/levels';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ visible, onClose }) => {
  const currentLevelIndex = useGameStore((s) => s.currentLevelIndex);
  const loadLevel = useGameStore((s) => s.loadLevel);
  const restartLevel = useGameStore((s) => s.restartLevel);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Game Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Level Selector */}
          <Text style={styles.sectionTitle}>Select Level</Text>
          <View style={styles.levelList}>
            {PRESET_LEVELS.map((lvl, idx) => {
              const isSelected = idx === currentLevelIndex;
              return (
                <TouchableOpacity
                  key={`lvl_btn_${idx}`}
                  style={[styles.levelItem, isSelected && styles.levelItemActive]}
                  onPress={() => {
                    loadLevel(idx);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.levelItemText, isSelected && styles.levelItemTextActive]}>
                    {lvl.name || `Level ${lvl.levelNumber}`} ({lvl.difficulty})
                  </Text>
                  {isSelected && <Play size={16} color="#FFFFFF" fill="#FFFFFF" />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Quick Restart */}
          <TouchableOpacity
            style={styles.restartBtn}
            onPress={() => {
              restartLevel();
              onClose();
            }}
            activeOpacity={0.7}
          >
            <RotateCcw size={18} color="#007AFF" />
            <Text style={styles.restartBtnText}>Restart Current Board</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  levelList: {
    gap: 8,
    marginBottom: 20,
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  levelItemActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  levelItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  levelItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
  },
  restartBtnText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

