import {useQuery, UseQueryResult} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {queryKeys} from '../../../services/queryKeys'; // Sesuaikan path
import {
  AdminCrewAssignedOptionsData,
  AssignedEvent,
  GetAssignedCalendarParams,
} from '../types/adminAssigned';
import {
  fetchAdminCrewAssignedCalendar,
  fetchAdminCrewAssignedOptions,
} from '../types/adminAssignedService';

export const useAdminCrewAssignedOptionsQuery = (): UseQueryResult<
  AdminCrewAssignedOptionsData,
  AxiosError
> => {
  return useQuery<
    AdminCrewAssignedOptionsData,
    AxiosError,
    AdminCrewAssignedOptionsData,
    ReturnType<typeof queryKeys.adminCrewAssigned.options>
  >({
    queryKey: queryKeys.adminCrewAssigned.options(),
    queryFn: fetchAdminCrewAssignedOptions,
  });
};

export const useAdminCrewAssignedCalendarQuery = (
  params: GetAssignedCalendarParams,
): UseQueryResult<AssignedEvent[], AxiosError> => {
  return useQuery<
    AssignedEvent[],
    AxiosError,
    AssignedEvent[],
    ReturnType<typeof queryKeys.adminCrewAssigned.calendar> // TQueryKey
  >({
    queryKey: queryKeys.adminCrewAssigned.calendar(params),
    queryFn: () => fetchAdminCrewAssignedCalendar(params),
  });
};
