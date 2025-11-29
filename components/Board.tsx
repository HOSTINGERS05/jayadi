import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TileState, GridCoord, LevelConfig } from '../types';
import { Tile } from './Tile';
import { findPath } from '../logic/pathfinding';
import { ArrowLeft, RefreshCw, Zap, Pause, Play, Eye } from 'lucide-react';
import { getElement } from '../data/elements';

interface BoardProps {
  levelConfig: LevelConfig;
  onLevelComplete: (score: number, stars: number) => void;
  onGameOver: () => void;
  onExit: () => void;
}

export const Board: React.FC<BoardProps> = ({ levelConfig, onLevelComplete, onGameOver, onExit }) => {
  const [grid, setGrid] = useState<(TileState | null)[][]>([]);
  const [selected, setSelected] = useState<GridCoord | null>(null);
  const [timeLeft, setTimeLeft] = useState(levelConfig.time);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [pathVis, setPathVis] = useState<GridCoord[]>([]);
  const [shufflesLeft, setShufflesLeft] = useState(3);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintPair, setHintPair] = useState<GridCoord[] | null>(null);
  
  // Fog of war logic: keep track of tiles that have been "revealed" temporarily
  const [revealedTiles, setRevealedTiles] = useState<Set<string>>(new Set());

  // Refs for timers to avoid closure staleness
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shuffleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Initialization ---
  const initBoard = useCallback(() => {
    const { rows, cols, elementsRange, features } = levelConfig;
    const totalTiles = rows * cols;
    
    // We need pairs.
    const pairCount = totalTiles / 2;
    const availableElements = [];
    for (let i = elementsRange[0]; i <= elementsRange[1]; i++) {
      availableElements.push(i);
    }

    const tiles: TileState[] = [];
    
    // Create pairs
    for (let i = 0; i < pairCount; i++) {
      // Pick random element from range
      const elId = availableElements[Math.floor(Math.random() * availableElements.length)];
      
      const id1 = `tile-${i}-a`;
      const id2 = `tile-${i}-b`;

      tiles.push({ id: id1, elementId: elId, isVisible: true });
      tiles.push({ id: id2, elementId: elId, isVisible: true });
    }

    // Shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    const newGrid: (TileState | null)[][] = [];
    let k = 0;
    for (let r = 0; r < rows; r++) {
      const row: (TileState | null)[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(tiles[k]);
        k++;
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setTimeLeft(levelConfig.time);
    setSelected(null);
    setScore(0);
    setShufflesLeft(3);
    setHintsLeft(3);
    setPathVis([]);
  }, [levelConfig]);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // --- Game Loop ---
  useEffect(() => {
    if (isPaused) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          onGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, onGameOver]);

  // Auto shuffle interval
  useEffect(() => {
    if (isPaused || !levelConfig.features.shuffleInterval) return;

    shuffleTimerRef.current = setInterval(() => {
      doShuffle();
    }, levelConfig.features.shuffleInterval * 1000);

    return () => {
      if (shuffleTimerRef.current) clearInterval(shuffleTimerRef.current);
    }
  }, [levelConfig.features.shuffleInterval, isPaused]);

  // Check Win Condition
  useEffect(() => {
    // If all tiles are null
    if (grid.length > 0) {
      const hasTiles = grid.some(row => row.some(cell => cell !== null));
      if (!hasTiles) {
        // Win
        const starRating = timeLeft > levelConfig.time * 0.5 ? 3 : timeLeft > levelConfig.time * 0.2 ? 2 : 1;
        onLevelComplete(score + timeLeft * 10, starRating);
      }
    }
  }, [grid, score, timeLeft, levelConfig.time, onLevelComplete]);


  // --- Logic ---

  const doShuffle = () => {
    setGrid(prev => {
      // Extract all valid tiles
      const validTiles: TileState[] = [];
      prev.forEach(row => row.forEach(cell => {
        if (cell) validTiles.push(cell);
      }));

      // Shuffle array
      for (let i = validTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [validTiles[i], validTiles[j]] = [validTiles[j], validTiles[i]];
      }

      // Reconstruct grid
      const newGrid = prev.map(row => [...row]); // copy structure
      let k = 0;
      for (let r = 0; r < newGrid.length; r++) {
        for (let c = 0; c < newGrid[r].length; c++) {
          if (newGrid[r][c] !== null) {
            newGrid[r][c] = validTiles[k];
            k++;
          }
        }
      }
      return newGrid;
    });
    setHintPair(null);
  };

  const handleManualShuffle = () => {
    if (shufflesLeft > 0) {
      setShufflesLeft(p => p - 1);
      doShuffle();
    }
  };

  const applyGravity = (currentGrid: (TileState | null)[][]) => {
    const rows = levelConfig.rows;
    const cols = levelConfig.cols;
    const newGrid = currentGrid.map(row => [...row]);

    // For each column
    for (let c = 0; c < cols; c++) {
      // Collect tiles in this column
      const tilesInCol = [];
      for (let r = 0; r < rows; r++) {
        if (newGrid[r][c] !== null) {
          tilesInCol.push(newGrid[r][c]);
        }
      }
      
      const nullCount = rows - tilesInCol.length;
      for (let r = 0; r < rows; r++) {
        if (r < nullCount) {
          newGrid[r][c] = null;
        } else {
          newGrid[r][c] = tilesInCol[r - nullCount];
        }
      }
    }
    return newGrid;
  };

  const handleTileClick = (r: number, c: number) => {
    if (isPaused) return;
    const clickedTile = grid[r][c];
    if (!clickedTile) return;

    // Reveal fog
    if (levelConfig.features.fog) {
      setRevealedTiles(prev => {
        const next = new Set(prev);
        next.add(clickedTile.id);
        return next;
      });
    }

    // Fake Tile Logic
    if (levelConfig.features.fakeTiles && clickedTile.isFake) {
       // Disappear
       setGrid(prev => {
         const n = [...prev];
         n[r][c] = null;
         return n;
       });
       return;
    }

    if (!selected) {
      setSelected({ r, c });
      return;
    }

    // If clicked same tile, deselect
    if (selected.r === r && selected.c === c) {
      setSelected(null);
      return;
    }

    const prevTile = grid[selected.r][selected.c];
    if (!prevTile) {
        setSelected({r,c});
        return;
    }

    // Check Match
    if (prevTile.elementId === clickedTile.elementId) {
      // Check Path
      const path = findPath(selected, { r, c }, grid, levelConfig.rows, levelConfig.cols);
      
      if (path) {
        // Success!
        setPathVis(path);
        setScore(s => s + 20); // Base score

        // Delay for visual effect
        setTimeout(() => {
          setGrid(prev => {
            const newGrid = prev.map(row => [...row]);
            newGrid[selected.r][selected.c] = null;
            newGrid[r][c] = null;

            if (levelConfig.features.gravity) {
                return applyGravity(newGrid);
            }
            return newGrid;
          });
          setSelected(null);
          setPathVis([]);
          setHintPair(null);
        }, 300);
      } else {
        // No path
        setSelected({ r, c }); // Switch selection
      }
    } else {
      // Mismatch
      setSelected({ r, c });
    }
  };

  const findHint = () => {
    if (hintsLeft <= 0) return;
    
    // Brute force find a pair with a path
    const coords: GridCoord[] = [];
    for(let r=0; r<levelConfig.rows; r++){
        for(let c=0; c<levelConfig.cols; c++){
            if(grid[r][c]) coords.push({r,c});
        }
    }

    for(let i=0; i<coords.length; i++){
        for(let j=i+1; j<coords.length; j++){
            const p1 = coords[i];
            const p2 = coords[j];
            const t1 = grid[p1.r][p1.c]!;
            const t2 = grid[p2.r][p2.c]!;

            if (t1.elementId === t2.elementId) {
                const path = findPath(p1, p2, grid, levelConfig.rows, levelConfig.cols);
                if (path) {
                    setHintPair([p1, p2]);
                    setHintsLeft(h => h - 1);
                    setTimeout(() => setHintPair(null), 2000);
                    return;
                }
            }
        }
    }
  };

  // --- Rendering ---
  
  const gridStyle = {
    gridTemplateColumns: `repeat(${levelConfig.cols}, minmax(0, 1fr))`,
  };

  // SVG Line Overlay
  const renderPath = () => {
    if (pathVis.length < 2) return null;
    
    const points = pathVis.map(p => {
        const x = ((p.c + 0.5) / levelConfig.cols) * 100;
        const y = ((p.r + 0.5) / levelConfig.rows) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
            <polyline 
                points={points} 
                fill="none" 
                stroke="#22d3ee" // Cyan-400
                strokeWidth="4" 
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-lg"
            />
        </svg>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 overflow-hidden">
      {/* HUD */}
      <div className="flex-none p-4 bg-slate-800 shadow-xl flex justify-between items-center z-40">
        <div className="flex items-center gap-4">
           <button onClick={onExit} className="p-2 hover:bg-slate-700 rounded-full transition"><ArrowLeft /></button>
           <div>
             <h2 className="text-xl font-bold text-cyan-400">Level {levelConfig.level}</h2>
             <span className="text-xs text-slate-400 hidden sm:inline">{levelConfig.description}</span>
           </div>
        </div>

        <div className="flex items-center gap-6">
            <div className={`text-2xl font-mono font-bold ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-xl text-yellow-400 font-bold">
                {score} pts
            </div>
        </div>
        
        <button onClick={() => setIsPaused(!isPaused)} className="p-2 bg-slate-700 rounded-full hover:bg-slate-600">
            {isPaused ? <Play fill="white" /> : <Pause fill="white" />}
        </button>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8">
         
         {/* Pause Overlay */}
         {isPaused && (
             <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur flex items-center justify-center">
                 <h1 className="text-4xl font-bold text-white tracking-widest">PAUSED</h1>
             </div>
         )}

         {/* Board Container */}
         <div className="relative w-full max-w-4xl aspect-square sm:aspect-auto sm:h-full max-h-[85vh]">
            {renderPath()}
            
            <div className="grid gap-1 sm:gap-2 w-full h-full" style={gridStyle}>
                {grid.map((row, r) => (
                    row.map((tile, c) => (
                        <div key={`${r}-${c}`} className="relative w-full h-full min-h-0">
                             {tile ? (
                                 <Tile 
                                    tile={tile} 
                                    isSelected={selected?.r === r && selected?.c === c}
                                    onClick={() => handleTileClick(r, c)}
                                    config={levelConfig.features}
                                    revealed={levelConfig.features.fog ? revealedTiles.has(tile.id) : true}
                                 />
                             ) : (
                                 <div className="w-full h-full" /> 
                             )}
                             {/* Hint Overlay */}
                             {hintPair && hintPair.some(p => p.r === r && p.c === c) && (
                                 <div className="absolute inset-0 ring-4 ring-green-400 rounded-lg animate-ping pointer-events-none" />
                             )}
                        </div>
                    ))
                ))}
            </div>
         </div>
      </div>

      {/* Footer Controls */}
      <div className="flex-none bg-slate-800 p-4 flex justify-center gap-8 shadow-inner safe-area-pb">
          <button 
            onClick={handleManualShuffle} 
            disabled={shufflesLeft <= 0 || isPaused}
            className="flex flex-col items-center gap-1 disabled:opacity-30 group"
          >
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center group-active:scale-95 transition shadow-lg ring-2 ring-indigo-400">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-indigo-300">{shufflesLeft} Shuffle</span>
          </button>

          <button 
            onClick={findHint}
            disabled={hintsLeft <= 0 || isPaused}
            className="flex flex-col items-center gap-1 disabled:opacity-30 group"
          >
              <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center group-active:scale-95 transition shadow-lg ring-2 ring-yellow-400">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-yellow-300">{hintsLeft} Hint</span>
          </button>
      </div>
    </div>
  );
};
