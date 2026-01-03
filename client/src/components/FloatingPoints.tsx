/**
 * Floating Points Component
 * Design Philosophy: Candy Pop Maximalism
 * - Quick, satisfying point feedback
 * - Floating text animation upward
 * - Celebratory styling with sparkle effects
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingPoint {
  id: string;
  points: number;
  x: number;
  y: number;
  delay: number;
  size: 'small' | 'medium' | 'large';
}

export interface MatchPosition {
  x: number;
  y: number;
  points: number;
}

interface FloatingPointsProps {
  points: number;
  position: { x: number; y: number };
  trigger: boolean;
  // New prop for multiple match positions
  matchPositions?: MatchPosition[];
}

export default function FloatingPoints({ 
  points, 
  position, 
  trigger,
  matchPositions = [],
}: FloatingPointsProps) {
  const [floatingPoints, setFloatingPoints] = useState<FloatingPoint[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const newPoints: FloatingPoint[] = [];

    // If we have specific match positions, create floating points at each
    if (matchPositions.length > 0) {
      matchPositions.forEach((pos, index) => {
        newPoints.push({
          id: `${Date.now()}-${index}-${Math.random()}`,
          points: pos.points,
          x: pos.x,
          y: pos.y,
          delay: index * 0.05, // Stagger the animations slightly
          size: pos.points >= 50 ? 'large' : pos.points >= 30 ? 'medium' : 'small',
        });
      });
    } else {
      // Fallback to single position
      newPoints.push({
        id: `${Date.now()}-${Math.random()}`,
        points,
        x: position.x,
        y: position.y,
        delay: 0,
        size: points >= 50 ? 'large' : points >= 30 ? 'medium' : 'small',
      });
    }

    setFloatingPoints(prev => [...prev, ...newPoints]);

    // Remove after animation completes
    const timer = setTimeout(() => {
      setFloatingPoints(prev => 
        prev.filter(p => !newPoints.some(np => np.id === p.id))
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [trigger, points, position, matchPositions]);

  const getSizeClasses = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'large':
        return 'text-5xl';
      case 'medium':
        return 'text-4xl';
      default:
        return 'text-3xl';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {floatingPoints.map(point => (
          <motion.div
            key={point.id}
            className={`absolute font-bold ${getSizeClasses(point.size)}`}
            style={{
              fontFamily: "'Fredoka One', 'Comic Sans MS', cursive",
              left: point.x,
              top: point.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
              y: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.3, 1.1, 0.8],
              y: -100,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
              delay: point.delay,
              times: [0, 0.2, 0.5, 1],
            }}
          >
            {/* Glow background */}
            <motion.span
              className="absolute inset-0 blur-lg"
              style={{
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: point.delay,
              }}
            />
            
            {/* Main text with gradient */}
            <span
              className="relative drop-shadow-lg"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FFD700 30%, #FFA500 70%, #FF6B00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 10px rgba(255, 165, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            >
              +{point.points}
            </span>
            
            {/* Sparkle effects */}
            {[...Array(4)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-yellow-300 text-lg"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 10)],
                  y: [0, (i < 2 ? -1 : 1) * (20 + i * 5)],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: point.delay + 0.1 + i * 0.05,
                  ease: 'easeOut',
                }}
              >
                ✦
              </motion.span>
            ))}
            
            {/* Candy emoji burst */}
            {point.points >= 100 && [...Array(6)].map((_, i) => (
              <motion.span
                key={`candy-${i}`}
                className="absolute text-xl"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: [0, Math.cos((i / 6) * Math.PI * 2) * 60],
                  y: [0, Math.sin((i / 6) * Math.PI * 2) * 60],
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1,
                  delay: point.delay + 0.15 + i * 0.05,
                  ease: 'easeOut',
                }}
              >
                {['🍬', '🍭', '⭐', '✨', '💫', '🌟'][i]}
              </motion.span>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
