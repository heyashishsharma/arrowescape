import { create } from 'zustand';
import * as Haptics from 'expo-haptics';
import { Arrow, GameStatus, LevelData } from '../types/game';
import { isArrowFree, getFreeArrows } from '../utils/collision';
import { PRESET_LEVELS } from '../utils/levels';

interface GameState {
  currentLevelIndex: number;
  unlockedLevelIndex: number;
  completedLevels: number[];
  currentLevel: LevelData;
  arrows: Arrow[];
  remainingCount: number;
  lives: number;
  maxLives: number;
  hintsAvailable: number;
  showGridDots: boolean;
  isLoupeActive: boolean;
  loupePosition: { x: number; y: number } | null;
  gameStatus: GameStatus;
  lastTappedArrowId: string | null;

  // Actions
  startNewGame: () => void;
  loadLevel: (levelIndex: number) => void;
  nextLevel: () => void;
  restartLevel: () => void;
  tapArrow: (arrowId: string) => { success: boolean; freed: boolean };
  useHint: () => void;
  toggleGridDots: () => void;
  toggleLoupe: () => void;
  setLoupePosition: (pos: { x: number; y: number } | null) => void;
  revive: () => void;
}

const triggerHaptic = (type: 'success' | 'warning' | 'error') => {
  try {
    if (type === 'success') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (type === 'warning') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  } catch {
    // Graceful fallback for non-supported platforms (e.g. web browser)
  }
};

export const useGameStore = create<GameState>((set, get) => {
  const initialLevel = PRESET_LEVELS[0];
  const initialArrows = initialLevel.arrows.map((a) => ({ ...a, status: 'idle' as const }));

  return {
    currentLevelIndex: 0,
    unlockedLevelIndex: 1, // At least first 2 levels unlocked from the start
    completedLevels: [],
    currentLevel: initialLevel,
    arrows: initialArrows,
    remainingCount: initialArrows.length,
    lives: 3,
    maxLives: 3,
    hintsAvailable: 2,
    showGridDots: true,
    isLoupeActive: false,
    loupePosition: null,
    gameStatus: 'playing',
    lastTappedArrowId: null,

    startNewGame: () => {
      get().loadLevel(0);
    },

    loadLevel: (levelIndex: number) => {
      const idx = Math.max(0, Math.min(levelIndex, PRESET_LEVELS.length - 1));
      const level = PRESET_LEVELS[idx];
      const freshArrows = level.arrows.map((a) => ({ ...a, status: 'idle' as const, isHinted: false }));

      set({
        currentLevelIndex: idx,
        currentLevel: level,
        arrows: freshArrows,
        remainingCount: freshArrows.length,
        lives: 3,
        hintsAvailable: 2,
        gameStatus: 'playing',
        lastTappedArrowId: null,
        isLoupeActive: false,
      });
    },

    nextLevel: () => {
      const { currentLevelIndex, loadLevel } = get();
      loadLevel(currentLevelIndex + 1);
    },

    restartLevel: () => {
      const { currentLevelIndex, loadLevel } = get();
      loadLevel(currentLevelIndex);
    },

    tapArrow: (arrowId: string) => {
      const { arrows, currentLevel, lives, gameStatus } = get();
      if (gameStatus !== 'playing') return { success: false, freed: false };

      const target = arrows.find((a) => a.id === arrowId);
      if (!target || target.status === 'escaped' || target.status === 'escaping') {
        return { success: false, freed: false };
      }

      const free = isArrowFree(target, arrows, currentLevel.gridWidth, currentLevel.gridHeight);

      if (free) {
        triggerHaptic('success');
        // Mark arrow as escaping / escaped
        const updatedArrows = arrows.map((a) =>
          a.id === arrowId ? { ...a, status: 'escaped' as const, isHinted: false } : a
        );

        const newRemaining = updatedArrows.filter((a) => a.status !== 'escaped').length;
        const isWin = newRemaining === 0;

        if (isWin) {
          triggerHaptic('success');
          const { currentLevelIndex, unlockedLevelIndex, completedLevels } = get();
          const nextUnlocked = Math.max(unlockedLevelIndex, currentLevelIndex + 1);
          const updatedCompleted = completedLevels.includes(currentLevelIndex)
            ? completedLevels
            : [...completedLevels, currentLevelIndex];

          set({
            arrows: updatedArrows,
            remainingCount: 0,
            gameStatus: 'completed',
            lastTappedArrowId: arrowId,
            unlockedLevelIndex: nextUnlocked,
            completedLevels: updatedCompleted,
          });
        } else {
          set({
            arrows: updatedArrows,
            remainingCount: newRemaining,
            gameStatus: 'playing',
            lastTappedArrowId: arrowId,
          });
        }

        return { success: true, freed: true };
      } else {
        triggerHaptic('error');
        // Penalty: bump, flash red and deduct 1 heart life
        const updatedArrows = arrows.map((a) =>
          a.id === arrowId ? { ...a, status: 'blocked' as const } : a
        );

        const newLives = Math.max(0, lives - 1);
        const isGameOver = newLives <= 0;

        set({
          arrows: updatedArrows,
          lives: newLives,
          gameStatus: isGameOver ? 'game_over' : 'playing',
          lastTappedArrowId: arrowId,
        });

        // Reset blocked visual status after 400ms
        setTimeout(() => {
          set((state) => ({
            arrows: state.arrows.map((a) =>
              a.id === arrowId && a.status === 'blocked' ? { ...a, status: 'idle' as const } : a
            ),
          }));
        }, 450);

        return { success: true, freed: false };
      }
    },

    useHint: () => {
      const { arrows, currentLevel, hintsAvailable, gameStatus } = get();
      if (gameStatus !== 'playing' || hintsAvailable <= 0) return;

      const freeArrows = getFreeArrows(arrows, currentLevel.gridWidth, currentLevel.gridHeight);
      if (freeArrows.length === 0) return;

      const hintTarget = freeArrows[0];
      triggerHaptic('warning');

      set({
        hintsAvailable: hintsAvailable - 1,
        arrows: arrows.map((a) =>
          a.id === hintTarget.id ? { ...a, isHinted: true } : { ...a, isHinted: false }
        ),
      });
    },

    toggleGridDots: () => {
      triggerHaptic('success');
      set((state) => ({ showGridDots: !state.showGridDots }));
    },

    toggleLoupe: () => {
      triggerHaptic('success');
      set((state) => ({ isLoupeActive: !state.isLoupeActive }));
    },

    setLoupePosition: (pos) => {
      set({ loupePosition: pos });
    },

    revive: () => {
      set({ lives: 3, gameStatus: 'playing' });
    },
  };
});

