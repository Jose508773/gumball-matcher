/**
 * Game UI Component
 * Design Philosophy: Candy Pop Maximalism
 * - Floating bubble UI with rounded corners
 * - Vibrant colors and playful styling
 * - Responsive design for mobile and desktop
 */

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
    <div className="w-full max-w-2xl mx-auto px-0.5 sm:px-0">
      {/* Header with level and score - combined row on mobile */}
      <div className="mb-0.5 sm:mb-2 md:mb-3 space-y-0.5 sm:space-y-1 md:space-y-2">
        {/* Level indicator and score in one row on mobile */}
        <div className="flex items-center justify-between sm:block sm:text-center">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-poppins font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            Level {level}
          </h1>
          <span className="font-fredoka font-bold text-xs sm:hidden text-primary">
            {score.toLocaleString()} / {targetScore.toLocaleString()}
          </span>
        </div>

        {/* Score progress bar */}
        <div className="space-y-0.5">
          <div className="hidden sm:flex justify-between items-center px-2 sm:px-4">
            <span className="font-fredoka font-semibold text-foreground text-sm">Score</span>
            <span className="font-fredoka font-bold text-sm text-primary">
              {score.toLocaleString()} / {targetScore.toLocaleString()}
            </span>
          </div>
          <div className="relative h-2.5 sm:h-4 md:h-5 bg-white rounded-full overflow-hidden border-2 sm:border-3 border-primary shadow-md">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${scoreProgress}%` }}
            />
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* Stats grid - very compact on mobile */}
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1 md:gap-2">
        {/* Lives */}
        <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-md sm:rounded-xl p-1 sm:p-2 md:p-3 shadow-md border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[7px] sm:text-[10px] font-fredoka font-semibold text-white/80 uppercase leading-none">Lives</p>
              <p className="text-base sm:text-xl md:text-2xl font-poppins font-bold text-white leading-tight">{lives}</p>
            </div>
            <Heart className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/60" fill="white" />
          </div>
        </div>

        {/* Timer */}
        <div
          className={`rounded-md sm:rounded-xl p-1 sm:p-2 md:p-3 shadow-md border border-white/30 ${
            isTimeRunningOut
              ? 'bg-gradient-to-br from-orange-400 to-red-500'
              : 'bg-gradient-to-br from-cyan-400 to-blue-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[7px] sm:text-[10px] font-fredoka font-semibold text-white/80 uppercase leading-none">Time</p>
              <p className="text-base sm:text-xl md:text-2xl font-poppins font-bold text-white leading-tight">{timeRemaining}s</p>
            </div>
            <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/60" />
          </div>
        </div>

        {/* Moves (if applicable) */}
        {moves !== undefined && (
          <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-md sm:rounded-xl p-1 sm:p-2 md:p-3 shadow-md border border-white/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[7px] sm:text-[10px] font-fredoka font-semibold text-white/80 uppercase leading-none">Moves</p>
                <p className="text-base sm:text-xl md:text-2xl font-poppins font-bold text-white leading-tight">{moves}</p>
              </div>
              <Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/60" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
