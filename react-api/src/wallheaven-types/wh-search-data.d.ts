import { WHPerPageValue } from './pagination';

export interface WHSearchDataItem {
  id: string;
  url: string;
  short_url: string;
  views: number;
  favorites: number;
  source: string;
  purity: string;
  category: string;
  dimension_x: number;
  dimension_y: number;
  resolution: string;
  ratio: string;
  file_size: number;
  file_type: string;
  created_at: string;
  colors: string[];
  path: string;
  thumbs: {
    large: string;
    original: string;
    small: string;
  };
}

export interface WHSearchMeta {
  current_page: number;
  last_page: number;
  per_page: WHPerPageValue;
  total: number;
  query:
    | string
    | null
    // --- for exact tag searches ---
    | {
        id: number;
        tag: string;
      };
  seed: string | null;
}

export interface WHSearchResponse {
  data: WHSearchDataItem[];
  meta: WHSearchMeta;
}
