/**
 * Game Page Component
 * Design Philosophy: Candy Pop Maximalism
 * - Complete match-three game implementation
 * - Responsive layout with animations
 * - Vibrant, playful user experience
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import GameBoard, { GameBoardRef } from '@/components/GameBoard';
import GameUI from '@/components/GameUI';
import ParticleEffects, { ParticlePosition } from '@/components/ParticleEffects';
import FloatingPoints, { MatchPosition } from '@/components/FloatingPoints';
import ComboEffects from '@/components/ComboEffects';
import { LevelCompleteModal, GameOverModal } from '@/components/GameModals';
import { Button } from '@/components/ui/button';
import {
  GameState,
  GamePiece,
  initializeBoard,
  areAdjacent,
  swapPieces,
  findMatches,
  findMatchPositions,
  removeMatchedAndApplyGravity,
  getLevelConfig,
  calculateScore,
  isLevelComplete,
  isGameOver,
} from '@/lib/gameLogic';
import { Home } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Game() {
  const [, setLocation] = useLocation();
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(false);
  const [particlePositions, setParticlePositions] = useState<ParticlePosition[]>([]);
  const [floatingPointsTrigger, setFloatingPointsTrigger] = useState(false);
  const [matchPositions, setMatchPositions] = useState<MatchPosition[]>([]);
  const [invalidSwapPieces, setInvalidSwapPieces] = useState<Set<string>>(new Set());
  const [comboCount, setComboCount] = useState(0);
  const [comboTrigger, setComboTrigger] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const matchCheckRef = useRef<NodeJS.Timeout | null>(null);
  const gameBoardRef = useRef<GameBoardRef>(null);
  const pendingSwapRef = useRef<{
    pos1: { row: number; col: number };
    pos2: { row: number; col: number };
    originalBoard: GamePiece[][];
  } | null>(null);
  const comboCountRef = useRef(0);
  const screenShakeControls = useAnimation();

  // Initialize game
  useEffect(() => {
    const config = getLevelConfig(level);
    const newBoard = initializeBoard(config.gridSize);

    setGameState({
      board: newBoard,
      score: 0,
      lives: config.initialLives,
      timeRemaining: config.timeLimit,
      level,
      moves: 0,
      selectedPiece: null,
      isAnimating: false,
      gameOver: false,
      levelComplete: false,
      matchedPieces: new Set(),
    });
  }, [level]);

  // Game loop - timer countdown
  useEffect(() => {
    if (!gameState || gameState.gameOver || gameState.levelComplete) return;

    gameLoopRef.current = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev;

        const newTimeRemaining = prev.timeRemaining - 1;

        if (newTimeRemaining <= 0) {
          return {
            ...prev,
            timeRemaining: 0,
            gameOver: true,
          };
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState?.gameOver, gameState?.levelComplete]);

  // Check for matches after board changes or when animation ends
  useEffect(() => {
    if (!gameState || gameState.isAnimating || gameState.gameOver || gameState.levelComplete)
      return;

    matchCheckRef.current = setTimeout(() => {
      // Check matches outside of setState to avoid side effects inside callback
      const matchedIds = findMatches(gameState.board);
      const matchGroups = findMatchPositions(gameState.board);

      if (matchedIds.size > 0 && matchGroups.length > 0) {
        // Clear pending swap since we have a valid match
        pendingSwapRef.current = null;

        // Increment combo counter
        comboCountRef.current += 1;
        const currentCombo = comboCountRef.current;
        setComboCount(currentCombo);

        // Calculate score for effects
        const scoreGain = calculateScore(matchedIds.size);
        const scorePerGroup = Math.floor(scoreGain / matchGroups.length);

        // Calculate actual screen positions for each match group
        const newParticlePositions: ParticlePosition[] = [];
        const newMatchPositions: MatchPosition[] = [];

        matchGroups.forEach((group, index) => {
          // Get the center position of this match group in screen coordinates
          const screenPos = gameBoardRef.current?.getPiecePosition(
            Math.round(group.centerRow),
            Math.round(group.centerCol)
          );

          if (screenPos) {
            // Add particle burst position
            newParticlePositions.push({
              x: screenPos.x,
              y: screenPos.y,
            });

            // Add floating points position with score
            // Give bonus points for larger matches (4+ in a row)
            const groupScore = group.pieceCount > 3 
              ? Math.floor(scorePerGroup * (1 + (group.pieceCount - 3) * 0.3))
              : scorePerGroup;
            
            newMatchPositions.push({
              x: screenPos.x,
              y: screenPos.y,
              points: index === 0 ? scoreGain : groupScore, // Show total on first, individual on others
            });
          }
        });

        // Trigger particle effects at match positions
        setParticlePositions(newParticlePositions);
        setParticleTrigger(true);
        setTimeout(() => setParticleTrigger(false), 100);

        // Trigger floating points at match positions
        setMatchPositions(newMatchPositions.length > 0 ? [newMatchPositions[0]] : []); // Show total score once
        setFloatingPointsTrigger(true);
        setTimeout(() => setFloatingPointsTrigger(false), 100);

        // Trigger combo effect for cascades
        if (currentCombo >= 2) {
          setComboTrigger(true);
          setTimeout(() => setComboTrigger(false), 100);
        }

        // Screen shake for big matches (5+ pieces or combo 3+)
        if (matchedIds.size >= 5 || currentCombo >= 3) {
          const shakeIntensity = Math.min(matchedIds.size, 10);
          screenShakeControls.start({
            x: [0, -shakeIntensity, shakeIntensity, -shakeIntensity/2, shakeIntensity/2, 0],
            y: [0, shakeIntensity/2, -shakeIntensity/2, shakeIntensity/3, 0],
            transition: { duration: 0.4, ease: 'easeOut' },
          });
        }

        // Update game state with matches
        setGameState(prev => {
          if (!prev || prev.isAnimating) return prev;
          return {
            ...prev,
            matchedPieces: matchedIds,
            isAnimating: true,
          };
        });
      } else {
        // No matches found - reset combo counter
        comboCountRef.current = 0;
        setComboCount(0);
      }
      
      if (pendingSwapRef.current && matchedIds.size === 0) {
        // No match found after a swap - this is an invalid swap
        // Get the piece IDs that were swapped
        const { pos1, pos2, originalBoard } = pendingSwapRef.current;
        const piece1Id = gameState.board[pos1.row][pos1.col].id;
        const piece2Id = gameState.board[pos2.row][pos2.col].id;

        // Show invalid swap animation
        setInvalidSwapPieces(new Set([piece1Id, piece2Id]));

        // After shake animation, swap back and decrease lives
        setTimeout(() => {
          setInvalidSwapPieces(new Set());
          setGameState(prev => {
            if (!prev) return prev;
            const newLives = prev.lives - 1;
            return {
              ...prev,
              board: originalBoard,
              lives: newLives,
              isAnimating: false,
              gameOver: newLives <= 0,
            };
          });
          pendingSwapRef.current = null;
        }, 500);
      }
    }, 200);

    return () => {
      if (matchCheckRef.current) clearTimeout(matchCheckRef.current);
    };
  }, [gameState?.board, gameState?.isAnimating]);

  // Remove matched pieces and apply gravity
  useEffect(() => {
    if (!gameState || !gameState.isAnimating || gameState.matchedPieces.size === 0) return;

    // Faster removal - 350ms to match the faster disappear animation
    const timer = setTimeout(() => {
      setGameState(prev => {
        if (!prev) return prev;

        const scoreGain = calculateScore(prev.matchedPieces.size);
        const newBoard = removeMatchedAndApplyGravity(prev.board, prev.matchedPieces);
        const newScore = prev.score + scoreGain;
        const config = getLevelConfig(prev.level);

        // Check if level is complete
        if (isLevelComplete(newScore, config.targetScore, prev.lives)) {
          return {
            ...prev,
            board: newBoard,
            score: newScore,
            matchedPieces: new Set(),
            isAnimating: false,
            levelComplete: true,
          };
        }

        return {
          ...prev,
          board: newBoard,
          score: newScore,
          matchedPieces: new Set(),
          isAnimating: false,
        };
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [gameState?.isAnimating]);

  // Handle piece click
  const handlePieceClick = useCallback(
    (row: number, col: number) => {
      if (!gameState || gameState.isAnimating || gameState.gameOver || gameState.levelComplete)
        return;

      const newSelectedPiece = { row, col };

      if (!gameState.selectedPiece) {
        // Select first piece
        setGameState(prev => ({
          ...prev!,
          selectedPiece: newSelectedPiece,
        }));
      } else if (
        gameState.selectedPiece.row === row &&
        gameState.selectedPiece.col === col
      ) {
        // Deselect piece
        setGameState(prev => ({
          ...prev!,
          selectedPiece: null,
        }));
      } else if (areAdjacent(gameState.selectedPiece, newSelectedPiece)) {
        // Store the original board before swapping (for potential swap-back)
        pendingSwapRef.current = {
          pos1: gameState.selectedPiece,
          pos2: newSelectedPiece,
          originalBoard: gameState.board.map(row => [...row]),
        };

        // Swap pieces
        const newBoard = swapPieces(gameState.board, gameState.selectedPiece, newSelectedPiece);

        setGameState(prev => ({
          ...prev!,
          board: newBoard,
          selectedPiece: null,
          moves: prev!.moves + 1,
          isAnimating: true,
        }));

        // Reset animation flag after a short delay to allow match checking
        setTimeout(() => {
          setGameState(prev => ({
            ...prev!,
            isAnimating: false,
          }));
        }, 150);
      } else {
        // Select new piece
        setGameState(prev => ({
          ...prev!,
          selectedPiece: newSelectedPiece,
        }));
      }
    },
    [gameState]
  );

  // Handle next level
  const handleNextLevel = () => {
    setShowLevelComplete(false);
    setLevel(prev => prev + 1);
  };

  // Handle retry level - force reset by toggling level
  const handleRetryLevel = () => {
    setShowLevelComplete(false);
    setShowGameOver(false);
    // Force re-initialization by resetting game state directly
    const config = getLevelConfig(level);
    const newBoard = initializeBoard(config.gridSize);
    setGameState({
      board: newBoard,
      score: 0,
      lives: config.initialLives,
      timeRemaining: config.timeLimit,
      level,
      moves: 0,
      selectedPiece: null,
      isAnimating: false,
      gameOver: false,
      levelComplete: false,
      matchedPieces: new Set(),
    });
  };

  // Handle home button
  const handleHome = () => {
    setShowGameOver(false);
    setLocation('/');
  };

  // Show modals when game state changes
  useEffect(() => {
    if (gameState?.levelComplete) {
      setShowLevelComplete(true);
    }
  }, [gameState?.levelComplete]);

  useEffect(() => {
    if (gameState?.gameOver) {
      setShowGameOver(true);
    }
  }, [gameState?.gameOver]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-200 via-purple-200 to-cyan-200 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-4xl"
        >
          🎮
        </motion.div>
      </div>
    );
  }

  const config = getLevelConfig(gameState.level);

  return (
    <motion.div
      animate={screenShakeControls}
      className="min-h-screen bg-gradient-to-b from-pink-200 via-purple-200 to-cyan-200 py-6 px-4"
      style={{
        backgroundImage: `url('/images/game-background.png')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Home button */}
      <div className="max-w-2xl mx-auto mb-4 flex justify-end">
        <Button
          onClick={handleHome}
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 border-4 border-white bg-white/80 hover:bg-white shadow-lg"
        >
          <Home className="w-6 h-6 text-primary" />
        </Button>
      </div>

      {/* Game UI */}
      <GameUI
        score={gameState.score}
        targetScore={config.targetScore}
        lives={gameState.lives}
        timeRemaining={gameState.timeRemaining}
        level={gameState.level}
        moves={gameState.moves}
      />

      {/* Game Board */}
      <div className="mt-8">
        <GameBoard
          ref={gameBoardRef}
          board={gameState.board}
          selectedPiece={gameState.selectedPiece}
          matchedPieces={gameState.matchedPieces}
          invalidSwapPieces={invalidSwapPieces}
          onPieceClick={handlePieceClick}
          isAnimating={gameState.isAnimating}
        />
      </div>

      {/* Particle Effects at match positions */}
      <ParticleEffects 
        trigger={particleTrigger} 
        positions={particlePositions}
        type="match" 
      />

      {/* Floating Points at match positions */}
      <FloatingPoints 
        trigger={floatingPointsTrigger} 
        points={matchPositions[0]?.points || 0}
        position={matchPositions[0] || { x: window.innerWidth / 2, y: window.innerHeight / 2 }}
        matchPositions={matchPositions}
      />

      {/* Combo Effects */}
      <ComboEffects
        comboCount={comboCount}
        trigger={comboTrigger}
      />

      {/* Modals */}
      <LevelCompleteModal
        isOpen={showLevelComplete}
        level={gameState.level}
        score={gameState.score}
        targetScore={config.targetScore}
        onNextLevel={handleNextLevel}
        onRetry={handleRetryLevel}
      />

      <GameOverModal
        isOpen={showGameOver}
        level={gameState.level}
        score={gameState.score}
        maxLevel={gameState.level}
        onRetry={handleRetryLevel}
        onHome={handleHome}
      />
    </motion.div>
  );
}
