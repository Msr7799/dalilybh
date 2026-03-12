// ========== Dataset Types ==========
export interface DatasetConfig {
  id: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  category: string;
}

// ========== API Response Types ==========
export interface ApiResponse {
  total_count: number;
  results: PlaceRecord[];
}

export interface PlaceRecord {
  n?: number;
  name?: string;
  l_sm?: string;        // Arabic name
  type?: string;
  ltsnyf?: string;      // Arabic type
  subtype?: string;
  ltsnyf_lfr_y?: string; // Arabic subtype
  block?: number;
  governorate?: string;
  lmhfzt?: string;      // Arabic governorate
  x_longitude?: number;
  y_latitude?: number;
  location?: {
    lon?: number;
    lat?: number;
  };
}

// ========== Clean Place Model ==========
export interface Place {
  id: string;
  nameEn: string;
  nameAr: string;
  typeEn: string;
  typeAr: string;
  subtypeEn: string;
  subtypeAr: string;
  block: number | null;
  governorateEn: string;
  governorateAr: string;
  latitude: number | null;
  longitude: number | null;
  datasetId: string;
}

// ========== Weather Types ==========
export interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
  wind?: {
    speed: number;
    deg: number;
  };
  clouds?: {
    all: number;
  };
  visibility?: number;
  name: string;
}

// ========== App State Types ==========
export type Language = 'en' | 'ar';

export interface CategoryGroup {
  key: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  datasets: DatasetConfig[];
}
