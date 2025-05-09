import {GetAdminCrewsParams} from '../features/adminCrews/types';

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
};
