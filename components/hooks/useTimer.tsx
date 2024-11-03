import { useState, useEffect } from 'react';

// Custom hook for countdown timer logic
export const useCountdownTimer = (initialTime: number, onTimerEnd: () => void) => {
  const [seconds, setSeconds] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState(true);

  // Retrieve the saved time from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTime = localStorage.getItem('timer');
      if (savedTime) {
        setSeconds(parseInt(savedTime, 10));
      } else {
        localStorage.setItem('timer', initialTime.toString());
      }
    }
  }, [initialTime]);

  const resetTimer = () => {
    setSeconds(initialTime);
    setIsActive(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer', initialTime.toString());
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          if (typeof window !== 'undefined') {
            localStorage.setItem('timer', newSeconds.toString());
          }
          return newSeconds;
        });
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('timer');
      }
      onTimerEnd();
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, onTimerEnd]);

  // Helper to format time in minutes:seconds
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`; // Format to mm:ss
  };

  return { formattedTime: formatTime(seconds), seconds, isActive, resetTimer };
};
