import {useState, useEffect} from 'react';

/**
 * Custom hook untuk men-debounce sebuah nilai.
 * Hanya akan mengembalikan nilai terbaru setelah jeda waktu tertentu
 * sejak nilai terakhir kali berubah.
 *
 * @param value Nilai yang ingin di-debounce.
 * @param delay Jeda waktu debounce dalam milidetik (ms). Default 500ms.
 * @returns Nilai yang sudah di-debounce.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
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
