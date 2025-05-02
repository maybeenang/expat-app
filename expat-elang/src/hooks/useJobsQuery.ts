import {useInfiniteQuery} from '@tanstack/react-query';
import {JobItemApi, JobListApiResponse, ProcessedListItem} from '../types/jobs';
import {
  fetchJobItemsApi,
  formatPostDate,
  formatSalary,
} from '../services/jobsService';

export const jobItemsQueryKey = (searchTerm?: string, location?: string) => [
  'jobItems',
  searchTerm ?? '',
  location ?? '',
];

export const useJobItemsInfinite = (searchTerm?: string, location?: string) => {
  return useInfiniteQuery<
    JobListApiResponse,
    Error,
    ProcessedListItem[],
    string[],
    number
  >({
    queryKey: jobItemsQueryKey(searchTerm, location),
    queryFn: ({pageParam}) =>
      fetchJobItemsApi({pageParam}, searchTerm, location),
    initialPageParam: 1,
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

// TODO: Tambahkan hook untuk detail job jika diperlukan (useJobDetailQuery)
