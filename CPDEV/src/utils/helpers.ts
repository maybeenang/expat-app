import {format, isValid, parse, parseISO} from 'date-fns';

export const parseUnavailableDatesString = (
  jsonStringDateArray: string | null | undefined,
): Date[] => {
  if (!jsonStringDateArray) {
    return [];
  }

  try {
    const dateStrings: string[] = JSON.parse(jsonStringDateArray);

    if (!Array.isArray(dateStrings)) {
      return [];
    }

    const parsedDates: Date[] = dateStrings
      .map(dateStr => {
        if (typeof dateStr !== 'string') {
          return null; // Abaikan item yang bukan string
        }
        const dateObj = parseISO(dateStr); // parseISO adalah pilihan yang baik untuk format YYYY-MM-DD
        return isValid(dateObj) ? dateObj : null;
      })
      .filter((dateObj): dateObj is Date => dateObj !== null); // Filter keluar hasil null (tanggal tidak valid)

    return parsedDates;
  } catch (error) {
    return []; // Kembalikan array kosong jika ada error parsing JSON
  }
};

export const formatDatesArray = (
  dates: Date[],
  dateFormatString: string = 'yyyy-MM-dd',
  separator: string = '\n',
): string => {
  if (!dates || dates.length === 0) {
    return '';
  }
  return dates
    .map(dateObj => format(dateObj, dateFormatString))
    .join(separator);
};

export const formattedUnavailableDates = (unavailable_date: string | null) => {
  if (!unavailable_date) {
    return null; // Atau string kosong, atau "N/A" tergantung preferensi
  }

  const parsedDates = parseUnavailableDatesString(unavailable_date);

  if (parsedDates.length === 0) {
    return 'Tidak ada'; // Atau "N/A", atau biarkan null
  }
  return formatDatesArray(parsedDates); // Format yang lebih pendek untuk kartu
};

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const parsedDate = parse(dateString, 'yyyy-MM-dd HH:mm:ss', new Date());
    return format(parsedDate, 'EEEE - MMMM d, yyyy');
  } catch (e) {
    return dateString; // Kembalikan string asli jika parsing gagal
  }
};

export const formatDateForBottomSheet = (dateString: Date): string => {
  if (!dateString) return 'N/A';
  try {
    return format(dateString, 'yyyy-MM-dd');
  } catch (e) {
    return '';
  }
};
