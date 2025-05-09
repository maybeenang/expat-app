import {format, parse} from 'date-fns';

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  try {
    const parsedDate = parse(dateString, 'yyyy-MM-dd HH:mm:ss', new Date());
    return format(parsedDate, 'EEEE - MMMM d, yyyy');
  } catch (e) {
    return dateString; // Kembalikan string asli jika parsing gagal
  }
};
