import { Place, PlaceRecord, ApiResponse } from './types';

const BASE_URL = 'https://data.gov.bh/api/explore/v2.1/';
const PAGE_SIZE = 100;

/**
 * Maps a raw API record to a clean Place model.
 * Mirrors the Android app's Place.fromRecord() logic.
 */
function mapRecordToPlace(record: PlaceRecord, index: number, datasetId: string): Place {
  const capitalize = (s?: string) => {
    if (!s) return '—';
    const trimmed = s.trim();
    if (!trimmed) return '—';
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  return {
    id: `${record.n ?? index}_${record.type ?? 'office'}_${datasetId}`,
    nameEn: record.name?.trim() || '—',
    nameAr: record.l_sm?.trim() || '—',
    typeEn: capitalize(record.type),
    typeAr: record.ltsnyf?.trim() || '—',
    subtypeEn: capitalize(record.subtype),
    subtypeAr: record.ltsnyf_lfr_y?.trim() || '—',
    block: record.block ?? null,
    governorateEn: capitalize(record.governorate),
    governorateAr: record.lmhfzt?.trim() || '—',
    latitude: record.y_latitude ?? record.location?.lat ?? null,
    longitude: record.x_longitude ?? record.location?.lon ?? null,
    datasetId,
  };
}

/**
 * Fetches records for a specific dataset from data.gov.bh API.
 * Supports pagination to load all records.
 */
export async function fetchDatasetRecords(
  datasetId: string,
  limit: number = PAGE_SIZE,
  offset: number = 0
): Promise<{ total: number; places: Place[] }> {
  const url = `${BASE_URL}catalog/datasets/${datasetId}/records?limit=${limit}&offset=${offset}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${datasetId}: ${response.status}`);
  }
  
  const data: ApiResponse = await response.json();
  const places = data.results.map((record, index) => 
    mapRecordToPlace(record, offset + index, datasetId)
  );
  
  return { total: data.total_count, places };
}

/**
 * Fetches ALL records for a dataset, handling pagination automatically.
 */
export async function fetchAllDatasetRecords(datasetId: string): Promise<Place[]> {
  const firstPage = await fetchDatasetRecords(datasetId, PAGE_SIZE, 0);
  let allPlaces = [...firstPage.places];

  if (firstPage.total > PAGE_SIZE) {
    const requests: Promise<{ total: number; places: Place[] }>[] = [];
    for (let offset = PAGE_SIZE; offset < firstPage.total; offset += PAGE_SIZE) {
      requests.push(fetchDatasetRecords(datasetId, PAGE_SIZE, offset));
    }
    const results = await Promise.all(requests);
    results.forEach(r => allPlaces.push(...r.places));
  }

  // Remove duplicates by ID
  const seen = new Set<string>();
  allPlaces = allPlaces.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  return allPlaces;
}

/**
 * Fetches weather data for Bahrain from OpenWeatherMap.
 * Uses our API route to keep the key server-side.
 */
export async function fetchWeather(lang: string = 'ar') {
  const response = await fetch(`/api/weather?lang=${lang}`);
  if (!response.ok) {
    throw new Error('Failed to fetch weather');
  }
  return response.json();
}
