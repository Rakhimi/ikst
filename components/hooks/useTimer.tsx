import React, { useState, useEffect } from 'react';

// Custom hook for countdown timer logic
const useCountdownTimer = (initialTime: number, onTimerEnd: () => void) => {
    const [seconds, setSeconds] = useState<number>(() => {
        // Try to get the saved time from localStorage
        const savedTime = localStorage.getItem('timer');
        return savedTime ? parseInt(savedTime, 10) : initialTime;
      });
  const [isActive, setIsActive] = useState(true); // Automatically start the countdown

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && seconds > 0) {
      // Start the timer and save the current value to localStorage every second
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          localStorage.setItem('timer', newSeconds.toString());
          return newSeconds;
        });
      }, 1000);
    } else if (seconds === 0) {
      // When the timer reaches zero, stop the timer and trigger the callback
      setIsActive(false);
      localStorage.removeItem('timer'); // Clear localStorage when the timer ends
      onTimerEnd();
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, onTimerEnd]);

  return { seconds, isActive };
};

const TimerDisplay = React.memo(({ seconds }: { seconds: number }) => {
  return (
    <div className="text-6xl font-bold text-gray-800">
      {Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0')}
      :
      {(seconds % 60).toString().padStart(2, '0')}
    </div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';

const Timer = () => {
  const initialTime = 45 * 60; // 45 minutes in seconds

  // Function to be triggered when the timer reaches 0
  const handleTimerEnd = () => {
    console.log('Timer has ended!');
    // You can trigger any other action here, such as a state update, API call, etc.
  };

  const { seconds } = useCountdownTimer(initialTime, handleTimerEnd);

  return (
    <div>
      <TimerDisplay seconds={seconds} />
      <div className="mt-4 text-xl font-semibold text-gray-700">
        {seconds > 0 ? '' : 'Time is up!'}
      </div>
    </div>
  );
};

export default Timer;
