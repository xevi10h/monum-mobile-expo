export interface MarkerResponse {
  id: string;
  address: {
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  importance: number;
}
