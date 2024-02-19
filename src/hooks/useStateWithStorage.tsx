import { useEffect, useState } from 'react';

export default function useStateWithStorage<T>(
  key: string,
  defaultValue: T
): [value: T, setValue: (value: T) => void] {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      } else {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (error) {
      return undefined;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Invalid stored value');
    }
  }, [key, value]);

  return [value, setValue];
}
