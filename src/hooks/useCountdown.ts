import { useState, useEffect, useMemo } from 'react';
import { toZonedTime } from 'date-fns-tz';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function useCountdown(targetDate: Date): CountdownTime {
  const [now, setNow] = useState(() => toZonedTime(new Date(), 'Asia/Jakarta'));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(toZonedTime(new Date(), 'Asia/Jakarta'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const targetTime = useMemo(() => targetDate.getTime(), [targetDate]);

  const timeLeft = useMemo(() => {
    const difference = targetTime - now.getTime();
    
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false
    };
  }, [targetDate, now]);

  return timeLeft;
}
