import { format, parseISO, isValid } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

// Singapore timezone constant
export const SINGAPORE_TZ = 'Asia/Singapore';

/**
 * Parse ISO string with Singapore timezone
 */
export function parseSgIso(iso: string): Date {
  try {
    const date = parseISO(iso);
    if (!isValid(date)) {
      throw new Error('Invalid ISO date format');
    }
    return toZonedTime(date, SINGAPORE_TZ);
  } catch (error) {
    console.error('Error parsing SG ISO date:', error);
    throw new Error('Failed to parse Singapore time');
  }
}

/**
 * Get current time in Singapore timezone
 */
export function nowSg(): Date {
  try {
    const now = new Date();
    return toZonedTime(now, SINGAPORE_TZ);
  } catch (error) {
    console.error('Error getting current SG time:', error);
    return new Date();
  }
}

/**
 * Add months in Singapore timezone context
 */
export function addMonthsSg(start: Date, months: number): Date {
  try {
    if (!isValid(start)) throw new Error('Invalid start date');
    
    // Convert to UTC, add months, then convert back to SG timezone
    const utcStart = fromZonedTime(start, SINGAPORE_TZ);
    const result = new Date(utcStart);
    result.setMonth(result.getMonth() + months);
    
    return toZonedTime(result, SINGAPORE_TZ);
  } catch (error) {
    console.error('Error adding months:', error);
    return new Date();
  }
}

/**
 * Get countdown parts from end time to now
 */
export function getCountdownParts(end: Date, now: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
} {
  try {
    if (!isValid(end) || !isValid(now)) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isEnded: true
      };
    }

    const difference = end.getTime() - now.getTime();
    
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isEnded: true
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
      isEnded: false
    };
  } catch (error) {
    console.error('Error calculating countdown parts:', error);
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isEnded: true
    };
  }
}
