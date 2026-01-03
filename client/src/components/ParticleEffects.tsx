/**
 * Particle Effects Component
 * Design Philosophy: Candy Pop Maximalism
 * - Celebratory confetti and sparkles
 * - Joyful, rewarding feedback
 * - Animated particle bursts at match locations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: string;
  originX: number;
  originY: number;
  velocityX: number;
  velocityY: number;
  type: 'sparkle' | 'confetti' | 'star' | 'ring';
  color: string;
  delay: number;
  size: number;
  rotation: number;
}

export interface ParticlePosition {
  x: number;
  y: number;
}

interface ParticleEffectsProps {
  trigger: boolean;
  position?: { x: number; y: number };
  positions?: ParticlePosition[]; // Multiple positions for match effects
  type?: 'match' | 'levelComplete' | 'combo';
}

const PARTICLE_COLORS = [
  '#FF1493', // Deep pink
  '#00FF7F', // Spring green
  '#00BFFF', // Deep sky blue
  '#FFD700', // Gold
  '#FF6347', // Tomato
  '#9400D3', // Dark violet
  '#FF69B4', // Hot pink
  '#7CFC00', // Lawn green
];

const CANDY_COLORS = [
  '#FF6B6B', // Red candy
  '#4ECDC4', // Teal candy
  '#FFE66D', // Yellow candy
  '#95E1D3', // Mint candy
  '#F38181', // Coral candy
  '#AA96DA', // Purple candy
];

export default function ParticleEffects({
  trigger,
  position = { x: 50, y: 50 },
  positions = [],
  type = 'match',
}: ParticleEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const newParticles: Particle[] = [];
    const effectPositions = positions.length > 0 ? positions : [position];
    
    // Particle count per position based on effect type
    const particlesPerPosition = type === 'levelComplete' ? 25 : type === 'combo' ? 18 : 12;

    effectPositions.forEach((pos, posIndex) => {
      for (let i = 0; i < particlesPerPosition; i++) {
        const angle = (i / particlesPerPosition) * Math.PI * 2 + Math.random() * 0.5;
        const velocity = 2 + Math.random() * 5;
        const velocityX = Math.cos(angle) * velocity;
        const velocityY = Math.sin(angle) * velocity;

        const particleTypes: Array<'sparkle' | 'confetti' | 'star' | 'ring'> = ['sparkle', 'confetti', 'star', 'ring'];
        const particleType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        const colors = type === 'match' ? CANDY_COLORS : PARTICLE_COLORS;

        newParticles.push({
          id: `${Date.now()}-${posIndex}-${i}-${Math.random()}`,
          originX: pos.x,
          originY: pos.y,
          velocityX,
          velocityY,
          type: particleType,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: posIndex * 0.03 + Math.random() * 0.08,
          size: 4 + Math.random() * 8,
          rotation: Math.random() * 360,
        });
      }
    });

    setParticles(prev => [...prev, ...newParticles]);

    // Clear particles after animation
    const timer = setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [trigger, type, position, positions]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute flex items-center justify-center"
            style={{
              left: particle.originX,
              top: particle.originY,
              width: particle.size,
              height: particle.size,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: particle.velocityX * 80,
              y: particle.velocityY * 80 + 40, // Add gravity effect
              scale: [0, 1.2, 1, 0.5, 0],
              opacity: [1, 1, 0.8, 0.4, 0],
              rotate: particle.rotation + Math.random() * 360,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.2 + Math.random() * 0.5,
              delay: particle.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {particle.type === 'sparkle' && (
              <motion.div
                className="rounded-full"
                style={{
                  width: '100%',
                  height: '100%',
                  background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                  boxShadow: `0 0 ${particle.size}px ${particle.color}, 0 0 ${particle.size * 2}px ${particle.color}`,
                }}
                animate={{
                  scale: [1, 1.5, 0.8, 1],
                }}
                transition={{
                  duration: 0.4,
                  repeat: 2,
                  delay: particle.delay,
                }}
              />
            )}
            
            {particle.type === 'confetti' && (
              <motion.div
                className="rounded-sm"
                style={{
                  width: '100%',
                  height: particle.size * 0.4,
                  background: particle.color,
                  boxShadow: `0 0 4px ${particle.color}`,
                }}
                animate={{
                  rotateX: [0, 180, 360],
                  rotateY: [0, 180, 360],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
              />
            )}
            
            {particle.type === 'star' && (
              <motion.div
                style={{
                  fontSize: particle.size * 1.5,
                  color: particle.color,
                  textShadow: `0 0 8px ${particle.color}`,
                }}
                animate={{
                  rotate: [0, 180, 360],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: 2,
                  delay: particle.delay,
                }}
              >
                ★
              </motion.div>
            )}
            
            {particle.type === 'ring' && (
              <motion.div
                className="rounded-full border-2"
                style={{
                  width: '100%',
                  height: '100%',
                  borderColor: particle.color,
                  boxShadow: `0 0 6px ${particle.color}, inset 0 0 6px ${particle.color}`,
                }}
                animate={{
                  scale: [0.5, 2, 3],
                  opacity: [1, 0.5, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: particle.delay,
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
