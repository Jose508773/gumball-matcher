/**
 * Home Page Component
 * Design Philosophy: Candy Pop Maximalism
 * - Vibrant, welcoming game start screen
 * - Playful animations and colorful design
 * - Clear call-to-action
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
      className="min-h-screen bg-gradient-to-b from-pink-200 via-purple-200 to-cyan-200 flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage: `url('/images/game-background.png')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* Header banner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <div
            className="rounded-3xl p-8 shadow-2xl border-8 border-white"
            style={{
              backgroundImage: `url('/images/ui-header-banner.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="text-center">
              <h1 className="text-6xl font-poppins font-bold text-white drop-shadow-lg mb-2">
                Match Three
              </h1>
              <p className="text-2xl font-fredoka font-semibold text-white/90 drop-shadow-md">
                Candy Pop Mania
              </p>
            </div>
          </div>
        </motion.div>

        {/* Game description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/90 rounded-3xl p-8 shadow-xl border-4 border-primary"
        >
          <h2 className="text-2xl font-poppins font-bold text-primary mb-4">Welcome!</h2>
          <p className="text-lg font-fredoka text-foreground leading-relaxed mb-4">
            Match three or more pieces of the same color to clear them from the board. Earn points,
            complete levels, and challenge yourself with increasingly difficult puzzles!
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl p-4 text-white">
              <p className="font-fredoka font-bold text-sm uppercase">Lives</p>
              <p className="text-2xl font-poppins font-bold">3</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl p-4 text-white">
              <p className="font-fredoka font-bold text-sm uppercase">Time Limit</p>
              <p className="text-2xl font-poppins font-bold">2 min</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-4 text-white">
              <p className="font-fredoka font-bold text-sm uppercase">Score Target</p>
              <p className="text-2xl font-poppins font-bold">1000+</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl p-4 text-white">
              <p className="font-fredoka font-bold text-sm uppercase">Levels</p>
              <p className="text-2xl font-poppins font-bold">∞</p>
            </div>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="pt-4"
        >
          <Button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-fredoka font-bold text-xl py-8 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center gap-3 transition-all hover:scale-105"
          >
            <Play className="w-7 h-7" />
            Start Game
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
