/**
 * Game Piece Component - Gumball Style (Performance Optimized)
 * Simplified animations for smooth mobile experience
 */

import { GamePiece as GamePieceType, PieceType } from '@/lib/gameLogic';
import { memo } from 'react';

interface GamePieceProps {
  piece: GamePieceType;
  isSelected: boolean;
  isMatched: boolean;
  isInvalidSwap?: boolean;
  isDragging?: boolean;
  onClick: () => void;
  isAnimating: boolean;
}

// Gumball color palette - rich, saturated candy colors
const PIECE_COLORS: Record<PieceType, { 
  base: string;
  light: string;
  dark: string;
  glow: string;
  shadow: string;
}> = {
  red: {
    base: '#E53935',
    light: '#FF6F60',
    dark: '#AB000D',
    glow: '#ef4444',
    shadow: 'rgba(171, 0, 13, 0.4)',
  },
  yellow: {
    base: '#FDD835',
    light: '#FFFF6B',
    dark: '#C6A700',
    glow: '#eab308',
    shadow: 'rgba(198, 167, 0, 0.4)',
  },
  blue: {
    base: '#1E88E5',
    light: '#6AB7FF',
    dark: '#005CB2',
    glow: '#3b82f6',
    shadow: 'rgba(0, 92, 178, 0.4)',
  },
  pink: {
    base: '#EC407A',
    light: '#FF77A9',
    dark: '#B4004E',
    glow: '#ec4899',
    shadow: 'rgba(180, 0, 78, 0.4)',
  },
  purple: {
    base: '#8E24AA',
    light: '#C158DC',
    dark: '#5C007A',
    glow: '#a855f7',
    shadow: 'rgba(92, 0, 122, 0.4)',
  },
  orange: {
    base: '#FB8C00',
    light: '#FFBD45',
    dark: '#C25E00',
    glow: '#f97316',
    shadow: 'rgba(194, 94, 0, 0.4)',
  },
};

const GamePiece = memo(function GamePiece({
  piece,
  isSelected,
  isMatched,
  isInvalidSwap = false,
  isDragging = false,
  onClick,
}: GamePieceProps) {
  const colors = PIECE_COLORS[piece.type];

  // Build class names based on state
  const getContainerClasses = () => {
    const base = 'relative w-full h-full cursor-pointer select-none game-piece';
    const transitions = 'transition-all duration-150 ease-out';
    
    if (isMatched) return `${base} ${transitions} scale-0 opacity-0`;
    if (isDragging) return `${base} ${transitions} scale-110 -translate-y-1 brightness-110`;
    if (isInvalidSwap) return `${base} animate-shake`;
    if (isSelected) return `${base} ${transitions} scale-110 -translate-y-1`;
    
    return `${base} ${transitions} hover:scale-105 active:scale-95`;
  };

  return (
    <div
      className={getContainerClasses()}
      onClick={onClick}
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Glow effect when matched */}
      {isMatched && (
        <div
          className="absolute inset-[-20%] rounded-full pointer-events-none animate-ping"
          style={{
            background: `radial-gradient(circle, ${colors.glow}60 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Main gumball sphere */}
      <div
        className={`
          relative w-full h-full rounded-full
          ${isSelected ? 'ring-2 sm:ring-4 ring-yellow-300 ring-offset-1' : ''}
        `}
        style={{
          background: `
            radial-gradient(
              ellipse 50% 50% at 35% 30%,
              ${colors.light} 0%,
              ${colors.base} 40%,
              ${colors.dark} 100%
            )
          `,
          boxShadow: `
            inset -3px -3px 8px rgba(0, 0, 0, 0.25),
            inset 3px 3px 8px rgba(255, 255, 255, 0.12),
            0 3px 6px ${colors.shadow}
          `,
        }}
      >
        {/* Primary specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top: '12%',
            left: '18%',
            width: '35%',
            height: '35%',
            background: `
              radial-gradient(
                ellipse at 40% 40%,
                rgba(255, 255, 255, 0.9) 0%,
                rgba(255, 255, 255, 0.5) 30%,
                transparent 70%
              )
            `,
          }}
        />

        {/* Small sharp highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top: '10%',
            left: '24%',
            width: '15%',
            height: '15%',
            background: 'rgba(255, 255, 255, 0.85)',
          }}
        />

        {/* Match flash overlay */}
        {isMatched && (
          <div
            className="absolute inset-0 rounded-full bg-white animate-pulse"
            style={{ opacity: 0.7 }}
          />
        )}

        {/* Invalid swap flash */}
        {isInvalidSwap && (
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{ 
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Selection pulse ring */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-full border-2 border-yellow-300 animate-pulse"
        />
      )}
    </div>
  );
});

export default GamePiece;
