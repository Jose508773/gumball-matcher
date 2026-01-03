/**
 * Combo Effects Component
 * Design Philosophy: Candy Pop Maximalism
 * - Shows exciting combo text for chain reactions
 * - Candy-themed celebration effects
 * - Sweet visual feedback
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ComboEffect {
  id: string;
  type: 'combo' | 'sweet' | 'delicious' | 'amazing' | 'sugar_rush';
  x: number;
  y: number;
}

interface ComboEffectsProps {
  comboCount: number;
  trigger: boolean;
  position?: { x: number; y: number };
}

const COMBO_MESSAGES = [
  { min: 1, type: 'sweet', text: 'Sweet!', color: 'from-pink-400 to-pink-600' },
  { min: 2, type: 'delicious', text: 'Delicious!', color: 'from-orange-400 to-red-500' },
  { min: 3, type: 'amazing', text: 'Amazing!', color: 'from-yellow-400 to-orange-500' },
  { min: 4, type: 'sugar_rush', text: 'SUGAR RUSH!', color: 'from-purple-400 via-pink-500 to-red-500' },
] as const;

export default function ComboEffects({ 
  comboCount, 
  trigger, 
  position = { x: 50, y: 40 } 
}: ComboEffectsProps) {
  const [effects, setEffects] = useState<ComboEffect[]>([]);

  useEffect(() => {
    if (!trigger || comboCount < 1) return;

    const message = COMBO_MESSAGES.filter(m => comboCount >= m.min).pop();
    if (!message) return;

    const newEffect: ComboEffect = {
      id: `${Date.now()}-${Math.random()}`,
      type: message.type as ComboEffect['type'],
      x: position.x,
      y: position.y,
    };

    setEffects(prev => [...prev, newEffect]);

    const timer = setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== newEffect.id));
    }, 1500);

    return () => clearTimeout(timer);
  }, [trigger, comboCount, position]);

  const getMessage = (type: ComboEffect['type']) => {
    return COMBO_MESSAGES.find(m => m.type === type) || COMBO_MESSAGES[0];
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {effects.map(effect => {
          const message = getMessage(effect.type);
          return (
            <motion.div
              key={effect.id}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: `${effect.y}%` }}
              initial={{ 
                scale: 0, 
                opacity: 0, 
                y: 20,
                rotate: -10,
              }}
              animate={{ 
                scale: [0, 1.4, 1.2], 
                opacity: [0, 1, 1, 0],
                y: [20, 0, -30],
                rotate: [-10, 5, 0],
              }}
              exit={{ 
                scale: 0, 
                opacity: 0,
              }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                times: [0, 0.3, 0.6, 1],
              }}
            >
              {/* Glow background */}
              <motion.div
                className="absolute inset-0 blur-xl rounded-full"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,200,100,0.3))`,
                }}
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.5, 0.8, 0],
                }}
                transition={{ duration: 1 }}
              />
              
              {/* Main text */}
              <motion.span
                className={`
                  relative font-bold text-4xl md:text-6xl
                  bg-gradient-to-r ${message.color}
                  bg-clip-text text-transparent
                  drop-shadow-lg
                `}
                style={{
                  fontFamily: "'Fredoka One', 'Comic Sans MS', cursive",
                  WebkitTextStroke: '2px rgba(255,255,255,0.5)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                }}
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255,200,100,0.8)',
                    '0 0 40px rgba(255,150,50,1)',
                    '0 0 20px rgba(255,200,100,0.8)',
                  ],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2,
                }}
              >
                {message.text}
              </motion.span>

              {/* Candy decorations */}
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    x: Math.cos((i / 6) * Math.PI * 2) * 80,
                    y: Math.sin((i / 6) * Math.PI * 2) * 50,
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.05,
                    ease: 'easeOut',
                  }}
                >
                  {['🍬', '🍭', '🍫', '🍩', '🧁', '🍪'][i]}
                </motion.span>
              ))}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

