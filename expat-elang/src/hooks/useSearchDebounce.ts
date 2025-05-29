import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';

/**
 * Tipe untuk nilai yang bisa di-debounce.
 */
type DebounceableValue = any; // Anda bisa menggantinya dengan tipe yang lebih spesifik jika perlu

/**
 * Custom hook untuk debounce nilai, dengan API mirip useState.
 *
 * @template T Tipe dari nilai yang di-debounce.
 * @param {T} initialValue Nilai awal.
 * @param {number} delay Waktu tunda dalam milidetik.
 * @returns {[T, Dispatch<SetStateAction<T>>]} Tuple berisi nilai yang sudah di-debounce dan fungsi untuk mengatur nilai input.
 */
function useSearchDebounce<T extends DebounceableValue>(
  initialValue: T,
  delay: number,
): [T, Dispatch<SetStateAction<T>>] {
  // State untuk nilai input langsung (sebelum debounce)
  const [inputValue, setInputValue] = useState<T>(initialValue);
  // State untuk nilai yang sudah di-debounce
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    // Atur timeout untuk memperbarui debouncedValue setelah delay
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    // Bersihkan timeout jika inputValue atau delay berubah, atau jika komponen unmount
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]); // Jalankan ulang efek jika inputValue atau delay berubah

  // Kembalikan nilai yang sudah di-debounce dan setter untuk inputValue
  return [debouncedValue, setInputValue];
}

export default useSearchDebounce;
