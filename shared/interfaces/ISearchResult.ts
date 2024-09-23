export interface ISearchResult {
  id: string;
  name?: string;
  country: string;
  region?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  city: string;
  distance: number;
  importance?: number;
  hasMonums?: boolean;
  type: 'place' | 'city';
}
