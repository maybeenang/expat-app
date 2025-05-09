import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {fetchContractDetailById} from '../services/contractService';
import {queryKeys} from '../../../services/queryKeys'; // Sesuaikan path
import {ContractDetailData} from '../types/contract';

export const useContractDetailQuery = (
  contractId: string | undefined,
): UseQueryResult<ContractDetailData, AxiosError> => {
  return useQuery<
    ContractDetailData,
    AxiosError,
    ContractDetailData,
    ReturnType<typeof queryKeys.contracts.detail>
  >({
    queryKey: queryKeys.contracts.detail(contractId!),
    queryFn: () => fetchContractDetailById(contractId!),
    enabled: !!contractId,
  });
};
