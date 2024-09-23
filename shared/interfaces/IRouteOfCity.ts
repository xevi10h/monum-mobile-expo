export default interface IRouteOfCity {
  id: string;
  title: string;
  description: string;
  rating?: number;
  stopsCount: number;
  cityId: string;
}
