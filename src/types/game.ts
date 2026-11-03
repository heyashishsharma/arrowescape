export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GridPoint {
  x: number;
  y: number;
}

export type ArrowStatus = 'idle' | 'escaping' | 'escaped' | 'blocked';

export interface Arrow {
  id: string;
  // Ordered sequence of grid points from tail to head
  // e.g. [(2,4), (2,3), (3,3), (4,3)] where (4,3) is the head
  segments: GridPoint[];
  direction: Direction;
  status: ArrowStatus;
  isHinted?: boolean;
}

export type Difficulty = 'Easy' | 'Normal' | 'Hard';

export interface LevelData {
  levelNumber: number;
  name: string;
  difficulty: Difficulty;
  gridWidth: number;
  gridHeight: number;
  // Optional silhouette mask coordinates that define active board area
  shapeMask?: GridPoint[];
  arrows: Arrow[];
}

export type GameStatus = 'playing' | 'completed' | 'game_over';

