/**
 * Game Modals Component
 * Design Philosophy: Candy Pop Maximalism
 * - Celebratory candy-themed design for level completion
 * - Encouraging design for game over
 * - Glossy candy effects and sweet gradients
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw, ChevronRight, Star, Sparkles } from 'lucide-react';

interface LevelCompleteModalProps {
  isOpen: boolean;
  level: number;
  score: number;
  targetScore: number;
  onNextLevel: () => void;
  onRetry: () => void;
}

export function LevelCompleteModal({
  isOpen,
  level,
  score,
  targetScore,
  onNextLevel,
  onRetry,
}: LevelCompleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Animated background sparkles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-yellow-300"
                style={{
                  left: `${10 + (i % 6) * 15}%`,
                  top: `${20 + Math.floor(i / 6) * 40}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + i * 0.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          <motion.div
            className="relative max-w-md w-full mx-4"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Outer candy wrapper with rainbow border */}
            <motion.div
              className="absolute -inset-1 rounded-[2rem] opacity-75"
              style={{
                background: 'linear-gradient(90deg, #FF6B6B, #FFE66D, #4ECDC4, #A78BFA, #F472B6, #FF6B6B)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Main card */}
            <div className="relative bg-gradient-to-b from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-1 shadow-2xl">
              {/* Inner glossy container */}
              <div className="bg-gradient-to-b from-white/20 to-transparent rounded-[1.4rem] p-6">
                {/* Candy shine effect */}
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none" />

                {/* Header with stars */}
                <div className="relative text-center mb-6">
                  <motion.div
                    className="flex justify-center gap-2 mb-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -5, 0],
                          rotate: [-5, 5, -5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      >
                        <Star className="w-8 h-8 text-yellow-300 fill-yellow-300 drop-shadow-lg" />
                      </motion.div>
                    ))}
                  </motion.div>

                  <h2 
                    className="text-3xl font-bold text-white drop-shadow-lg"
                    style={{ fontFamily: "'Fredoka One', cursive" }}
                  >
                    Level {level} Complete!
                  </h2>
                </div>

                {/* Score display - candy bar style */}
                <div className="relative bg-white/90 rounded-2xl p-5 mb-6 shadow-inner">
                  {/* Candy stripe decoration */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-t-2xl" />
                  
                  <div className="text-center pt-2">
                    <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-1">
                      Your Score
                    </p>
                    <motion.p 
                      className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring' }}
                    >
                      {score.toLocaleString()}
                    </motion.p>
                    <p className="text-sm text-gray-500 mt-1">
                      Target: {targetScore.toLocaleString()}
                    </p>
                  </div>

                  {score >= targetScore && (
                    <motion.div
                      className="flex items-center justify-center gap-2 mt-3 text-amber-500 font-semibold"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Sweet Victory!</span>
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  )}
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onNextLevel}
                      className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-bold text-lg py-6 rounded-2xl shadow-lg border-2 border-white/30 flex items-center justify-center gap-2"
                    >
                      <span>Next Level</span>
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onRetry}
                      variant="ghost"
                      className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold text-base py-5 rounded-2xl flex items-center justify-center gap-2 border border-white/20"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Play Again</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface GameOverModalProps {
  isOpen: boolean;
  level: number;
  score: number;
  maxLevel: number;
  onRetry: () => void;
  onHome: () => void;
}

export function GameOverModal({
  isOpen,
  level,
  score,
  maxLevel,
  onRetry,
  onHome,
}: GameOverModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative max-w-md w-full mx-4"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Outer candy wrapper border */}
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-b from-red-400 via-orange-400 to-amber-400 opacity-75" />

            {/* Main card */}
            <div className="relative bg-gradient-to-b from-rose-500 via-red-500 to-orange-500 rounded-3xl p-1 shadow-2xl">
              {/* Inner glossy container */}
              <div className="bg-gradient-to-b from-white/20 to-transparent rounded-[1.4rem] p-6">
                {/* Candy shine effect */}
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none" />

                {/* Header */}
                <div className="relative text-center mb-6">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-inner">
                      <span className="text-2xl font-bold text-white">!</span>
                    </div>
                  </motion.div>

                  <h2 
                    className="text-3xl font-bold text-white drop-shadow-lg"
                    style={{ fontFamily: "'Fredoka One', cursive" }}
                  >
                    Game Over
                  </h2>
                  <p className="text-white/80 mt-1 font-medium">Don't give up!</p>
                </div>

                {/* Stats display */}
                <div className="relative bg-white/90 rounded-2xl p-5 mb-6 shadow-inner">
                  {/* Candy stripe decoration */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 rounded-t-2xl" />
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
                        Level
                      </p>
                      <p className="text-3xl font-bold text-gray-800">
                        {level}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
                        Score
                      </p>
                      <p className="text-3xl font-bold text-gray-800">
                        {score.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {level > 1 && (
                    <motion.p
                      className="text-center text-amber-600 font-medium text-sm mt-3 pt-3 border-t border-gray-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Great run! You made it to level {level}!
                    </motion.p>
                  )}
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onRetry}
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-lg py-6 rounded-2xl shadow-lg border-2 border-white/30 flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Try Again</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onHome}
                      variant="ghost"
                      className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold text-base py-5 rounded-2xl flex items-center justify-center gap-2 border border-white/20"
                    >
                      <span>Back to Menu</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
