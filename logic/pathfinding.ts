import { GridCoord, TileState } from "../types";

// Directions: Up, Down, Left, Right
const DIRS = [
  { r: -1, c: 0 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
  { r: 0, c: 1 },
];

/**
 * BFS to find a path with max 2 turns (3 segments) between start and end.
 * The path can go through empty cells (null) or the start/end cells.
 * We allow a "padding" logic: coordinates can go -1 or rows/cols to represent
 * the border around the board, allowing edge tiles to connect via the outside.
 */
export const findPath = (
  start: GridCoord,
  end: GridCoord,
  grid: (TileState | null)[][],
  rows: number,
  cols: number
): GridCoord[] | null => {
  // Queue stores: { coord, directionOfArrival, turnsSoFar, pathHistory }
  // directionOfArrival: index in DIRS, or -1 for start
  const queue: { 
    pos: GridCoord; 
    dirIdx: number; 
    turns: number; 
    path: GridCoord[] 
  }[] = [];

  queue.push({ 
    pos: start, 
    dirIdx: -1, 
    turns: 0, 
    path: [start] 
  });

  // Visited array to avoid cycles: visited[r][c][dirIdx] -> min turns
  const visited = new Map<string, number>();

  while (queue.length > 0) {
    const { pos, dirIdx, turns, path } = queue.shift()!;

    // Reached destination?
    if (pos.r === end.r && pos.c === end.c) {
      return path;
    }

    // Explore neighbors
    for (let i = 0; i < DIRS.length; i++) {
      const dr = DIRS[i].r;
      const dc = DIRS[i].c;
      const nr = pos.r + dr;
      const nc = pos.c + dc;

      // Check expanded bounds: Allow 1 cell margin outside ( -1 to rows, -1 to cols )
      if (nr < -1 || nr > rows || nc < -1 || nc > cols) continue;

      const isTarget = nr === end.r && nc === end.c;
      const isOutOfBounds = nr < 0 || nr >= rows || nc < 0 || nc >= cols;
      
      // Determine if cell is passable
      let isEmpty = isOutOfBounds;
      if (!isOutOfBounds) {
        // Safe to access grid
        isEmpty = grid[nr][nc] === null;
      }

      if (!isEmpty && !isTarget) continue;

      // Calculate turns
      const newTurns = dirIdx === -1 ? 0 : (dirIdx === i ? turns : turns + 1);

      if (newTurns > 2) continue;

      // Optimization: Check visited
      const key = `${nr},${nc},${i}`;
      if (visited.has(key) && visited.get(key)! <= newTurns) {
        continue;
      }
      visited.set(key, newTurns);

      queue.push({
        pos: { r: nr, c: nc },
        dirIdx: i,
        turns: newTurns,
        path: [...path, { r: nr, c: nc }]
      });
    }
  }

  return null;
};
