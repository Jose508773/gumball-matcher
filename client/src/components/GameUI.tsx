/**
 * Game UI Component
 * Design Philosophy: Candy Pop Maximalism
 * - Floating bubble UI with rounded corners
 * - Vibrant colors and playful styling
 * - Clear information hierarchy
 */

import { motion } from 'framer-motion';
import { Heart, Clock, Zap } from 'lucide-react';

interface GameUIProps {
  score: number;
  targetScore: number;
  lives: number;
  timeRemaining: number;
  level: number;
  moves?: number;
}

export default function GameUI({
  score,
  targetScore,
  lives,
  timeRemaining,
  level,
  moves,
}: GameUIProps) {
  const isTimeRunningOut = timeRemaining < 30;
  const scoreProgress = Math.min((score / targetScore) * 100, 100);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header with level and score */}
      <div className="mb-6 space-y-4">
        {/* Level indicator */}
        <motion.div
          className="text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl font-poppins font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            Level {level}
          </h1>
        </motion.div>

        {/* Score progress bar */}
        <motion.div
          className="space-y-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center px-4">
            <span className="font-fredoka font-semibold text-foreground">Score</span>
            <span className="font-fredoka font-bold text-lg text-primary">
              {score} / {targetScore}
            </span>
          </div>
          <div className="relative h-6 bg-white rounded-full overflow-hidden border-4 border-primary shadow-lg">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scoreProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Lives */}
        <motion.div
          className="bg-gradient-to-br from-red-400 to-red-500 rounded-2xl p-4 shadow-lg border-4 border-white/30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-fredoka font-semibold text-white/80 uppercase">Lives</p>
              <p className="text-3xl font-poppins font-bold text-white">{lives}</p>
            </div>
            <Heart className="w-8 h-8 text-white/60" fill="white" />
          </div>
        </motion.div>

        {/* Timer */}
        <motion.div
          className={`rounded-2xl p-4 shadow-lg border-4 border-white/30 ${
            isTimeRunningOut
              ? 'bg-gradient-to-br from-orange-400 to-red-500 animate-pulse'
              : 'bg-gradient-to-br from-cyan-400 to-blue-500'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-fredoka font-semibold text-white/80 uppercase">Time</p>
              <p className="text-3xl font-poppins font-bold text-white">{timeRemaining}s</p>
            </div>
            <Clock className="w-8 h-8 text-white/60" />
          </div>
        </motion.div>

        {/* Moves (if applicable) */}
        {moves !== undefined && (
          <motion.div
            className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-4 shadow-lg border-4 border-white/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-fredoka font-semibold text-white/80 uppercase">Moves</p>
                <p className="text-3xl font-poppins font-bold text-white">{moves}</p>
              </div>
              <Zap className="w-8 h-8 text-white/60" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
