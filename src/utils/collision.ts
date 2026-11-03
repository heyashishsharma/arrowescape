import { Arrow, GridPoint } from '../types/game';

/**
 * Checks if the ray starting from target's head along its pointing direction
 * to the board boundary is completely clear of any other active arrow segments.
 */
export function isArrowFree(
  target: Arrow,
  allArrows: Arrow[],
  gridWidth: number,
  gridHeight: number
): boolean {
  if (target.status === 'escaped') return false;
  if (target.segments.length === 0) return false;

  const head = target.segments[target.segments.length - 1];

  // 1. Gather all occupied points by OTHER remaining arrows
  const occupied = new Set<string>();
  for (const arrow of allArrows) {
    if (arrow.id === target.id || arrow.status === 'escaped') continue;
    for (const pt of arrow.segments) {
      occupied.add(`${pt.x},${pt.y}`);
    }
  }

  // 2. Vector delta along arrow's exit direction
  let dx = 0;
  let dy = 0;
  switch (target.direction) {
    case 'RIGHT':
      dx = 1;
      break;
    case 'LEFT':
      dx = -1;
      break;
    case 'DOWN':
      dy = 1;
      break;
    case 'UP':
      dy = -1;
      break;
  }

  // 3. Step forward from the head cell toward the perimeter
  let checkX = head.x + dx;
  let checkY = head.y + dy;

  while (checkX >= 0 && checkX < gridWidth && checkY >= 0 && checkY < gridHeight) {
    if (occupied.has(`${checkX},${checkY}`)) {
      return false; // Obstructed by another arrow!
    }
    checkX += dx;
    checkY += dy;
  }

  return true; // Path is completely clear to the edge!
}

/**
 * Finds all arrows that can currently escape freely.
 */
export function getFreeArrows(
  allArrows: Arrow[],
  gridWidth: number,
  gridHeight: number
): Arrow[] {
  return allArrows.filter(
    (arrow) => arrow.status !== 'escaped' && isArrowFree(arrow, allArrows, gridWidth, gridHeight)
  );
}

