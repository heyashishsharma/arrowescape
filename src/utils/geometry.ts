import { Arrow, Direction, GridPoint } from '../types/game';

export interface ViewportTransform {
  cellSize: number;
  offsetX: number;
  offsetY: number;
  boardPixelWidth: number;
  boardPixelHeight: number;
}

/**
 * Computes viewport scaling and offsets to center a grid inside a container width & height.
 */
export function calculateViewport(
  gridWidth: number,
  gridHeight: number,
  containerWidth: number,
  containerHeight: number,
  padding: number = 24
): ViewportTransform {
  const availableWidth = Math.max(100, containerWidth - padding * 2);
  const availableHeight = Math.max(100, containerHeight - padding * 2);

  const cellW = availableWidth / gridWidth;
  const cellH = availableHeight / gridHeight;
  const cellSize = Math.floor(Math.min(cellW, cellH));

  const boardPixelWidth = cellSize * gridWidth;
  const boardPixelHeight = cellSize * gridHeight;

  const offsetX = Math.floor((containerWidth - boardPixelWidth) / 2);
  const offsetY = Math.floor((containerHeight - boardPixelHeight) / 2);

  return {
    cellSize,
    offsetX,
    offsetY,
    boardPixelWidth,
    boardPixelHeight,
  };
}

/**
 * Converts a grid coordinate (gx, gy) to canvas pixel center coordinate (px, py).
 */
export function gridToPixel(
  gx: number,
  gy: number,
  viewport: ViewportTransform
): { px: number; py: number } {
  return {
    px: viewport.offsetX + gx * viewport.cellSize + viewport.cellSize / 2,
    py: viewport.offsetY + gy * viewport.cellSize + viewport.cellSize / 2,
  };
}

/**
 * Converts a canvas touch coordinate (touchX, touchY) to nearest grid coordinate.
 */
export function pixelToGrid(
  touchX: number,
  touchY: number,
  viewport: ViewportTransform
): GridPoint | null {
  const relX = touchX - viewport.offsetX;
  const relY = touchY - viewport.offsetY;

  if (relX < 0 || relY < 0) return null;

  const gx = Math.floor(relX / viewport.cellSize);
  const gy = Math.floor(relY / viewport.cellSize);

  return { x: gx, y: gy };
}

/**
 * Builds SVG path string for the multi-segment arrow body.
 */
export function buildArrowBodyPath(
  segments: GridPoint[],
  viewport: ViewportTransform
): string {
  if (segments.length === 0) return '';

  const first = gridToPixel(segments[0].x, segments[0].y, viewport);
  let d = `M ${first.px.toFixed(1)} ${first.py.toFixed(1)}`;

  for (let i = 1; i < segments.length; i++) {
    const pt = gridToPixel(segments[i].x, segments[i].y, viewport);
    d += ` L ${pt.px.toFixed(1)} ${pt.py.toFixed(1)}`;
  }

  return d;
}

/**
 * Builds SVG path string for a filled triangle arrowhead at the last segment.
 */
export function buildArrowHeadPath(
  headPoint: GridPoint,
  direction: Direction,
  viewport: ViewportTransform
): string {
  const { px, py } = gridToPixel(headPoint.x, headPoint.y, viewport);
  const size = viewport.cellSize * 0.42; // Arrowhead proportional scale
  const halfWing = size * 0.75;

  let tipX = px;
  let tipY = py;
  let leftX = px;
  let leftY = py;
  let rightX = px;
  let rightY = py;

  switch (direction) {
    case 'RIGHT':
      tipX = px + size * 0.6;
      tipY = py;
      leftX = px - size * 0.5;
      leftY = py - halfWing;
      rightX = px - size * 0.5;
      rightY = py + halfWing;
      break;

    case 'LEFT':
      tipX = px - size * 0.6;
      tipY = py;
      leftX = px + size * 0.5;
      leftY = py - halfWing;
      rightX = px + size * 0.5;
      rightY = py + halfWing;
      break;

    case 'UP':
      tipX = px;
      tipY = py - size * 0.6;
      leftX = px - halfWing;
      leftY = py + size * 0.5;
      rightX = px + halfWing;
      rightY = py + size * 0.5;
      break;

    case 'DOWN':
      tipX = px;
      tipY = py + size * 0.6;
      leftX = px - halfWing;
      leftY = py - size * 0.5;
      rightX = px + halfWing;
      rightY = py - size * 0.5;
      break;
  }

  return `M ${tipX.toFixed(1)} ${tipY.toFixed(1)} L ${leftX.toFixed(1)} ${leftY.toFixed(1)} L ${rightX.toFixed(1)} ${rightY.toFixed(1)} Z`;
}

/**
 * Detects which arrow was tapped given a grid point.
 */
export function findArrowAtGridPoint(arrows: Arrow[], pt: GridPoint): Arrow | undefined {
  return arrows.find(
    (arrow) =>
      arrow.status !== 'escaped' &&
      arrow.segments.some((seg) => seg.x === pt.x && seg.y === pt.y)
  );
}

