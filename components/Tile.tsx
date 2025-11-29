import React from 'react';
import { getElement, GROUP_COLORS } from '../data/elements';
import { TileState } from '../types';
import { Atom } from 'lucide-react';

interface TileProps {
  tile: TileState;
  isSelected: boolean;
  onClick: () => void;
  config: {
    fog?: boolean;
    blink?: boolean;
    mirror?: boolean;
    dark?: boolean;
  };
  revealed?: boolean; // For fog
}

export const Tile: React.FC<TileProps> = ({ tile, isSelected, onClick, config, revealed }) => {
  if (!tile.isVisible) {
    return <div className="w-full h-full opacity-0 pointer-events-none" />;
  }

  const data = getElement(tile.elementId);
  const colorClass = GROUP_COLORS[data.group] || 'bg-gray-500';
  
  const isFoggy = config.fog && !isSelected && !revealed;
  const blinkClass = config.blink ? 'blink-mode' : '';
  const mirrorClass = config.mirror ? 'scale-x-[-1]' : '';
  const isDark = config.dark;
  
  const baseClasses = `
    relative w-full h-full rounded-lg shadow-md flex flex-col items-center justify-center 
    cursor-pointer select-none transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1
    ${blinkClass}
    ${mirrorClass}
  `;

  const stateClasses = isSelected 
    ? 'ring-4 ring-white scale-105 z-10 brightness-110' 
    : 'hover:brightness-105';

  return (
    <div 
      className={`${baseClasses} ${colorClass} ${stateClasses} p-1`}
      onClick={onClick}
    >
       {/* Fog Overlay */}
       {isFoggy && (
        <div className="absolute inset-0 bg-slate-700/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-20">
          <Atom className="text-white/50 w-6 h-6 animate-pulse" />
        </div>
      )}

      {/* Content */}
      <div className={`w-full h-full flex flex-col relative ${isDark ? 'invert' : ''}`}>
        
        {/* Atomic Number */}
        <span className="absolute -top-0.5 left-0.5 text-[9px] sm:text-[10px] font-bold opacity-70 leading-none">
          {data.number}
        </span>
        
        {/* Symbol - Centered Large */}
        <div className="flex-1 flex flex-col items-center justify-center pt-2 pb-0.5">
            <span className="text-xl sm:text-2xl font-bold font-mono leading-none tracking-tight">
              {data.symbol}
            </span>
        </div>

        {/* Name and Config - Bottom */}
        <div className="w-full flex flex-col items-center justify-end pb-0.5 px-0.5">
            <span className="text-[8px] sm:text-[9px] leading-tight text-center font-medium w-full break-words">
              {data.name}
            </span>
            <span className="text-[7px] leading-none text-center opacity-90 font-mono mt-0.5 tracking-tighter w-full truncate">
              {data.configuration}
            </span>
        </div>
      </div>
    </div>
  );
};