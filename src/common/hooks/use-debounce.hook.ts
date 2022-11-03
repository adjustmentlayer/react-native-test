/**
 * @file
 * Debounce custom hook.
 */

import { useState, useEffect } from 'react';

const useDebounce = (value: any, delay: number) => {
  /**
   * State and setters for debounced value.
   */
  const [debouncedValue, setDebouncedValue] = useState(value);

  /**
   * Set up delay for debounce.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      !!value && setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
