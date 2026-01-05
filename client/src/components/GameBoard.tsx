/**
 * Game Board Component
 * Design Philosophy: Candy Pop Maximalism
 * - Rounded, soft geometry
 * - Layered depth with shadows
 * - Fully responsive for mobile and desktop
 * - Touch-optimized interactions with swipe support
 */

import { GamePiece as GamePieceType } from '@/lib/gameLogic';
import GamePiece from './GamePiece';
import { motion } from 'framer-motion';
import { forwardRef, useImperativeHandle, useRef, useCallback, useState } from 'react';

interface GameBoardProps {
  board: GamePieceType[][];
  selectedPiece: { row: number; col: number } | null;
  matchedPieces: Set<string>;
  invalidSwapPieces?: Set<string>;
  onPieceClick: (row: number, col: number) => void;
  onSwap?: (from: { row: number; col: number }, to: { row: number; col: number }) => void;
  isAnimating: boolean;
}

export interface GameBoardRef {
  getPiecePosition: (row: number, col: number) => { x: number; y: number } | null;
  getBoardRect: () => DOMRect | null;
}

// Minimum swipe distance to trigger a swap (in pixels)
const MIN_SWIPE_DISTANCE = 20;

const GameBoard = forwardRef<GameBoardRef, GameBoardProps>(function GameBoard({
  board,
  selectedPiece,
  matchedPieces,
  invalidSwapPieces = new Set(),
  onPieceClick,
  onSwap,
  isAnimating,
}, ref) {
  const gridSize = board.length;
  const boardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Swipe tracking state
  const [dragStart, setDragStart] = useState<{
    row: number;
    col: number;
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  // Calculate responsive gap based on grid size
  const getGapClass = () => {
    if (gridSize >= 9) return 'gap-0.5 sm:gap-1';
    if (gridSize >= 8) return 'gap-1 sm:gap-1.5';
    return 'gap-1 sm:gap-1.5 md:gap-2';
  };

  // Get cell position from screen coordinates
  const getCellFromPoint = useCallback((clientX: number, clientY: number): { row: number; col: number } | null => {
    if (!gridRef.current) return null;
    
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellWidth = gridRect.width / gridSize;
    const cellHeight = gridRect.height / gridSize;
    
    const col = Math.floor((clientX - gridRect.left) / cellWidth);
    const row = Math.floor((clientY - gridRect.top) / cellHeight);
    
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      return { row, col };
    }
    return null;
  }, [gridSize]);

  // Handle drag/swipe start
  const handleDragStart = useCallback((row: number, col: number, clientX: number, clientY: number) => {
    if (isAnimating) return;
    setDragStart({ row, col, x: clientX, y: clientY });
    setIsDragging(true);
  }, [isAnimating]);

  // Handle drag/swipe move and end
  const handleDragEnd = useCallback((clientX: number, clientY: number) => {
    if (!dragStart || !onSwap || isAnimating) {
      setDragStart(null);
      setIsDragging(false);
      return;
    }

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Check if swipe distance is enough
    if (Math.max(absX, absY) >= MIN_SWIPE_DISTANCE) {
      let targetRow = dragStart.row;
      let targetCol = dragStart.col;

      // Determine swipe direction (prioritize the dominant axis)
      if (absX > absY) {
        // Horizontal swipe
        targetCol = deltaX > 0 ? dragStart.col + 1 : dragStart.col - 1;
      } else {
        // Vertical swipe
        targetRow = deltaY > 0 ? dragStart.row + 1 : dragStart.row - 1;
      }

      // Check bounds
      if (targetRow >= 0 && targetRow < gridSize && targetCol >= 0 && targetCol < gridSize) {
        onSwap(
          { row: dragStart.row, col: dragStart.col },
          { row: targetRow, col: targetCol }
        );
      }
    }

    setDragStart(null);
    setIsDragging(false);
  }, [dragStart, onSwap, isAnimating, gridSize]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent, row: number, col: number) => {
    const touch = e.touches[0];
    handleDragStart(row, col, touch.clientX, touch.clientY);
  }, [handleDragStart]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      handleDragEnd(touch.clientX, touch.clientY);
    }
  }, [handleDragEnd]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    handleDragStart(row, col, e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      handleDragEnd(e.clientX, e.clientY);
    }
  }, [isDragging, handleDragEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setDragStart(null);
      setIsDragging(false);
    }
  }, [isDragging]);

  return (
    <div
      ref={boardRef}
      className="w-full max-w-[min(94vw,calc(100dvh-140px))] sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto aspect-square"
    >
      {/* Rainbow candy border - simplified for performance */}
      <div
        className="p-0.5 sm:p-1 md:p-1.5 rounded-xl sm:rounded-2xl md:rounded-3xl h-full animate-gradient-slow"
        style={{
          background: 'linear-gradient(90deg, #FF6B6B, #FFE66D, #4ECDC4, #A78BFA, #F472B6, #FF6B6B)',
          backgroundSize: '300% 100%',
        }}
      >
        {/* Board container with rounded frame */}
        <div
          className={`
            relative rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden
            bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900
            p-0.5 sm:p-1 md:p-2 shadow-xl
            border sm:border-2 border-white/30
            h-full
          `}
          style={{
            backgroundImage: `url('/images/game-background.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            touchAction: 'manipulation', // Smoother touch handling
          }}
        >
          {/* Dark overlay for better piece visibility */}
          <div className="absolute inset-0 bg-black/20 rounded-lg sm:rounded-xl" />

          {/* Grid container */}
          <div className="relative w-full h-full">
            <div
              ref={gridRef}
              className={`w-full h-full grid ${getGapClass()} p-0.5 sm:p-1 md:p-2 bg-black/30 rounded-md sm:rounded-lg md:rounded-xl`}
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              }}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => (
                  <div
                    key={piece.id}
                    className={`relative aspect-square cursor-grab active:cursor-grabbing transition-transform duration-100 ${
                      dragStart?.row === rowIndex && dragStart?.col === colIndex && isDragging 
                        ? 'scale-110 z-10' 
                        : ''
                    }`}
                    onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                  >
                    <GamePiece
                      piece={piece}
                      isSelected={
                        selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex
                      }
                      isMatched={matchedPieces.has(piece.id)}
                      isInvalidSwap={invalidSwapPieces.has(piece.id)}
                      onClick={() => !isDragging && onPieceClick(rowIndex, colIndex)}
                      isAnimating={isAnimating}
                      isDragging={dragStart?.row === rowIndex && dragStart?.col === colIndex && isDragging}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GameBoard;
