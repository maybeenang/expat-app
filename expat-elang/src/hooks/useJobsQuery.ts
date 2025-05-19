import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  adminCreateJobApi,
  adminDeleteJobsApi,
  adminUpdateJobApi,
  fetchJobDetailApi,
  fetchJobItemsApi,
  formatPostDate,
  formatSalary,
} from '../services/jobsService';
import type {
  JobCategory,
  JobListApiResponse,
  ProcessedJobItem,
  JobItemApi,
  ProcessedJobDetail,
  CreateJobPayload,
  UpdateJobPayload,
} from '../types/jobs';
import {AxiosError} from 'axios';
import {useAuthStore} from '../store/useAuthStore';
import {queryKeys} from '../services/queryKeys';

export const MY_JOBS_CATEGORY: JobCategory = {
  id: 'MY_JOBS_CATEGORY',
  name: 'Lowongan Saya',
};

export const useJobCategoriesQuery = () => {
  const {isLoggedIn} = useAuthStore();

  return useQuery<JobCategory[], Error, JobCategory[]>({
    queryKey: queryKeys.jobKeys.all,
    queryFn: () => Promise.resolve([]), // TODO: Implement fetchJobCategoriesApi
    staleTime: Infinity,
    select: data => {
      const deletedEndLineData = data.map(item => ({
        ...item,
        name: item.name.replace(/\n/g, ''),
      }));

      if (isLoggedIn) {
        return [MY_JOBS_CATEGORY, ...deletedEndLineData];
      }
      return deletedEndLineData;
    },
  });
};

export const useJobItemsInfinite = (
  searchTerm?: string,
  location?: string,
  categoryId?: string,
) => {
  return useInfiniteQuery<
    JobListApiResponse,
    Error,
    ProcessedJobItem[],
    readonly ['job', 'items', string, string, string],
    number
  >({
    queryKey: queryKeys.jobKeys.items(searchTerm, location, categoryId),
    queryFn: ({pageParam}) =>
      fetchJobItemsApi({pageParam}, searchTerm, location, categoryId),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    select: data => {
      const allItems: ProcessedJobItem[] = [];
      data.pages.forEach(page => {
        page.data.forEach(item => {
          if ('jobs_judul' in item) {
            const job = item as JobItemApi;
            allItems.push({
              id: job.id,
              title: job.jobs_judul,
              companyName: job.company_name,
              location: `${job.jobs_location_city}, ${job.jobs_location_state}`,
              salaryFormatted: formatSalary(
                job.salary_range_start,
                job.salary_range_end,
                job.salary_currency,
              ),
              logoUrl: job.company_logo_url || null,
              postDateFormatted: formatPostDate(job.created_date),
              slug: job.jobs_slug,
              isPaid: job.is_paid === '1',
            });
          }
        });
      });
      return allItems;
    },
  });
};

export const useJobDetailQuery = (jobId: string, categoryId?: string) => {
  return useQuery<JobItemApi, Error, ProcessedJobDetail>({
    queryKey: queryKeys.jobKeys.detail(jobId, categoryId),
    queryFn: () => fetchJobDetailApi(jobId, categoryId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5,
    select: data => ({
      id: data.id,
      title: data.jobs_judul,
      companyName: data.company_name,
      companyDescription: data.company_descriptions,
      companyWebsite: data.company_web || null,
      jobDescription: data.jobs_desc,
      location: `${data.jobs_location_city}, ${data.jobs_location_state}`,
      postDateFormatted: formatPostDate(data.created_date),
      expiryDateFormatted: formatPostDate(data.jobs_post_exp_date),
      salaryFormatted: formatSalary(
        data.salary_range_start,
        data.salary_range_end,
        data.salary_currency,
      ),
      logoUrl: data.company_logo_url || null,
      contactEmail: data.contact_info_email || null,
      contactPhone: data.contact_info_phone || null,
      contactWeb: data.contact_info_web || null,
      slug: data.jobs_slug,
      isPaid: data.is_paid === '1',
    }),
  });
};

export const useJobDetailUnprocessedQuery = (
  jobId: string,
  categoryId?: string,
) => {
  return useQuery<JobItemApi, Error>({
    queryKey: queryKeys.jobKeys.detailUnprocessed(jobId, categoryId),
    queryFn: () => fetchJobDetailApi(jobId, categoryId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useJobCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobPayload) => adminCreateJobApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobKeys.items('', '', MY_JOBS_CATEGORY.id),
      });
    },
    onError: (error: Error) => {
      if (error instanceof AxiosError && error.response) {
        console.error('Error response:', error.response.data);
      }
    },
  });
};

export const useJobUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateJobPayload) => adminUpdateJobApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobKeys.items('', '', MY_JOBS_CATEGORY.id),
      });
    },
    onError: (error: Error) => {
      if (error instanceof AxiosError && error.response) {
        console.error('Error response:', error.response.data);
      }
    },
  });
};

export const useJobDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => adminDeleteJobsApi(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobKeys.items('', '', MY_JOBS_CATEGORY.id),
      });
    },
    onError: (error: Error) => {
      if (error instanceof AxiosError && error.response) {
        console.error('Error response:', error.response.data);
      }
    },
  });
};
