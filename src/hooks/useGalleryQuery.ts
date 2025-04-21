import {useQuery} from '@tanstack/react-query';
import {fetchGalleryImagesApi} from '../services/galleryService';
import type {GalleryImageApi, GalleryItemData} from '../types/gallery';

export const galleryImagesQueryKey = ['galleryImages'];

export const useGalleryImages = () => {
  return useQuery<GalleryImageApi[], Error, GalleryItemData[]>({
    queryKey: galleryImagesQueryKey,
    queryFn: fetchGalleryImagesApi,
    staleTime: 1000 * 60 * 10,
    select: data => {
      return data.map(img => ({
        id: img.id,
        imageUrl: img.img_url,
        link: img.hyperlink,
      }));
    },
  });
};
