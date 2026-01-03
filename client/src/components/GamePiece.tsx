/**
 * Game Piece Component
 * Design Philosophy: Candy Pop Maximalism
 * - Glossy 3D appearance with highlights and shadows
 * - Bouncy animations on interaction
 * - Vibrant, saturated colors
 * - Exciting match animations
 */

import { GamePiece as GamePieceType, PieceType } from '@/lib/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface GamePieceProps {
  piece: GamePieceType;
  isSelected: boolean;
  isMatched: boolean;
  isInvalidSwap?: boolean;
  onClick: () => void;
  isAnimating: boolean;
}

const PIECE_COLORS: Record<PieceType, { 
  bg: string; 
  shadow: string; 
  highlight: string;
  glow: string;
}> = {
  red: {
    bg: 'from-red-500 to-red-600',
    shadow: 'shadow-red-400/50',
    highlight: 'from-red-300',
    glow: '#ef4444',
  },
  yellow: {
    bg: 'from-yellow-400 to-yellow-500',
    shadow: 'shadow-yellow-300/50',
    highlight: 'from-yellow-200',
    glow: '#eab308',
  },
  blue: {
    bg: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-400/50',
    highlight: 'from-blue-300',
    glow: '#3b82f6',
  },
  pink: {
    bg: 'from-pink-500 to-pink-600',
    shadow: 'shadow-pink-400/50',
    highlight: 'from-pink-300',
    glow: '#ec4899',
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    shadow: 'shadow-purple-400/50',
    highlight: 'from-purple-300',
    glow: '#a855f7',
  },
  orange: {
    bg: 'from-orange-500 to-orange-600',
    shadow: 'shadow-orange-400/50',
    highlight: 'from-orange-300',
    glow: '#f97316',
  },
};

export default function GamePiece({
  piece,
  isSelected,
  isMatched,
  isInvalidSwap = false,
  onClick,
  isAnimating,
}: GamePieceProps) {
  const colors = PIECE_COLORS[piece.type];
  const [isHovered, setIsHovered] = useState(false);

  // Determine the animation state
  const getAnimateState = () => {
    if (isMatched) {
      return {
        scale: [1, 1.15, 0],
        opacity: [1, 1, 0],
        filter: [
          'brightness(1)',
          'brightness(1.8)',
          'brightness(2.5)',
        ],
      };
    }
    if (isInvalidSwap) {
      return {
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        scale: 1,
        rotate: [0, -3, 3, -2, 2, 0],
        filter: ['brightness(1)', 'brightness(0.7)', 'brightness(1)'],
      };
    }
    if (isSelected) {
      return {
        scale: 1.15,
        y: -8,
        rotate: 0,
        opacity: 1,
        filter: 'brightness(1.1)',
      };
    }
    if (isHovered) {
      return {
        scale: 1.08,
        y: -4,
        rotate: 0,
        opacity: 1,
        filter: 'brightness(1.05)',
      };
    }
    return {
      scale: 1,
      y: 0,
      x: 0,
      rotate: 0,
      opacity: 1,
      filter: 'brightness(1)',
    };
  };

  // Determine transition based on state
  const getTransition = () => {
    if (isMatched) {
      return {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        times: [0, 0.4, 1],
      };
    }
    if (isInvalidSwap) {
      return {
        duration: 0.5,
        ease: 'easeInOut',
      };
    }
    return {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    };
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={piece.id}
        className="relative w-full h-full cursor-pointer"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={getAnimateState()}
        exit={{
          scale: 0,
          opacity: 0,
        }}
        transition={getTransition()}
        whileTap={!isAnimating ? { scale: 0.92, rotate: -5 } : {}}
      >
        {/* Glow effect when matched */}
        {isMatched && (
          <>
            <motion.div
              className="absolute inset-[-30%] rounded-full pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.8, 2.2],
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              style={{
                background: `radial-gradient(circle, ${colors.glow}90 0%, ${colors.glow}50 40%, transparent 70%)`,
              }}
            />
            
            {/* Candy burst particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${colors.glow}, white)`,
                  boxShadow: `0 0 6px ${colors.glow}`,
                }}
                initial={{ 
                  x: '-50%', 
                  y: '-50%', 
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `calc(-50% + ${Math.cos((i / 8) * Math.PI * 2) * 50}px)`,
                  y: `calc(-50% + ${Math.sin((i / 8) * Math.PI * 2) * 50}px)`,
                  scale: [0, 1.2, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.02,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Sweet sparkle stars */}
            {[...Array(4)].map((_, i) => (
              <motion.span
                key={`star-${i}`}
                className="absolute left-1/2 top-1/2 text-yellow-300 pointer-events-none"
                style={{ fontSize: '14px' }}
                initial={{ 
                  x: '-50%', 
                  y: '-50%',
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: `calc(-50% + ${(i % 2 === 0 ? 1 : -1) * (25 + i * 8)}px)`,
                  y: `calc(-50% + ${(i < 2 ? -1 : 1) * (20 + i * 5)}px)`,
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.05 + i * 0.03,
                  ease: 'easeOut',
                }}
              >
                ✦
              </motion.span>
            ))}
          </>
        )}

        {/* Red flash for invalid swap */}
        {isInvalidSwap && (
          <motion.div
            className="absolute inset-[-10%] rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
            style={{
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, rgba(239, 68, 68, 0.4) 50%, transparent 70%)',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
            }}
          />
        )}

        {/* Main piece circle */}
        <div
          className={`
            relative w-full h-full rounded-full
            bg-gradient-to-br ${colors.bg}
            ${colors.shadow} shadow-lg
            border-4 border-white/30
            transition-all duration-200
            ${isSelected ? 'ring-4 ring-yellow-300 ring-offset-2' : ''}
          `}
        >
          {/* Glossy highlight */}
          <div
            className={`
              absolute top-2 left-2 w-1/3 h-1/3
              bg-gradient-to-br ${colors.highlight} to-transparent
              rounded-full opacity-60 blur-sm
            `}
          />

          {/* Inner shine effect */}
          <div
            className={`
              absolute inset-1 rounded-full
              bg-gradient-to-br from-white/20 to-transparent
            `}
          />
          
          {/* Match sparkle overlay */}
          {isMatched && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
              }}
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 60%)',
              }}
              transition={{
                duration: 0.25,
                ease: 'easeOut',
              }}
            />
          )}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-yellow-300"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(253, 224, 71, 0.7)',
                '0 0 0 8px rgba(253, 224, 71, 0)',
              ],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        )}
        
        {/* Hover sparkle effect */}
        {isHovered && !isMatched && !isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
