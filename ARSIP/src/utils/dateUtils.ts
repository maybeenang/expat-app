export const DateUtils = {
  formatDate: dateString => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  },

  formatDateAndHour: dateString => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  },

  formatTime: dateString => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  },

  getCurrentMonthData: () => {
    const now = new Date();
    const monthIndex = now.getMonth();
    const MONTHS = [
      {id: '01', label: 'Jan'},
      {id: '02', label: 'Feb'},
      {id: '03', label: 'Mar'},
      {id: '04', label: 'Apr'},
      {id: '05', label: 'May'},
      {id: '06', label: 'Jun'},
      {id: '07', label: 'Jul'},
      {id: '08', label: 'Aug'},
      {id: '09', label: 'Sep'},
      {id: '10', label: 'Oct'},
      {id: '11', label: 'Nov'},
      {id: '12', label: 'Dec'},
    ];

    return MONTHS[monthIndex]; // Get the current month object
  },

  formatDateShort: date => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  },

  formatDateToYMD: dateString => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  },
};
