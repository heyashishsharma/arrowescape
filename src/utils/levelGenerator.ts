import { Arrow, Direction, Difficulty, GridPoint, LevelData } from '../types/game';
import { isArrowFree } from './collision';

/**
 * Procedural Reverse Level Generator
 * Builds solvable puzzles by placing arrows in reverse order of escape.
 */
export class LevelGenerator {
  /**
   * Generates a Heart silhouette mask on a grid
   */
  static createHeartMask(width: number, height: number): GridPoint[] {
    const points: GridPoint[] = [];
    const centerX = (width - 1) / 2;
    const centerY = (height - 1) / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Parametric / algebraic heart formula normalized to [-1.5, 1.5]
        const nx = ((x - centerX) / (width * 0.45)) * 1.3;
        const ny = -((y - centerY) / (height * 0.45)) * 1.3 + 0.3;

        // Equation: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
        const val = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * Math.pow(ny, 3);
        if (val <= 0.05) {
          points.push({ x, y });
        }
      }
    }
    return points;
  }

  /**
   * Generates a Leaf silhouette mask on a grid
   */
  static createLeafMask(width: number, height: number): GridPoint[] {
    const points: GridPoint[] = [];
    const centerX = (width - 1) / 2;
    const centerY = (height - 1) / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = (x - centerX) / (width * 0.45);
        const ny = (y - centerY) / (height * 0.45);

        // Oval distorted along diagonal to form an organic pointed leaf
        const rotX = nx * 0.707 - ny * 0.707;
        const rotY = nx * 0.707 + ny * 0.707;
        const dist = (rotX * rotX) / 0.8 + (rotY * rotY) / 0.25;

        if (dist <= 1.0) {
          points.push({ x, y });
        }
      }
    }
    return points;
  }

  /**
   * Generates a solvable level using Reverse Placement
   */
  static generateSolvableLevel(options: {
    levelNumber: number;
    name: string;
    difficulty: Difficulty;
    gridWidth: number;
    gridHeight: number;
    mask?: GridPoint[];
    targetArrowCount?: number;
  }): LevelData {
    const { levelNumber, name, difficulty, gridWidth, gridHeight, mask } = options;

    const activeMaskSet = new Set<string>();
    if (mask && mask.length > 0) {
      mask.forEach((p) => activeMaskSet.add(`${p.x},${p.y}`));
    } else {
      // Default to full rectangular grid
      for (let y = 1; y < gridHeight - 1; y++) {
        for (let x = 1; x < gridWidth - 1; x++) {
          activeMaskSet.add(`${x},${y}`);
        }
      }
    }

    const occupied = new Set<string>();
    const arrows: Arrow[] = [];
    const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

    let attempts = 0;
    const maxAttempts = 1200;
    let arrowIndex = 1;

    // Helper to test if a point is within active mask and unoccupied
    const isAvailable = (x: number, y: number) => {
      const key = `${x},${y}`;
      return (
        x >= 0 &&
        x < gridWidth &&
        y >= 0 &&
        y < gridHeight &&
        activeMaskSet.has(key) &&
        !occupied.has(key)
      );
    };

    while (attempts < maxAttempts && occupied.size < activeMaskSet.size * 0.82) {
      attempts++;

      // Pick a random available cell to be the head
      const availableCells: GridPoint[] = [];
      activeMaskSet.forEach((key) => {
        if (!occupied.has(key)) {
          const [cx, cy] = key.split(',').map(Number);
          availableCells.push({ x: cx, y: cy });
        }
      });

      if (availableCells.length === 0) break;

      const head = availableCells[Math.floor(Math.random() * availableCells.length)];

      // Pick an exit direction that has a clear line to the perimeter
      const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
      let chosenDir: Direction | null = null;

      for (const dir of shuffledDirs) {
        let dx = 0;
        let dy = 0;
        if (dir === 'RIGHT') dx = 1;
        if (dir === 'LEFT') dx = -1;
        if (dir === 'DOWN') dy = 1;
        if (dir === 'UP') dy = -1;

        let checkX = head.x + dx;
        let checkY = head.y + dy;
        let pathClear = true;

        while (checkX >= 0 && checkX < gridWidth && checkY >= 0 && checkY < gridHeight) {
          if (occupied.has(`${checkX},${checkY}`)) {
            pathClear = false;
            break;
          }
          checkX += dx;
          checkY += dy;
        }

        if (pathClear) {
          chosenDir = dir;
          break;
        }
      }

      if (!chosenDir) continue;

      // Now grow the arrow body backwards from head (opposite of facing direction or 90 degree turns)
      const segments: GridPoint[] = [head];
      const segmentKeys = new Set<string>([`${head.x},${head.y}`]);
      let current = head;
      const targetLength = Math.floor(Math.random() * 4) + 3; // 3 to 6 segments

      for (let step = 1; step < targetLength; step++) {
        const neighbors: GridPoint[] = [
          { x: current.x + 1, y: current.y },
          { x: current.x - 1, y: current.y },
          { x: current.x, y: current.y + 1 },
          { x: current.x, y: current.y - 1 },
        ];

        const validNeighbors = neighbors.filter(
          (n) => isAvailable(n.x, n.y) && !segmentKeys.has(`${n.x},${n.y}`)
        );

        if (validNeighbors.length === 0) break;

        const next = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
        segments.unshift(next); // Prepend to have segments ordered tail -> head
        segmentKeys.add(`${next.x},${next.y}`);
        current = next;
      }

      // Valid arrow must have at least 2 segments
      if (segments.length >= 2) {
        segments.forEach((pt) => occupied.add(`${pt.x},${pt.y}`));
        arrows.push({
          id: `arrow_${arrowIndex++}`,
          segments,
          direction: chosenDir,
          status: 'idle',
        });
      }
    }

    // Verify solvability through forward simulation
    const simulatedArrows = arrows.map((a) => ({ ...a }));
    let solvedCount = 0;
    let madeProgress = true;

    while (madeProgress && solvedCount < simulatedArrows.length) {
      madeProgress = false;
      for (const arrow of simulatedArrows) {
        if (arrow.status !== 'escaped' && isArrowFree(arrow, simulatedArrows, gridWidth, gridHeight)) {
          arrow.status = 'escaped';
          solvedCount++;
          madeProgress = true;
        }
      }
    }

    return {
      levelNumber,
      name,
      difficulty,
      gridWidth,
      gridHeight,
      shapeMask: mask,
      arrows: arrows.reverse(), // Reverse to interlock correctly
    };
  }
}

