/**
 * Sound Effects Hook
 * - Plays satisfying sound effects for game events
 * - Uses HTML Audio elements for reliable playback
 * - Respects user's mute preference
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// Sound effect URLs - using free sounds from pixabay
const SOUNDS = {
  // Match/pop sound - satisfying pop for candy/gumball matches
  match: 'https://cdn.pixabay.com/audio/2022/10/30/audio_67e930b413.mp3',
  // Select/click sound - soft tap  
  select: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3',
  // Combo/bonus sound - magical chime
  combo: 'https://cdn.pixabay.com/audio/2022/01/18/audio_8db1f1b5a2.mp3',
  // Level complete - victory fanfare
  levelComplete: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3',
  // Game over - soft game over
  gameOver: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8bafa3df86.mp3',
  // Invalid move - gentle error
  invalid: 'https://cdn.pixabay.com/audio/2022/03/24/audio_2be76b62a4.mp3',
};

// Volume levels for each sound
const VOLUMES: Record<string, number> = {
  match: 0.5,
  select: 0.25,
  combo: 0.6,
  levelComplete: 0.6,
  gameOver: 0.5,
  invalid: 0.35,
};

type SoundType = keyof typeof SOUNDS;

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soundMuted');
      return saved === 'true';
    }
    return false;
  });
  
  // Store preloaded audio elements
  const audioPoolRef = useRef<Map<SoundType, HTMLAudioElement[]>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload all sounds on mount
  useEffect(() => {
    const preloadSounds = () => {
      Object.entries(SOUNDS).forEach(([key, url]) => {
        // Create a pool of 3 audio elements per sound for overlapping playback
        const pool: HTMLAudioElement[] = [];
        for (let i = 0; i < 3; i++) {
          const audio = new Audio(url);
          audio.preload = 'auto';
          audio.volume = VOLUMES[key] || 0.5;
          pool.push(audio);
        }
        audioPoolRef.current.set(key as SoundType, pool);
      });
      setIsLoaded(true);
    };

    preloadSounds();
  }, []);

  // Save mute preference
  useEffect(() => {
    localStorage.setItem('soundMuted', String(isMuted));
  }, [isMuted]);

  // Play a sound effect using pooled audio elements
  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;

    const pool = audioPoolRef.current.get(type);
    if (!pool || pool.length === 0) return;

    // Find an audio element that's not playing, or use the first one
    const audio = pool.find(a => a.paused || a.ended) || pool[0];
    
    try {
      audio.currentTime = 0;
      audio.volume = VOLUMES[type] || 0.5;
      audio.play().catch(() => {
        // Ignore autoplay errors - user hasn't interacted yet
      });
    } catch {
      // Silently fail
    }
  }, [isMuted]);

  // Convenience methods for common sounds
  const playMatch = useCallback(() => playSound('match'), [playSound]);
  const playSelect = useCallback(() => playSound('select'), [playSound]);
  const playCombo = useCallback(() => playSound('combo'), [playSound]);
  const playLevelComplete = useCallback(() => playSound('levelComplete'), [playSound]);
  const playGameOver = useCallback(() => playSound('gameOver'), [playSound]);
  const playInvalid = useCallback(() => playSound('invalid'), [playSound]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    isMuted,
    toggleMute,
    playSound,
    playMatch,
    playSelect,
    playCombo,
    playLevelComplete,
    playGameOver,
    playInvalid,
    isLoaded,
  };
}

