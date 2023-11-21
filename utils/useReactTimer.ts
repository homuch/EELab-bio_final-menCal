import { useState, useEffect } from "react";
import { useCallback } from "react";
const useReactTimer = (timerInterval: number) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + timerInterval / 1000);
      }, timerInterval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, timerInterval]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const setTimerTo = useCallback((newTime: number) => {
    setTime(newTime);
  }, []);

  const resetTimer = useCallback(() => {
    setTime(0);
    setIsRunning(false);
  }, []);

  return {
    time,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerTo,
  };
};

export default useReactTimer;
