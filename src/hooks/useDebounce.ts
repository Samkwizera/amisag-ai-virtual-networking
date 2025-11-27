import { useEffect, useState } from 'react';

/**
 * Debounce hook to delay execution of a value
 * Useful for optimizing button clicks and other rapid interactions
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to prevent rapid button clicks
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [lastRun, setLastRun] = useState(0);

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRun >= delay) {
      setLastRun(now);
      return callback(...args);
    }
  }) as T;
}

