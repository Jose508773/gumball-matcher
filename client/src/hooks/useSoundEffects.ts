/**
 * Sound Effects Hook
 * - Plays satisfying sound effects for game events
 * - Uses Web Audio API for low-latency playback
 * - Respects user's mute preference
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// Sound effect URLs - using free sounds from mixkit/pixabay
const SOUNDS = {
  // Match/pop sound
  match: 'https://cdn.pixabay.com/audio/2022/03/24/audio_78c916d49e.mp3',
  // Select/click sound  
  select: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3',
  // Combo/bonus sound
  combo: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3',
  // Level complete
  levelComplete: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3',
  // Game over
  gameOver: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8bafa3df86.mp3',
  // Invalid move
  invalid: 'https://cdn.pixabay.com/audio/2022/03/24/audio_2be76b62a4.mp3',
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
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Map<SoundType, AudioBuffer>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize AudioContext and preload sounds
  useEffect(() => {
    // Create audio context on first user interaction
    const initAudio = async () => {
      if (audioContextRef.current) return;
      
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        
        // Preload all sound effects
        const loadPromises = Object.entries(SOUNDS).map(async ([key, url]) => {
          try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
            audioBuffersRef.current.set(key as SoundType, audioBuffer);
          } catch (error) {
            console.log(`Failed to load sound: ${key}`);
          }
        });
        
        await Promise.all(loadPromises);
        setIsLoaded(true);
      } catch (error) {
        console.log('Web Audio API not supported');
      }
    };

    // Initialize on any user interaction
    const handleInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Save mute preference
  useEffect(() => {
    localStorage.setItem('soundMuted', String(isMuted));
  }, [isMuted]);

  // Play a sound effect
  const playSound = useCallback((type: SoundType, volume: number = 0.5) => {
    if (isMuted || !audioContextRef.current || !isLoaded) return;

    const buffer = audioBuffersRef.current.get(type);
    if (!buffer) return;

    try {
      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      source.start(0);
    } catch (error) {
      // Silently fail - sound effects are not critical
    }
  }, [isMuted, isLoaded]);

  // Convenience methods for common sounds
  const playMatch = useCallback(() => playSound('match', 0.4), [playSound]);
  const playSelect = useCallback(() => playSound('select', 0.3), [playSound]);
  const playCombo = useCallback(() => playSound('combo', 0.5), [playSound]);
  const playLevelComplete = useCallback(() => playSound('levelComplete', 0.6), [playSound]);
  const playGameOver = useCallback(() => playSound('gameOver', 0.5), [playSound]);
  const playInvalid = useCallback(() => playSound('invalid', 0.3), [playSound]);

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

