export const queryKeys = {
  all: ['all'] as const,

  sepTerbuat: {
    all: () => ['sepTerbuat'] as const,
    lists: () => [...queryKeys.sepTerbuat.all(), 'list'] as const,
    list: (params?: any) =>
      [...queryKeys.sepTerbuat.lists(), {params}] as const,
    details: () => [...queryKeys.sepTerbuat.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.sepTerbuat.details(), id] as const,
  },
};
