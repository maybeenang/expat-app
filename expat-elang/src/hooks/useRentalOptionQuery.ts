import {useQuery} from '@tanstack/react-query';
import {
  OptionGroup,
  fetchRentalOptionsApi,
} from '../services/options/rentalOptionService';
import {RentalOption} from '../types/rental';

export const rentalOptionsQueryKey = (type: OptionGroup) => [
  'rentalOptions',
  type,
];

export const useRentalOptionsQuery = (type: OptionGroup) => {
  return useQuery<RentalOption[], Error>({
    queryKey: rentalOptionsQueryKey(type),
    queryFn: () => fetchRentalOptionsApi<RentalOption>(type),
    staleTime: Infinity,
  });
};

export const useAllRentalOptions = () => {
  const typeOptionsQuery = useRentalOptionsQuery('type');
  const stayTypeOptionsQuery = useRentalOptionsQuery('stay_tipe');
  const typeDetailsOptionsQuery = useRentalOptionsQuery('type_details');
  const paidOptionsQuery = useRentalOptionsQuery('paid');
  const typeDetails2OptionsQuery = useRentalOptionsQuery('type_details2');

  return {
    type: typeOptionsQuery.data,
    stayType: stayTypeOptionsQuery.data,
    typeDetails: typeDetailsOptionsQuery.data,
    paid: paidOptionsQuery.data,
    typeDetails2: typeDetails2OptionsQuery.data,

    isLoading:
      typeOptionsQuery.isLoading ||
      stayTypeOptionsQuery.isLoading ||
      typeDetailsOptionsQuery.isLoading ||
      paidOptionsQuery.isLoading ||
      typeDetails2OptionsQuery.isLoading,

    isError:
      typeOptionsQuery.isError ||
      stayTypeOptionsQuery.isError ||
      typeDetailsOptionsQuery.isError ||
      paidOptionsQuery.isError ||
      typeDetails2OptionsQuery.isError,

    error:
      typeOptionsQuery.error ||
      stayTypeOptionsQuery.error ||
      typeDetailsOptionsQuery.error ||
      paidOptionsQuery.error ||
      typeDetails2OptionsQuery.error,
  };
};
