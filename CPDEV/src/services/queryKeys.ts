import {GetAssignedCalendarParams} from '../features/adminAssigned/types/adminAssigned';
import {GetAdminCrewsParams} from '../features/adminCrews/types';
import {GetContactResultsParams} from '../features/contactResult/types/contactResult';

export const queryKeys = {
  all: ['all'] as const,

  adminCrews: {
    all: () => ['adminCrews'] as const,
    lists: () => [...queryKeys.adminCrews.all(), 'list'] as const,
    list: (params?: GetAdminCrewsParams) =>
      [...queryKeys.adminCrews.lists(), {params}] as const,
    details: () => [...queryKeys.adminCrews.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.adminCrews.details(), id] as const,
  },

  contracts: {
    all: () => ['contracts'] as const,
    details: () => [...queryKeys.contracts.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.contracts.details(), id] as const,
  },

  adminCrewAssigned: {
    all: () => ['adminCrewAssigned'] as const,
    options: () => [...queryKeys.adminCrewAssigned.all(), 'options'] as const, // Untuk get_options
    calendars: () =>
      [...queryKeys.adminCrewAssigned.all(), 'calendars'] as const, // Dasar untuk semua list_calendar
    calendar: (params?: GetAssignedCalendarParams) =>
      [...queryKeys.adminCrewAssigned.calendars(), {params}] as const, // Untuk list_calendar dengan filter
  },

  contactResults: {
    all: () => ['contactResults'] as const, // Kunci dasar
    lists: () => [...queryKeys.contactResults.all(), 'list'] as const, // Dasar untuk semua list
    list: (params?: GetContactResultsParams) =>
      [...queryKeys.contactResults.lists(), {params}] as const, // List dengan filter/paginasi
    // details: () => [...queryKeys.contactResults.all(), 'detail'] as const, // Jika ada endpoint detail
    // detail: (id: string) => [...queryKeys.contactResults.details(), id] as const,
  },
};
