/**
 * Background Music Component
 * - Plays fun, upbeat royalty-free music
 * - Persists mute preference in localStorage
 * - Candy-themed mute/unmute button
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  autoPlay?: boolean;
}

// Using free music from pixabay/mixkit - these are royalty-free
const MUSIC_TRACKS = [
  // Fun upbeat game music - using a data URL for a simple tone as fallback
  // In production, replace with actual royalty-free music files
  'https://cdn.pixabay.com/audio/2022/10/18/audio_7f7d3c3e06.mp3', // Happy upbeat
];

export default function BackgroundMusic({ autoPlay = true }: BackgroundMusicProps) {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('musicMuted');
      return saved === 'true';
    }
    return false;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(MUSIC_TRACKS[0]);
    audio.loop = true;
    audio.volume = 0.3; // 30% volume for background music
    audio.preload = 'auto';
    audioRef.current = audio;

    // Handle audio errors gracefully
    audio.addEventListener('error', () => {
      console.log('Music failed to load - continuing without music');
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle play/pause based on mute state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInteracted) return;

    if (isMuted) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay blocked - will play after user interaction
        setIsPlaying(false);
      });
    }
  }, [isMuted, hasInteracted]);

  // Save preference to localStorage
  useEffect(() => {
    localStorage.setItem('musicMuted', String(isMuted));
  }, [isMuted]);

  // Handle first user interaction to enable audio
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (!isMuted && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    // Listen for any user interaction
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted, isMuted]);

  const toggleMute = () => {
    setHasInteracted(true);
    setIsMuted(!isMuted);
  };

  return (
    <motion.button
      onClick={toggleMute}
      className={`
        fixed bottom-4 left-4 z-50
        w-12 h-12 sm:w-14 sm:h-14
        rounded-full shadow-lg
        flex items-center justify-center
        border-2 sm:border-4 border-white
        transition-all duration-200
        active:scale-95
        ${isMuted 
          ? 'bg-gradient-to-br from-gray-400 to-gray-500' 
          : 'bg-gradient-to-br from-pink-400 to-purple-500'
        }
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      ) : (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </motion.div>
      )}
      
      {/* Sound wave animation when playing */}
      {!isMuted && isPlaying && (
        <div className="absolute -right-1 -top-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (i + 1) * 4],
                y: [0, -(i + 1) * 2],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}

