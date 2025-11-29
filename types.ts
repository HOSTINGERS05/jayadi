export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  group: string; // Used for coloring
  mass: string;
  configuration: string; // Electron configuration
}

export type GridCoord = { r: number; c: number };

export interface TileState {
  id: string; // Unique ID for React keys
  elementId: number; // The atomic number (links to ElementData)
  isVisible: boolean;
  isFake?: boolean; // For "fake" tiles that disappear
}

export interface LevelConfig {
  level: number;
  rows: number;
  cols: number;
  time: number; // in seconds
  elementsRange: number[]; // [start, end] atomic numbers to use
  features: {
    gravity?: boolean; // Tiles fall down
    fog?: boolean; // Tiles blurred until interaction
    blink?: boolean; // Tiles blink in and out
    mirror?: boolean; // Tiles rendered upside down/mirrored
    dark?: boolean; // Dark board mode
    fakeTiles?: boolean; // Include fake tiles
    obstacles?: boolean; // Fixed blocks
    shuffleInterval?: number; // 0 if no auto shuffle
  };
  description: string;
}

export interface PathResult {
  path: GridCoord[];
  found: boolean;
}