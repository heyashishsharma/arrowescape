/**
 * Procedural Reverse Level Generator Script
 * Generates 100% solvable levels by building puzzles in reverse order of escape.
 * Run with: node scripts/generateLevels.js
 */

const fs = require('fs');
const path = require('path');

function createHeartMask(width, height) {
  const points = [];
  const centerX = (width - 1) / 2;
  const centerY = (height - 1) / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = ((x - centerX) / (width * 0.45)) * 1.3;
      const ny = -((y - centerY) / (height * 0.45)) * 1.3 + 0.3;
      const val = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * Math.pow(ny, 3);
      if (val <= 0.05) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

function createLeafMask(width, height) {
  const points = [];
  const centerX = (width - 1) / 2;
  const centerY = (height - 1) / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x - centerX) / (width * 0.45);
      const ny = (y - centerY) / (height * 0.45);
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

function generateLevel(levelNumber, name, difficulty, gridWidth, gridHeight, mask) {
  const activeMaskSet = new Set();
  if (mask && mask.length > 0) {
    mask.forEach((p) => activeMaskSet.add(`${p.x},${p.y}`));
  } else {
    for (let y = 1; y < gridHeight - 1; y++) {
      for (let x = 1; x < gridWidth - 1; x++) {
        activeMaskSet.add(`${x},${y}`);
      }
    }
  }

  const occupied = new Set();
  const arrows = [];
  const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  let attempts = 0;
  const maxAttempts = 1500;
  let arrowId = 1;

  const isAvailable = (x, y) => {
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

  while (attempts < maxAttempts && occupied.size < activeMaskSet.size * 0.85) {
    attempts++;
    const available = [];
    activeMaskSet.forEach((key) => {
      if (!occupied.has(key)) {
        const [cx, cy] = key.split(',').map(Number);
        available.push({ x: cx, y: cy });
      }
    });

    if (available.length === 0) break;
    const head = available[Math.floor(Math.random() * available.length)];

    const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);
    let chosenDir = null;

    for (const dir of shuffledDirs) {
      let dx = dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0;
      let dy = dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0;

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

    const segments = [head];
    const segmentKeys = new Set([`${head.x},${head.y}`]);
    let current = head;
    const targetLen = Math.floor(Math.random() * 4) + 3;

    for (let step = 1; step < targetLen; step++) {
      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 },
      ].filter((n) => isAvailable(n.x, n.y) && !segmentKeys.has(`${n.x},${n.y}`));

      if (neighbors.length === 0) break;
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      segments.unshift(next);
      segmentKeys.add(`${next.x},${next.y}`);
      current = next;
    }

    if (segments.length >= 2) {
      segments.forEach((pt) => occupied.add(`${pt.x},${pt.y}`));
      arrows.push({
        id: `arrow_${arrowId++}`,
        segments,
        direction: chosenDir,
        status: 'idle',
      });
    }
  }

  return {
    levelNumber,
    name,
    difficulty,
    gridWidth,
    gridHeight,
    shapeMask: mask,
    arrows: arrows.reverse(),
  };
}

console.log('Generating Solvable Procedural Levels...');
const levels = [];

for (let i = 1; i <= 20; i++) {
  levels.push(generateLevel(i, `Level ${i}`, 'Easy', 8, 8));
}
for (let i = 21; i <= 40; i++) {
  levels.push(generateLevel(i, `Level ${i}`, 'Normal', 10, 14));
}
for (let i = 41; i <= 70; i++) {
  const heart = createHeartMask(14, 14);
  levels.push(generateLevel(i, `Level ${i} (Heart)`, 'Hard', 14, 14, heart));
}
for (let i = 71; i <= 100; i++) {
  const leaf = createLeafMask(13, 13);
  levels.push(generateLevel(i, `Level ${i} (Leaf)`, 'Hard', 13, 13, leaf));
}

const outDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'levels.json'), JSON.stringify(levels, null, 2));
console.log(`Successfully generated ${levels.length} solvable levels into assets/levels.json!`);

