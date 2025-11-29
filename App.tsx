import React, { useState, useEffect } from 'react';
import { Board } from './components/Board';
import { LevelMenu } from './components/LevelMenu';
import { getLevelConfig } from './logic/levelGenerator';
import { FlaskConical, Play, Award, Trophy } from 'lucide-react';

// Persist unlocked levels
const getSavedProgress = () => {
    const saved = localStorage.getItem('chemiconnect_level');
    return saved ? parseInt(saved) : 1;
};

const App: React.FC = () => {
  const [view, setView] = useState<'menu' | 'levelSelect' | 'game' | 'win' | 'lose'>('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState(getSavedProgress());
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);

  useEffect(() => {
      localStorage.setItem('chemiconnect_level', unlockedLevels.toString());
  }, [unlockedLevels]);

  const startLevel = (lvl: number) => {
    setCurrentLevel(lvl);
    setView('game');
  };

  const handleLevelComplete = (finalScore: number, starRating: number) => {
    setScore(finalScore);
    setStars(starRating);
    if (currentLevel === unlockedLevels) {
        setUnlockedLevels(prev => Math.min(prev + 1, 100));
    }
    setView('win');
  };

  const handleGameOver = () => {
      setView('lose');
  };

  const nextLevel = () => {
      if (currentLevel < 100) {
          setCurrentLevel(c => c + 1);
          setView('game');
      } else {
          setView('menu');
      }
  };

  const MainMenu = () => (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4">
          <div className="mb-8 relative">
             <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full"></div>
             <FlaskConical className="w-24 h-24 text-cyan-400 relative z-10" />
          </div>
          <h1 className="text-5xl font-bold mb-2 text-center tracking-tight font-mono">
              Chemi<span className="text-cyan-400">Connect</span>
          </h1>
          <p className="text-slate-400 mb-12 text-center max-w-md">
              Master the periodic table in this 100-level Onet puzzle adventure.
          </p>

          <div className="space-y-4 w-full max-w-xs">
              <button 
                onClick={() => startLevel(unlockedLevels)}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-cyan-900/50 transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                  <Play className="fill-current" /> Continue (Lvl {unlockedLevels})
              </button>
              
              <button 
                onClick={() => setView('levelSelect')}
                className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105"
              >
                  Select Level
              </button>
          </div>
      </div>
  );

  const WinScreen = () => (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
          <Trophy className="w-20 h-20 text-yellow-400 mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold mb-2">Level Complete!</h2>
          <p className="text-slate-400 mb-8">Great job, Chemist!</p>
          
          <div className="flex gap-2 mb-8">
              {[1, 2, 3].map(i => (
                  <StarIcon key={i} filled={i <= stars} />
              ))}
          </div>

          <div className="text-2xl font-mono text-cyan-400 mb-10">Score: {score}</div>

          <div className="flex gap-4">
              <button onClick={() => setView('menu')} className="px-6 py-3 bg-slate-700 rounded-lg hover:bg-slate-600">Menu</button>
              <button onClick={nextLevel} className="px-6 py-3 bg-green-500 text-slate-900 font-bold rounded-lg hover:bg-green-400">Next Level</button>
          </div>
      </div>
  );

  const LoseScreen = () => (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
          <div className="text-6xl mb-6">💥</div>
          <h2 className="text-4xl font-bold mb-2 text-red-500">Out of Time!</h2>
          <p className="text-slate-400 mb-8">The reaction failed.</p>
          
          <div className="flex gap-4">
              <button onClick={() => setView('menu')} className="px-6 py-3 bg-slate-700 rounded-lg hover:bg-slate-600">Menu</button>
              <button onClick={() => startLevel(currentLevel)} className="px-6 py-3 bg-cyan-500 text-slate-900 font-bold rounded-lg hover:bg-cyan-400">Try Again</button>
          </div>
      </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen font-sans">
      {view === 'menu' && <MainMenu />}
      {view === 'levelSelect' && (
          <LevelMenu 
            unlockedLevels={unlockedLevels} 
            onSelectLevel={startLevel} 
            onBack={() => setView('menu')} 
          />
      )}
      {view === 'game' && (
          <Board 
            levelConfig={getLevelConfig(currentLevel)} 
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
            onExit={() => setView('menu')}
          />
      )}
      {view === 'win' && <WinScreen />}
      {view === 'lose' && <LoseScreen />}
    </div>
  );
};

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg className={`w-10 h-10 ${filled ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

export default App;
