/**
 * Game Piece Component - Gumball Style
 * Design Philosophy: Realistic 3D Gumball Appearance
 * - Glossy spherical 3D look with specular highlights
 * - Realistic light reflection like a gumball machine
 * - Vibrant candy colors with depth
 * - Bouncy animations on interaction
 */

import { GamePiece as GamePieceType, PieceType } from '@/lib/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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
    shadow: 'rgba(171, 0, 13, 0.5)',
  },
  yellow: {
    base: '#FDD835',
    light: '#FFFF6B',
    dark: '#C6A700',
    glow: '#eab308',
    shadow: 'rgba(198, 167, 0, 0.5)',
  },
  blue: {
    base: '#1E88E5',
    light: '#6AB7FF',
    dark: '#005CB2',
    glow: '#3b82f6',
    shadow: 'rgba(0, 92, 178, 0.5)',
  },
  pink: {
    base: '#EC407A',
    light: '#FF77A9',
    dark: '#B4004E',
    glow: '#ec4899',
    shadow: 'rgba(180, 0, 78, 0.5)',
  },
  purple: {
    base: '#8E24AA',
    light: '#C158DC',
    dark: '#5C007A',
    glow: '#a855f7',
    shadow: 'rgba(92, 0, 122, 0.5)',
  },
  orange: {
    base: '#FB8C00',
    light: '#FFBD45',
    dark: '#C25E00',
    glow: '#f97316',
    shadow: 'rgba(194, 94, 0, 0.5)',
  },
};

export default function GamePiece({
  piece,
  isSelected,
  isMatched,
  isInvalidSwap = false,
  isDragging = false,
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
    if (isDragging) {
      return {
        scale: 1.15,
        y: -5,
        rotate: 0,
        opacity: 1,
        filter: 'brightness(1.1)',
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
        className="relative w-full h-full cursor-pointer select-none"
        onClick={onClick}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={getAnimateState()}
        exit={{
          scale: 0,
          opacity: 0,
        }}
        transition={getTransition()}
        whileTap={!isAnimating ? { scale: 0.9 } : {}}
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
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

        {/* Drop shadow under the gumball */}
        <div
          className="absolute bottom-[-8%] left-[15%] right-[15%] h-[15%] rounded-full blur-sm"
          style={{
            background: colors.shadow,
            transform: 'scaleY(0.5)',
          }}
        />

        {/* Main gumball sphere */}
        <div
          className={`
            relative w-full h-full rounded-full
            transition-all duration-200
            ${isSelected ? 'ring-4 ring-yellow-300 ring-offset-2' : ''}
          `}
          style={{
            // 3D spherical gradient - darker at edges, lighter toward light source
            background: `
              radial-gradient(
                ellipse 50% 50% at 35% 30%,
                ${colors.light} 0%,
                ${colors.base} 40%,
                ${colors.dark} 100%
              )
            `,
            boxShadow: `
              inset -4px -4px 10px rgba(0, 0, 0, 0.3),
              inset 4px 4px 10px rgba(255, 255, 255, 0.15),
              0 4px 8px ${colors.shadow}
            `,
          }}
        >
          {/* Primary specular highlight - top left bright spot */}
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
                  rgba(255, 255, 255, 0.95) 0%,
                  rgba(255, 255, 255, 0.6) 30%,
                  transparent 70%
                )
              `,
            }}
          />

          {/* Secondary highlight - smaller, sharper reflection */}
          <div
            className="absolute rounded-full"
            style={{
              top: '8%',
              left: '22%',
              width: '18%',
              height: '18%',
              background: 'rgba(255, 255, 255, 0.9)',
              filter: 'blur(1px)',
            }}
          />

          {/* Rim light - subtle edge highlight */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(
                  ellipse 100% 100% at 50% 50%,
                  transparent 60%,
                  rgba(255, 255, 255, 0.1) 85%,
                  rgba(255, 255, 255, 0.2) 100%
                )
              `,
            }}
          />

          {/* Bottom reflection - like sitting on a surface */}
          <div
            className="absolute rounded-full"
            style={{
              bottom: '8%',
              left: '25%',
              width: '50%',
              height: '20%',
              background: `
                radial-gradient(
                  ellipse at 50% 100%,
                  rgba(255, 255, 255, 0.15) 0%,
                  transparent 70%
                )
              `,
            }}
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
        
        {/* Hover glow effect */}
        {isHovered && !isMatched && !isSelected && (
          <motion.div
            className="absolute inset-[-5%] rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle, ${colors.glow}40 0%, transparent 70%)`,
              filter: 'blur(4px)',
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
