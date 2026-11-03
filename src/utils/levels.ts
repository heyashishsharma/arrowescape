import { LevelData } from '../types/game';
import { LevelGenerator } from './levelGenerator';

/**
 * Handcrafted Level 1 (Tutorial)
 */
const level1: LevelData = {
  levelNumber: 1,
  name: 'Tutorial',
  difficulty: 'Easy',
  gridWidth: 7,
  gridHeight: 7,
  arrows: [
    {
      id: 'a1',
      segments: [{ x: 3, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 1 }],
      direction: 'UP',
      status: 'idle',
    },
    {
      id: 'a2',
      segments: [{ x: 2, y: 3 }, { x: 1, y: 3 }],
      direction: 'LEFT',
      status: 'idle',
    },
    {
      id: 'a3',
      segments: [{ x: 3, y: 4 }, { x: 3, y: 5 }],
      direction: 'DOWN',
      status: 'idle',
    },
    {
      id: 'a4',
      segments: [{ x: 4, y: 3 }, { x: 5, y: 3 }],
      direction: 'RIGHT',
      status: 'idle',
    },
    {
      id: 'a5',
      segments: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
      direction: 'DOWN',
      status: 'idle',
    },
    {
      id: 'a6',
      segments: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 4 }],
      direction: 'UP',
      status: 'idle',
    },
  ],
};

/**
 * Handcrafted Level 23 (From Reference Screenshot 1 & 4)
 * "Tap Away Arrows" - rectangular maze of multi-segment interlocking arrows
 */
const level23: LevelData = {
  levelNumber: 23,
  name: 'Level 23',
  difficulty: 'Normal',
  gridWidth: 10,
  gridHeight: 14,
  arrows: [
    // Top-left outer bracket pointing down
    {
      id: 'l23_1',
      segments: [{ x: 1, y: 12 }, { x: 1, y: 1 }, { x: 8, y: 1 }, { x: 8, y: 7 }],
      direction: 'DOWN',
      status: 'idle',
    },
    // Downwards left perimeter
    {
      id: 'l23_2',
      segments: [{ x: 2, y: 10 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 4 }],
      direction: 'DOWN',
      status: 'idle',
    },
    // Top right vertical arrow pointing UP
    {
      id: 'l23_3',
      segments: [{ x: 7, y: 7 }, { x: 7, y: 2 }],
      direction: 'UP',
      status: 'idle',
    },
    // Center horizontal free path (The one tapped in screenshot 1!)
    // Starts with a bend and shoots straight out to the RIGHT edge!
    {
      id: 'l23_free_blue',
      segments: [{ x: 3, y: 7 }, { x: 3, y: 8 }, { x: 9, y: 8 }],
      direction: 'RIGHT',
      status: 'idle',
    },
    // Top horizontal bar pointing RIGHT
    {
      id: 'l23_4',
      segments: [{ x: 4, y: 3 }, { x: 4, y: 2 }, { x: 6, y: 2 }],
      direction: 'RIGHT',
      status: 'idle',
    },
    // Middle horizontal pointing RIGHT
    {
      id: 'l23_5',
      segments: [{ x: 4, y: 4 }, { x: 6, y: 4 }],
      direction: 'RIGHT',
      status: 'idle',
    },
    // Middle U-loop pointing LEFT
    {
      id: 'l23_6',
      segments: [{ x: 6, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }, { x: 6, y: 5 }],
      direction: 'LEFT',
      status: 'idle',
    },
    // Right bottom hook pointing RIGHT
    {
      id: 'l23_7',
      segments: [{ x: 5, y: 10 }, { x: 5, y: 9 }, { x: 7, y: 9 }],
      direction: 'RIGHT',
      status: 'idle',
    },
    // Lower middle pointing LEFT
    {
      id: 'l23_8',
      segments: [{ x: 7, y: 11 }, { x: 5, y: 11 }],
      direction: 'LEFT',
      status: 'idle',
    },
    // Bottom left corner L-shape pointing DOWN
    {
      id: 'l23_9',
      segments: [{ x: 3, y: 9 }, { x: 3, y: 12 }],
      direction: 'DOWN',
      status: 'idle',
    },
    // Bottom border pointing UP
    {
      id: 'l23_10',
      segments: [{ x: 4, y: 12 }, { x: 4, y: 11 }],
      direction: 'UP',
      status: 'idle',
    },
    // Bottom right U-shape pointing UP
    {
      id: 'l23_11',
      segments: [{ x: 5, y: 13 }, { x: 7, y: 13 }, { x: 7, y: 12 }],
      direction: 'UP',
      status: 'idle',
    },
    // Left outer arrow pointing DOWN
    {
      id: 'l23_12',
      segments: [{ x: 1, y: 13 }, { x: 1, y: 14 }],
      direction: 'DOWN',
      status: 'idle',
    },
    // Far left outer boundary
    {
      id: 'l23_13',
      segments: [{ x: 2, y: 12 }, { x: 2, y: 3 }],
      direction: 'UP',
      status: 'idle',
    },
    // Right wall pointing DOWN
    {
      id: 'l23_14',
      segments: [{ x: 8, y: 9 }, { x: 8, y: 13 }],
      direction: 'DOWN',
      status: 'idle',
    },
  ],
};

/**
 * Level 42 - Heart Silhouette (From Reference Screenshot 2)
 */
export function generateHeartLevel(): LevelData {
  const heartMask = LevelGenerator.createHeartMask(14, 14);
  return LevelGenerator.generateSolvableLevel({
    levelNumber: 42,
    name: 'Level 42 - Heart',
    difficulty: 'Hard',
    gridWidth: 14,
    gridHeight: 14,
    mask: heartMask,
    targetArrowCount: 16,
  });
}

/**
 * Level 50 - Leaf Silhouette (From Reference Screenshot 3)
 */
export function generateLeafLevel(): LevelData {
  const leafMask = LevelGenerator.createLeafMask(13, 13);
  return LevelGenerator.generateSolvableLevel({
    levelNumber: 50,
    name: 'Level 50 - Leaf',
    difficulty: 'Hard',
    gridWidth: 13,
    gridHeight: 13,
    mask: leafMask,
    targetArrowCount: 16,
  });
}

export const PRESET_LEVELS: LevelData[] = [
  level1,
  LevelGenerator.generateSolvableLevel({
    levelNumber: 2,
    name: 'Level 2 - Crossroads',
    difficulty: 'Easy',
    gridWidth: 8,
    gridHeight: 8,
    targetArrowCount: 8,
  }),
  LevelGenerator.generateSolvableLevel({
    levelNumber: 3,
    name: 'Level 3 - Corner Box',
    difficulty: 'Easy',
    gridWidth: 8,
    gridHeight: 9,
    targetArrowCount: 10,
  }),
  LevelGenerator.generateSolvableLevel({
    levelNumber: 4,
    name: 'Level 4 - Weave',
    difficulty: 'Normal',
    gridWidth: 9,
    gridHeight: 10,
    targetArrowCount: 12,
  }),
  LevelGenerator.generateSolvableLevel({
    levelNumber: 5,
    name: 'Level 5 - Dual Spiral',
    difficulty: 'Normal',
    gridWidth: 9,
    gridHeight: 11,
    targetArrowCount: 14,
  }),
  LevelGenerator.generateSolvableLevel({
    levelNumber: 6,
    name: 'Level 6 - Traffic',
    difficulty: 'Normal',
    gridWidth: 10,
    gridHeight: 12,
    targetArrowCount: 15,
  }),
  level23,
  generateHeartLevel(),
  generateLeafLevel(),
];

