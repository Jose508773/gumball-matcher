/**
 * Game Board Component
 * Design Philosophy: Candy Pop Maximalism
 * - Rounded, soft geometry
 * - Layered depth with shadows
 * - Responsive grid layout
 */

import { GamePiece as GamePieceType } from '@/lib/gameLogic';
import GamePiece from './GamePiece';
import { motion } from 'framer-motion';
import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';

interface GameBoardProps {
  board: GamePieceType[][];
  selectedPiece: { row: number; col: number } | null;
  matchedPieces: Set<string>;
  invalidSwapPieces?: Set<string>;
  onPieceClick: (row: number, col: number) => void;
  isAnimating: boolean;
}

export interface GameBoardRef {
  getPiecePosition: (row: number, col: number) => { x: number; y: number } | null;
  getBoardRect: () => DOMRect | null;
}

const GameBoard = forwardRef<GameBoardRef, GameBoardProps>(function GameBoard({
  board,
  selectedPiece,
  matchedPieces,
  invalidSwapPieces = new Set(),
  onPieceClick,
  isAnimating,
}, ref) {
  const gridSize = board.length;
  const boardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Calculate the position of a piece in screen coordinates
  const getPiecePosition = useCallback((row: number, col: number): { x: number; y: number } | null => {
    if (!gridRef.current) return null;
    
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellWidth = gridRect.width / gridSize;
    const cellHeight = gridRect.height / gridSize;
    
    return {
      x: gridRect.left + (col + 0.5) * cellWidth,
      y: gridRect.top + (row + 0.5) * cellHeight,
    };
  }, [gridSize]);

  const getBoardRect = useCallback((): DOMRect | null => {
    return boardRef.current?.getBoundingClientRect() || null;
  }, []);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getPiecePosition,
    getBoardRect,
  }), [getPiecePosition, getBoardRect]);

  return (
    <motion.div
      ref={boardRef}
      className="w-full max-w-2xl mx-auto"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Rainbow candy border animation */}
      <motion.div
        className="p-2 rounded-[2rem]"
        style={{
          background: 'linear-gradient(90deg, #FF6B6B, #FFE66D, #4ECDC4, #A78BFA, #F472B6, #FF6B6B)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Board container with rounded frame */}
        <div
          className={`
            relative rounded-3xl overflow-hidden
            bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900
            p-6 shadow-2xl
            border-4 border-white/30
            aspect-square
          `}
          style={{
            backgroundImage: `url('/images/game-background.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Candy shimmer overlay */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['-100% -100%', '200% 200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Dark overlay for better piece visibility */}
          <div className="absolute inset-0 bg-black/20 rounded-2xl" />

          {/* Floating candy decorations */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`candy-${i}`}
              className="absolute pointer-events-none text-2xl"
              style={{
                left: `${10 + (i % 3) * 40}%`,
                top: `${i < 3 ? -5 : 102}%`,
              }}
              animate={{
                y: [0, -8, 0],
                rotate: [-10, 10, -10],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            >
              {['🍬', '🍭', '🍫', '🧁', '🍩', '🍪'][i]}
            </motion.div>
          ))}

          {/* Grid container */}
          <div className="relative w-full h-full">
            <div
              ref={gridRef}
              className="w-full h-full grid gap-2 p-4 bg-black/30 rounded-2xl backdrop-blur-sm"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => (
                  <motion.div
                    key={piece.id}
                    className="relative aspect-square"
                    initial={{ scale: 0, y: -50, rotate: -180 }}
                    animate={{ scale: 1, y: 0, rotate: 0 }}
                    transition={{
                      delay: (rowIndex + colIndex) * 0.015,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      mass: 0.8,
                    }}
                  >
                    <GamePiece
                      piece={piece}
                      isSelected={
                        selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex
                      }
                      isMatched={matchedPieces.has(piece.id)}
                      isInvalidSwap={invalidSwapPieces.has(piece.id)}
                      onClick={() => onPieceClick(rowIndex, colIndex)}
                      isAnimating={isAnimating}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default GameBoard;
