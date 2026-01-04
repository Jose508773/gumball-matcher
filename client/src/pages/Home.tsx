/**
 * Home Page Component
 * Design Philosophy: Candy Pop Maximalism
 * - Vibrant, welcoming game start screen
 * - Playful animations and colorful design
 * - Fully responsive for mobile and desktop
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();

  const handleStartGame = () => {
    setLocation('/game');
  };

  return (
    <div
      className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-pink-200 via-purple-200 to-cyan-200 flex flex-col items-center justify-center px-3 py-4 sm:px-4 sm:py-6"
      style={{
        backgroundImage: `url('/images/game-background.png')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header banner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-4 sm:mb-6 md:mb-8"
        >
          <div
            className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border-4 sm:border-6 md:border-8 border-white"
            style={{
              backgroundImage: `url('/images/ui-header-banner.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-white drop-shadow-lg mb-1 sm:mb-2">
                Gumball Matcher
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-fredoka font-semibold text-white/90 drop-shadow-md">
                Candy Pop Mania
              </p>
            </div>
          </div>
        </motion.div>

        {/* Game description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-white/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border-2 sm:border-4 border-primary"
        >
          <h2 className="text-xl sm:text-2xl font-poppins font-bold text-primary mb-2 sm:mb-4">Welcome!</h2>
          <p className="text-sm sm:text-base md:text-lg font-fredoka text-foreground leading-relaxed mb-3 sm:mb-4">
            Match three or more gumballs of the same color to clear them. Earn points,
            complete levels, and challenge yourself!
          </p>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-white">
              <p className="font-fredoka font-bold text-xs sm:text-sm uppercase">Lives</p>
              <p className="text-lg sm:text-xl md:text-2xl font-poppins font-bold">3</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-white">
              <p className="font-fredoka font-bold text-xs sm:text-sm uppercase">Time</p>
              <p className="text-lg sm:text-xl md:text-2xl font-poppins font-bold">2 min</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-white">
              <p className="font-fredoka font-bold text-xs sm:text-sm uppercase">Target</p>
              <p className="text-lg sm:text-xl md:text-2xl font-poppins font-bold">1000+</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-white">
              <p className="font-fredoka font-bold text-xs sm:text-sm uppercase">Levels</p>
              <p className="text-lg sm:text-xl md:text-2xl font-poppins font-bold">∞</p>
            </div>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="pt-2 sm:pt-4"
        >
          <Button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-fredoka font-bold text-lg sm:text-xl py-5 sm:py-6 md:py-8 rounded-xl sm:rounded-2xl shadow-lg border-2 sm:border-4 border-white flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-95 hover:scale-105"
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            Start Game
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
