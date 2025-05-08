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
};

// Contoh penggunaan:
// queryKeys.users.list({ active: true }) akan menghasilkan:
// ['users', 'list', { filters: { active: true } }]
// queryKeys.users.detail(1) akan menghasilkan:
// ['users', 'detail', 1]
