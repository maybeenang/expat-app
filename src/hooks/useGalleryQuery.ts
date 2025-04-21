// src/hooks/useGalleryQuery.ts (Ganti isinya)
import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchGalleryImagesApi} from '../services/galleryService';
import type {GalleryListApiResponse, GalleryItemData} from '../types/gallery';

export const galleryImagesQueryKey = ['galleryImages'];

export const useGalleryImages = () => {
  return useInfiniteQuery<
    GalleryListApiResponse,
    Error,
    GalleryItemData[],
    string[]
  >({
    queryKey: galleryImagesQueryKey,
    queryFn: ({pageParam = 1}) => fetchGalleryImagesApi({pageParam}),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    select: data => {
      const allImages: GalleryItemData[] = [];
      data.pages.forEach(page => {
        page.data.forEach(img => {
          allImages.push({
            id: img.id,
            imageUrl: img.img_url,
            link: img.hyperlink,
          });
        });
      });
      return allImages;
    },
  });
};
