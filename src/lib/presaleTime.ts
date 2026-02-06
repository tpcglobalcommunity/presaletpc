import { format, parseISO, isValid } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

// Singapore timezone constant
export const SINGAPORE_TZ = 'Asia/Singapore';

// Presale configuration - SINGLE SOURCE OF TRUTH
export const PRESALE_STAGE_STARTED_AT_SG = '2025-02-07T00:00:00+08:00'; // Feb 7, 2025, midnight Singapore time

/**
 * Safely parse a date string/number/Date in Singapore timezone
 */
export function parseStartSG(value: string | number | Date): Date | null {
  try {
    if (value instanceof Date) {
      return isValid(value) ? value : null;
    }
    
    if (typeof value === 'number') {
      const date = new Date(value);
      return isValid(date) ? date : null;
    }
    
    if (typeof value === 'string') {
      // Parse as ISO string with timezone
      const date = parseISO(value);
      if (!isValid(date)) return null;
      
      // Convert to Singapore timezone
      return toZonedTime(date, SINGAPORE_TZ);
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing start date:', error);
    return null;
  }
}

/**
 * Add months in Singapore timezone context
 */
export function addMonthsSG(start: Date, months: number): Date {
  try {
    if (!isValid(start)) return new Date();
    
    // Convert start to UTC, add months, then convert back to SG timezone
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
 * Get current time in Singapore timezone
 */
export function nowSG(): Date {
  try {
    const now = new Date();
    return toZonedTime(now, SINGAPORE_TZ);
  } catch (error) {
    console.error('Error getting current SG time:', error);
    return new Date();
  }
}

/**
 * Get presale end time (start + 6 months) in Singapore timezone
 */
export function getPresaleEndTimeSG(start: Date): Date | null {
  try {
    if (!isValid(start)) return null;
    return addMonthsSG(start, 6);
  } catch (error) {
    console.error('Error calculating end time:', error);
    return null;
  }
}

/**
 * Format date in Singapore timezone for display
 */
export function formatSG(date: Date, formatStr: string): string {
  try {
    if (!isValid(date)) return '';
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Check if presale is still active (end time > now)
 */
export function isPresaleActive(endTime: Date | null): boolean {
  if (!endTime || !isValid(endTime)) return false;
  const now = nowSG();
  return endTime > now;
}
