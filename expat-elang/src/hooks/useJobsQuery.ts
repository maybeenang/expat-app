import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  CreateJobPayload,
  JobCategory,
  JobItemApi,
  JobListApiResponse,
  ProcessedJobDetail,
  ProcessedListItem,
  UpdateJobPayload,
} from '../types/jobs';
import {
  adminCreateJobApi,
  adminDeleteJobsApi,
  adminUpdateJobApi,
  fetchJobDetailApi,
  fetchJobItemsApi,
  formatExpiryDate,
  formatPostDate,
  formatSalary,
} from '../services/jobsService';
import axios from 'axios';

export const MY_JOBS_CATEGORY: JobCategory = {
  id: 'MY_JOBS_CATEGORY',
  name: 'Lowongan Saya',
};

export const allJobCategories: JobCategory[] = [
  {
    id: 'ALL',
    name: 'Semua Lowongan',
  },
  MY_JOBS_CATEGORY,
];

export const useJobCategoryQuery = (): JobCategory[] => {
  return allJobCategories;
};

export const jobItemsQueryKey = (
  searchTerm?: string,
  location?: string,
  categoryId?: string,
) => ['jobItems', searchTerm ?? '', location ?? '', categoryId ?? ''];

export const useJobItemsInfinite = ({
  searchTerm,
  location,
  categoryId,
}: {
  searchTerm?: string;
  location?: string;
  categoryId?: string;
}) => {
  return useInfiniteQuery<
    JobListApiResponse,
    Error,
    ProcessedListItem[],
    string[],
    number
  >({
    queryKey: jobItemsQueryKey(searchTerm, location, categoryId),
    queryFn: ({pageParam}) =>
      fetchJobItemsApi({pageParam}, searchTerm, location, categoryId),
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined;
    },
    select: data => {
      const allItems: ProcessedListItem[] = [];
      data.pages.forEach(page => {
        page.data.forEach(item => {
          if ('ads_location' in item && item.ads_location === 'JOBS') {
            allItems.push({
              type: 'ad',
              data: {
                id: item.id,
                imageUrl: item.img_url,
                externalUrl: item.external_url,
              },
            });
          } else if ('jobs_judul' in item) {
            const job = item as JobItemApi;
            allItems.push({
              type: 'job',
              data: {
                id: job.id,
                title: job.jobs_judul,
                companyName: job.company_name,
                location: `${job.jobs_location_city}, ${job.jobs_location_state}`,
                salaryFormatted: formatSalary(
                  job.salary_range_start,
                  job.salary_range_end,
                  job.salary_currency,
                ),
                // Construct URL logo dari slug
                logoUrl: null,
                postDateFormatted: formatPostDate(job.created_date),
                slug: job.jobs_slug,
                isPaid: job.is_paid === '1',
              },
            });
          }
        });
      });
      return allItems;
    },
  });
};

export const jobDetailQueryKey = (jobId: string, categoryId?: string) => [
  'jobDetail',
  jobId,
  categoryId ?? '',
];

export const useJobDetailQuery = ({
  jobId,
  categoryId,
}: {
  jobId: string;
  categoryId?: string;
}) => {
  return useQuery<JobItemApi, Error, ProcessedJobDetail>({
    queryKey: jobDetailQueryKey(jobId, categoryId),
    queryFn: () => fetchJobDetailApi(jobId, categoryId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    select: data => {
      return {
        id: data.id,
        title: data.jobs_judul,
        companyName: data.company_name,
        companyDescription: data.company_descriptions,
        companyWebsite: data.company_web || null, // Ambil dari company_web
        jobDescription: data.jobs_desc,
        location: `${data.jobs_location_city}, ${data.jobs_location_state}`,
        postDateFormatted: formatPostDate(data.created_date),
        expiryDateFormatted: formatExpiryDate(data.jobs_post_exp_date), // Format expiry date
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
      };
    },
  });
};

export const useCreateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobPayload) => adminCreateJobApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jobItems'],
      });
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }
      console.error('Error creating job:', error.message);
    },
  });
};

export const useUpdateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateJobPayload) => adminUpdateJobApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jobItems'],
      });
      queryClient.invalidateQueries({
        queryKey: ['jobDetail'],
      });
      queryClient.invalidateQueries({
        queryKey: ['jobDetailUnprocessed'],
      });
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }
      console.error('Error updating job:', error.message);
    },
  });
};

export const jobDetailUnprocessedQueryKey = (
  jobId: string,
  categoryId?: string,
) => ['jobDetailUnprocessed', jobId, categoryId ?? ''];

export const useJobDetailUnprocessedQuery = ({
  jobId,
  categoryId,
}: {
  jobId: string;
  categoryId?: string;
}) => {
  return useQuery<JobItemApi, Error>({
    queryKey: jobDetailUnprocessedQueryKey(jobId, categoryId),
    queryFn: () => fetchJobDetailApi(jobId, categoryId),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    select: data => {
      return data;
    },
  });
};

export const useJobDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => adminDeleteJobsApi(jobId),
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<{
        pages: JobListApiResponse[];
        pageParams: number[];
      }>(jobItemsQueryKey('', '', MY_JOBS_CATEGORY.id), oldData => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.filter(topic => topic.id !== deletedId),
          })),
        };
      });

      queryClient.invalidateQueries({
        queryKey: ['jobItems'],
      });
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', error.response.data);
      }
      console.error('Error deleting job:', error.message);
      throw new Error('Failed to delete job');
    },
  });
};
