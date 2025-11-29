import React from 'react';
import { Lock, Star, Beaker } from 'lucide-react';

interface LevelMenuProps {
  unlockedLevels: number;
  onSelectLevel: (lvl: number) => void;
  onBack: () => void;
}

export const LevelMenu: React.FC<LevelMenuProps> = ({ unlockedLevels, onSelectLevel, onBack }) => {
  const levels = Array.from({ length: 100 }, (_, i) => i + 1);

  // Group levels into tabs/sections or just a long scroll list?
  // Let's use a long scroll with sticky headers for tiers.

  const tiers = [
    { start: 1, name: "Beginner (1-20)", color: "text-green-400" },
    { start: 21, name: "Medium (21-40)", color: "text-yellow-400" },
    { start: 41, name: "Hard (41-60)", color: "text-blue-400" },
    { start: 61, name: "Very Hard (61-80)", color: "text-red-400" },
    { start: 81, name: "Master (81-100)", color: "text-purple-400" },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-900 p-4">
      <div className="max-w-3xl mx-auto pb-10">
        <header className="flex items-center justify-between mb-8 sticky top-0 bg-slate-900/95 backdrop-blur z-10 py-4 border-b border-slate-700">
           <button onClick={onBack} className="text-slate-400 hover:text-white underline">Back to Menu</button>
           <h2 className="text-2xl font-bold text-white">Select Level</h2>
           <div className="w-20"></div> {/* Spacer */}
        </header>

        <div className="space-y-8">
            {tiers.map((tier) => (
                <div key={tier.name}>
                    <h3 className={`text-xl font-bold mb-4 ${tier.color} sticky top-20 bg-slate-900/80 p-2 rounded backdrop-blur z-0`}>
                        {tier.name}
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-4">
                        {levels.slice(tier.start - 1, tier.start + 19).map(lvl => {
                            const isUnlocked = lvl <= unlockedLevels;
                            return (
                                <button
                                    key={lvl}
                                    onClick={() => isUnlocked && onSelectLevel(lvl)}
                                    disabled={!isUnlocked}
                                    className={`
                                        aspect-square rounded-lg flex flex-col items-center justify-center relative shadow-lg
                                        transition-all duration-200
                                        ${isUnlocked 
                                            ? 'bg-slate-700 hover:bg-slate-600 hover:scale-105 active:scale-95 ring-2 ring-slate-500' 
                                            : 'bg-slate-800 opacity-50 cursor-not-allowed'}
                                    `}
                                >
                                    {isUnlocked ? (
                                        <>
                                            <span className="text-lg font-bold text-white">{lvl}</span>
                                            {/* Simulate stars - in real app pass score/stars props */}
                                            <div className="flex gap-0.5 mt-1">
                                                {lvl < unlockedLevels && <Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />}
                                            </div>
                                        </>
                                    ) : (
                                        <Lock className="w-5 h-5 text-slate-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
