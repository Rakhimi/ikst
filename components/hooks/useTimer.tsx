import { useState, useEffect } from 'react';

// Custom hook for countdown timer logic
export const useCountdownTimer = (initialTime: number, onTimerEnd: () => void) => {
  const [seconds, setSeconds] = useState<number>(() => {
    const savedTime = localStorage.getItem('timer');
    return savedTime ? parseInt(savedTime, 10) : initialTime;
  });

  const [isActive, setIsActive] = useState(true);

  const resetTimer = () => {
    setSeconds(initialTime);
    setIsActive(true);
    localStorage.setItem('timer', initialTime.toString());
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          localStorage.setItem('timer', newSeconds.toString());
          return newSeconds;
        });
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      localStorage.removeItem('timer');
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

