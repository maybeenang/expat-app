import {QueryClient} from '@tanstack/react-query';

export type RemoveItemFromQueryOptions<T> = {
  queryKey: any;
  deletedId: string;
  getIdFromItem: (item: T) => string;
  queryClient: QueryClient;
};

export function removeItemFromQuery<T>({
  queryKey,
  deletedId,
  getIdFromItem,
  queryClient,
}: RemoveItemFromQueryOptions<T>) {
  queryClient.setQueryData<T[]>(queryKey, oldData => {
    console.log(oldData);
    if (!oldData) {
      return oldData;
    }

    return oldData.filter(item => getIdFromItem(item) !== deletedId);
  });
}
