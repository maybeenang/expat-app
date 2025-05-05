import {useQuery} from '@tanstack/react-query';
import {
  CompanyOption,
  CompanyOptionApiResponse,
  CurrencyOption,
  PaidStatusOption,
} from '../types/jobs';
import {
  fetchCompanyOptions,
  fetchCurrencyOptions,
  fetchPaidStatusOptions,
} from '../services/options/jobOptionService';

// --- Query Keys ---
export const paidStatusOptionsQueryKey = ['jobOptions', 'paidStatus'];
export const companyOptionsQueryKey = ['jobOptions', 'company'];
export const currencyOptionsQueryKey = ['jobOptions', 'currency'];

// --- Hooks ---

// Hook untuk Status Paid/Free
export const usePaidStatusOptions = () => {
  return useQuery<PaidStatusOption[], Error>({
    queryKey: paidStatusOptionsQueryKey,
    queryFn: fetchPaidStatusOptions,
    staleTime: Infinity,
  });
};

// Hook untuk Company
export const useCompanyOptions = () => {
  return useQuery<CompanyOptionApiResponse[], Error, CompanyOption[]>({
    queryKey: companyOptionsQueryKey,
    queryFn: fetchCompanyOptions,
    staleTime: 1000 * 60 * 30,
    select: data => {
      return data.map(item => ({
        value: item.id,
        label: item.company_name,
      }));
    },
  });
};

// Hook untuk Currency
export const useCurrencyOptions = () => {
  return useQuery<CurrencyOption[], Error>({
    queryKey: currencyOptionsQueryKey,
    queryFn: fetchCurrencyOptions,
    staleTime: Infinity,
  });
};

export const useAllJobOptions = () => {
  const paidStatusQuery = usePaidStatusOptions();
  const companyQuery = useCompanyOptions();
  const currencyQuery = useCurrencyOptions();

  return {
    paidStatus: paidStatusQuery.data,
    companies: companyQuery.data,
    currencies: currencyQuery.data,
    isLoading:
      paidStatusQuery.isLoading ||
      companyQuery.isLoading ||
      currencyQuery.isLoading,
    isError:
      paidStatusQuery.isError || companyQuery.isError || currencyQuery.isError,
    error: paidStatusQuery.error || companyQuery.error || currencyQuery.error,
  };
};
