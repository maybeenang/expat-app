export interface FilterResponse {
  status: number;
  message: string;
  data: FilterItem[];
}

export interface FilterItem {
  value: string;
  name: string;
}
