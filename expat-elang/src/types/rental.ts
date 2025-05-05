import {Asset} from 'react-native-image-picker';

export interface RentalCategory {
  value: string;
  label: string;
}

export interface RentalCategoriesApiResponse {
  status: number;
  message: string;
  data: RentalCategory[];
}

export interface RentalImageFeature {
  id: string;
  id_rents: string;
  s3_slug: string;
  img_title: string;
  img_alt: string;
  is_feature: string;
  created_date: string;
  created_by: string;
  img_url: string;
}

export interface RentalItemApi {
  id: string;
  id_users: string;
  is_paid: string;
  is_paid_display: string;
  type: string;
  rent_title: string;
  rent_address: string;
  rent_address2: string;
  rent_city: string;
  rent_state: string;
  rent_zip: string;
  rent_descriptions: string;
  rent_availability: string;
  rent_stay_min_number: string;
  rent_stay_min_type: string; // e.g., "DAY"
  rent_stay_max_number: string;
  rent_stay_max_type: string;
  rent_price_number: string; // String number
  rent_price_type: string; // e.g., "DAY", "MONTH", "YEAR"
  rent_slug: string;
  details_main: any[];
  details_feature: any[];
  details_in_room: any[];
  details_shared_common: any[];
  details_house_rules: any[];
  image_feature: RentalImageFeature | null;
  image_lists: any[];
  saved: boolean;
}

export interface RentalListApiResponse {
  status: number;
  message: string;
  page: number;
  limit: number;
  total_pages: number;
  total_data: number;
  data: RentalItemApi[];
}

export interface ProcessedRentalItem {
  id: string;
  title: string;
  location: string;
  priceFormatted: string[];
  imageUrl: string | null;
  typeLabel: string;
  slug: string;
  isMine: boolean;
}

export interface RentalDetailApiResponse {
  status: number;
  message: string;
  data: RentalItemApi;
}

export interface ProcessedRentalDetail {
  id: string;
  title: string;
  location: string;
  priceFormatted: string[];
  description: string;
  imageUrls: string[];
  typeLabel: string;
  descExpandable: boolean;
  contactNumber?: string;
}

export interface RentalOptionApiResponse<T> {
  status: number;
  message: string;
  data: T[];
}

export interface RentalOption {
  value: string;
  label: string;
}

export interface KtDetailItem {
  id?: string | null; // ID detail item ini
  type_details: RentalOption | string | undefined; // Asumsi API kembalikan objek opsi
  nama_details1: string | null; // Bisa null dari API
  nama_details2: RentalOption | string | undefined; // Bisa objek opsi atau null
  desc: string | null;
}

export interface CreateRentalFormData {
  title: string;
  status_paid: string;
  type: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  availability: string;
  price: string;
  stay_min: string;
  stay_max: string;
  stay_type: string;
  kt_details: KtDetailItem[];
}

export interface UpdateRentalFormData extends CreateRentalFormData {
  id: string;
  rent_slug: string;
  images?: Asset[];
}
