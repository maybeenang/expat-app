import {GetAdminCrewsParams} from '../features/adminCrews/types';

export const queryKeys = {
  all: ['all'] as const,

  users: {
    all: () => ['users'] as const,
    lists: () => [...queryKeys.users.all(), 'list'] as const,
    list: (filters?: Record<string, any>) =>
      [...queryKeys.users.lists(), {filters}] as const,
    details: () => [...queryKeys.users.all(), 'detail'] as const,
    detail: (id: number | string) =>
      [...queryKeys.users.details(), id] as const,
  },

  todos: {
    all: () => ['todos'] as const,
    lists: () => [...queryKeys.todos.all(), 'list'] as const,
    list: (status?: 'completed' | 'pending') =>
      [...queryKeys.todos.lists(), {status}] as const,
    details: () => [...queryKeys.todos.all(), 'detail'] as const,
    detail: (id: number) => [...queryKeys.todos.details(), id] as const,
  },
  adminCrews: {
    all: () => ['adminCrews'] as const, // Kunci dasar untuk semua yang berkaitan dengan adminCrews
    lists: () => [...queryKeys.adminCrews.all(), 'list'] as const, // Kunci untuk semua daftar adminCrews
    list: (params?: GetAdminCrewsParams) =>
      [...queryKeys.adminCrews.lists(), {params}] as const, // Kunci untuk daftar spesifik dengan parameter
    details: () => [...queryKeys.adminCrews.all(), 'detail'] as const, // Kunci untuk semua detail adminCrew
    detail: (id: string) => [...queryKeys.adminCrews.details(), id] as const, // Kunci untuk detail spesifik
  },
};

// Contoh penggunaan:
// queryKeys.users.list({ active: true }) akan menghasilkan:
// ['users', 'list', { filters: { active: true } }]
// queryKeys.users.detail(1) akan menghasilkan:
// ['users', 'detail', 1]
